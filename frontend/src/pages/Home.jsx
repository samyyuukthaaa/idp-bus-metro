import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  BarChart3,
  Map,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Reliability-aware routing",
    text: "Every route gets an on-time probability from a trained model, so you see the risk and not only the fastest time.",
  },
  {
    icon: AlertTriangle,
    title: "Disruption recovery",
    text: "Cancel any leg of your journey and the system finds the alternative most likely to still meet your deadline.",
  },
  {
    icon: BarChart3,
    title: "Route comparison",
    text: "Compare time, transfers and success probability side by side across the options.",
  },
  {
    icon: Map,
    title: "Bus + metro on one map",
    text: "See your whole Bengaluru journey with every stop, transfer and walking leg on an interactive map.",
  },
];

const steps = [
  "Choose your start and destination",
  "Compare ranked routes",
  "Simulate a cancellation",
  "Get the best recovery route",
];

function Home() {
  return (
    <div>
      <section className="bg-gradient-to-br from-blue-700 to-blue-500 text-white px-10 py-16">
        <div className="max-w-3xl">
          <p className="uppercase tracking-wide text-blue-100 text-sm font-semibold">
            Bengaluru bus + metro
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mt-3">
            Plan journeys that survive disruptions
          </h1>
          <p className="text-lg text-blue-100 mt-4">
            A resilience-aware planner that ranks routes by how likely you are to arrive on
            time, and re-plans when something goes wrong.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link
              to="/plan"
              className="flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50"
            >
              Plan Your Journey <ArrowRight size={18} />
            </Link>
            <Link
              to="/simulation"
              className="flex items-center gap-2 border border-white/60 px-6 py-3 rounded-lg hover:bg-white/10"
            >
              Try a disruption simulation
            </Link>
          </div>
        </div>
      </section>

      <section className="px-10 py-12">
        <h2 className="text-2xl font-bold mb-6">What makes it different</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Icon size={20} />
              </div>
              <h3 className="font-bold mb-2">{title}</h3>
              <p className="text-sm text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-10 pb-16">
        <h2 className="text-2xl font-bold mb-6">How it works</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={step}
              className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-3"
            >
              <span className="w-8 h-8 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {i + 1}
              </span>
              <p className="font-medium">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;