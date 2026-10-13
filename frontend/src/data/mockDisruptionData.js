export const disruption = {
  type: "Train Cancelled",
  message: "Train 12645 has been cancelled. Your original journey is no longer feasible.",
};

export const originalJourney = {
  from: "Chennai",
  to: "Bengaluru",
  segments: [
    { id: 1, mode: "Train", status: "cancelled" },
    { id: 2, mode: "Metro", status: "affected" },
    { id: 3, mode: "Bus", status: "affected" },
  ],
};

export const alternatives = [
  { id: 1, label: "Most Reliable", modes: "Train → Bus", time: "5h 10m", cost: 520, probability: 91 },
  { id: 2, label: "Fastest", modes: "Bus → Metro", time: "4h 30m", cost: 650, probability: 72 },
  { id: 3, label: "Cheapest", modes: "Bus → Bus", time: "5h 40m", cost: 400, probability: 78 },
];


export const comparison = [
  { name: "Fastest", time: 4, cost: 600, reliability: 70, probability: 72 },
  { name: "Cheapest", time: 5, cost: 400, reliability: 75, probability: 78 },
  { name: "Recommended", time: 4.5, cost: 500, reliability: 90, probability: 91 },
];