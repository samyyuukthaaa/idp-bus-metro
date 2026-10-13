export const disruption = {
  type: "Bus Cancelled",
  message: "Your bus from Silk Board has been cancelled. Your original journey is no longer feasible.",
};

export const originalJourney = {
  from: "Silk Board",
  to: "Indiranagar",
  segments: [
    { id: 1, mode: "Bus", status: "cancelled" },
    { id: 2, mode: "Metro", status: "affected" },
    { id: 3, mode: "Walk", status: "affected" },
  ],
};

export const alternatives = [
  { id: 1, label: "Most Reliable", modes: "Metro → Walk", time: "62 min", cost: 60, probability: 91 },
  { id: 2, label: "Fastest", modes: "Bus → Metro → Walk", time: "48 min", cost: 80, probability: 72 },
  { id: 3, label: "Cheapest", modes: "Bus → Walk", time: "75 min", cost: 30, probability: 78 },
];

export const comparison = [
  { name: "Fastest", time: 0.8, cost: 80, reliability: 70, probability: 72 },
  { name: "Cheapest", time: 1.25, cost: 30, reliability: 75, probability: 78 },
  { name: "Recommended", time: 1.0, cost: 60, reliability: 90, probability: 91 },
];

export const disruptionOptions = [
  "Bus Cancellation",
  "30-Minute Delay",
  "Severe Delay",
  "Missed Connection",
];

export const simulationResult = {
  before: { path: "Silk Board → Bus → Metro → Indiranagar", probability: 88 },
  after: {
    traditional: "❌ No feasible journey",
    resilient: "✅ Generated 3 alternatives",
  },
};