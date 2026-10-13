import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000" });

export const getStops = () => api.get("/stops").then((r) => r.data.stops);

export const getRoutes = (body) =>
  api.post("/routes", body).then((r) => r.data.routes);

export const disruptRoute = (body) =>
  api.post("/disrupt", body).then((r) => r.data);