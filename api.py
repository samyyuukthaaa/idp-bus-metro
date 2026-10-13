import os
import pickle
from datetime import datetime
from itertools import islice

import networkx as nx
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

BASE = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(BASE, "graph_cache.pkl"), "rb") as f:
    G, stop_names, stop_coords, name_to_id = pickle.load(f)

with open(os.path.join(BASE, "deadline_model.pkl"), "rb") as f:
    bundle = pickle.load(f)
deadline_model, deadline_features = bundle["model"], bundle["features"]

app = FastAPI(title="Resilient Journey Planner API")

# Lets the React app (localhost) call this API
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- helpers (copied from app.py, without Streamlit) ----------
def get_mode(a, b):
    edge_data = G.get_edge_data(a, b)
    if not edge_data:
        return "bus"
    if isinstance(G, (nx.MultiGraph, nx.MultiDiGraph)):
        best = min(edge_data.values(), key=lambda d: d.get("weight", float("inf")))
        trip_id = str(best.get("trip_id", ""))
    else:
        trip_id = str(edge_data.get("trip_id", ""))
    if trip_id == "WALK_TRANSFER":
        return "walk"
    if trip_id.startswith("metro"):
        return "metro"
    return "bus"


def get_edge_weight(graph, a, b):
    edge_data = graph.get_edge_data(a, b)
    if not edge_data:
        return 0
    if isinstance(graph, (nx.MultiGraph, nx.MultiDiGraph)):
        best = min(edge_data.values(), key=lambda d: d.get("weight", float("inf")))
        return best.get("weight", 0)
    return edge_data.get("weight", 0)


def path_total_time(graph, path):
    return sum(get_edge_weight(graph, path[i], path[i + 1]) for i in range(len(path) - 1))


def get_legs(path):
    """Group consecutive same-mode edges into legs."""
    legs = []
    for i in range(len(path) - 1):
        a, b = path[i], path[i + 1]
        mode = get_mode(a, b)
        seconds = get_edge_weight(G, a, b)
        if legs and legs[-1]["mode"] == mode:
            legs[-1]["end"] = b
            legs[-1]["end_idx"] = i + 1
            legs[-1]["seconds"] += seconds
        else:
            legs.append({"mode": mode, "start": a, "end": b,
                         "start_idx": i, "end_idx": i + 1, "seconds": seconds})
    return legs


def extract_route_features(path):
    num_transfers = 0
    total_scheduled_time = 0
    min_buffer = float("inf")
    bus_legs = 0
    total_legs = len(path) - 1
    prev_mode = None

    for i in range(len(path) - 1):
        a, b = path[i], path[i + 1]
        scheduled = get_edge_weight(G, a, b)
        mode = get_mode(a, b)
        if mode == "bus":
            bus_legs += 1
        if prev_mode is not None and mode != prev_mode:
            num_transfers += 1
            min_buffer = min(min_buffer, scheduled)
        total_scheduled_time += scheduled
        prev_mode = mode

    return {
        "num_transfers": num_transfers,
        "total_scheduled_time": total_scheduled_time,
        "min_buffer": min_buffer if min_buffer != float("inf") else 999,
        "pct_bus": bus_legs / total_legs if total_legs else 0,
    }


def predict_success_probability(path, deadline_slack, hour, day_of_week):
    feats = extract_route_features(path)
    row = pd.DataFrame([{
        "num_transfers": feats["num_transfers"],
        "total_scheduled_time": feats["total_scheduled_time"],
        "min_buffer": feats["min_buffer"],
        "pct_bus": feats["pct_bus"],
        "hour": hour,
        "day_of_week": day_of_week,
        "deadline_slack": deadline_slack,
    }])[deadline_features]
    return float(deadline_model.predict_proba(row)[0][1])


def get_ranked_routes(start_id, end_id, deadline_slack, hour, day_of_week, k=5):
    try:
        gen = nx.shortest_simple_paths(G, source=start_id, target=end_id, weight="weight")
        candidates = list(islice(gen, k))
    except (nx.NetworkXNoPath, nx.NodeNotFound):
        return []
    if not candidates:
        return []

    times = [path_total_time(G, p) for p in candidates]
    max_time = max(times) if max(times) > 0 else 1

    scored = []
    for path, total_time in zip(candidates, times):
        feats = extract_route_features(path)
        prob = predict_success_probability(path, deadline_slack, hour, day_of_week)
        score = (0.4 * total_time / max_time) + (0.25 * feats["num_transfers"] / 5) + (0.35 * (1 - prob))
        scored.append({"path": path, "total_time": total_time,
                       "success_prob": prob, "score": score})
    scored.sort(key=lambda r: r["score"])
    return scored


def reroute_after_cancellation(path, leg_index, end_id, deadline_slack, hour, day_of_week, k=3):
    legs = get_legs(path)
    if leg_index < 0 or leg_index >= len(legs):
        return None, None, "Invalid leg selected."
    leg = legs[leg_index]

    # Remove every connection in the cancelled leg
    G_disrupted = G.copy()
    for j in range(leg["start_idx"], leg["end_idx"]):
        if G_disrupted.has_edge(path[j], path[j + 1]):
            G_disrupted.remove_edge(path[j], path[j + 1])

    prefix = path[: leg["start_idx"] + 1]
    try:
        gen = nx.shortest_simple_paths(G_disrupted, source=leg["start"], target=end_id, weight="weight")
        suffixes = list(islice(gen, k))
    except (nx.NetworkXNoPath, nx.NodeNotFound):
        return None, None, "No alternative route found after this cancellation."
    if not suffixes:
        return None, None, "No alternative route found after this cancellation."

    candidates = []
    for suffix in suffixes:
        full = prefix[:-1] + suffix
        prob = predict_success_probability(full, deadline_slack, hour, day_of_week)
        candidates.append({"path": full, "success_prob": prob,
                           "total_time": path_total_time(G, full)})
    best = max(candidates, key=lambda c: c["success_prob"])
    return best, candidates, None


# ---------- converting results to JSON for React ----------
def route_summary(path, success_prob=None, score=None):
    coords = [
        [float(stop_coords[s]["stop_lat"]), float(stop_coords[s]["stop_lon"])]
        for s in path
        if s in stop_coords and "stop_lat" in stop_coords[s] and "stop_lon" in stop_coords[s]
    ]
    return {
        "total_minutes": round(path_total_time(G, path) / 60, 1),
        "num_transfers": extract_route_features(path)["num_transfers"],
        "success_probability": None if success_prob is None else round(success_prob * 100),
        "score": None if score is None else round(float(score), 3),
        "legs": [
            {
                "mode": leg["mode"],
                "from": stop_names.get(leg["start"], str(leg["start"])),
                "to": stop_names.get(leg["end"], str(leg["end"])),
                "minutes": round(leg["seconds"] / 60, 1),
            }
            for leg in get_legs(path)
        ],
        "stops": [stop_names.get(s, str(s)) for s in path],
        "coordinates": coords,
    }


def lookup(name):
    if name not in name_to_id:
        raise HTTPException(status_code=404, detail=f"Unknown stop: {name}")
    return name_to_id[name]


class RouteRequest(BaseModel):
    start: str
    end: str
    buffer_pct: int = 20


class DisruptRequest(RouteRequest):
    route_index: int = 0
    leg_index: int = 0


# ---------- URLs ----------
@app.get("/stops")
def stops():
    result = []
    for name in sorted(name_to_id.keys()):
        sid = name_to_id[name]
        c = stop_coords.get(sid, {})
        lat, lon = c.get("stop_lat"), c.get("stop_lon")
        result.append({
            "name": name,
            "lat": float(lat) if lat is not None else None,
            "lon": float(lon) if lon is not None else None,
        })
    return {"stops": result}


@app.post("/routes")
def routes(req: RouteRequest):
    if req.start == req.end:
        raise HTTPException(status_code=400, detail="Start and destination must be different.")
    start_id, end_id = lookup(req.start), lookup(req.end)
    now = datetime.now()
    slack = 1 + req.buffer_pct / 100

    ranked = get_ranked_routes(start_id, end_id, slack, now.hour, now.weekday())
    if not ranked:
        return {"routes": []}

    fastest = min(range(len(ranked)), key=lambda i: ranked[i]["total_time"])
    reliable = max(range(len(ranked)), key=lambda i: ranked[i]["success_prob"])

    out = []
    for i, r in enumerate(ranked):
        item = route_summary(r["path"], r["success_prob"], r["score"])
        tags = []
        if i == 0:
            tags.append("Recommended")
        if i == fastest:
            tags.append("Fastest")
        if i == reliable:
            tags.append("Most Reliable")
        item["id"] = i
        item["tags"] = tags
        out.append(item)
    return {"routes": out}


@app.post("/disrupt")
def disrupt(req: DisruptRequest):
    start_id, end_id = lookup(req.start), lookup(req.end)
    now = datetime.now()
    slack = 1 + req.buffer_pct / 100

    ranked = get_ranked_routes(start_id, end_id, slack, now.hour, now.weekday())
    if not ranked or req.route_index >= len(ranked):
        raise HTTPException(status_code=404, detail="Route not found.")
    original = ranked[req.route_index]

    best, candidates, error = reroute_after_cancellation(
        original["path"], req.leg_index, end_id, slack, now.hour, now.weekday()
    )
    original_summary = route_summary(original["path"], original["success_prob"], original["score"])

    if error:
        return {"recovered": False, "message": error, "original": original_summary}

    return {
        "recovered": True,
        "original": original_summary,
        "recovery": route_summary(best["path"], best["success_prob"]),
        "alternatives": [
            {**route_summary(c["path"], c["success_prob"]), "selected": c["path"] == best["path"]}
            for c in candidates
        ],
        "minutes_difference": round((best["total_time"] - original["total_time"]) / 60, 1),
    }