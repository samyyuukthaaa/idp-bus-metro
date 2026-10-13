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