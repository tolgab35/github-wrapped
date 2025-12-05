import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
);

export default function CommitActivity({ monthlyData = {} }) {
  // List all 12 months
  const allMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const values = allMonths.map((m) => monthlyData[m] || 0);

  const data = {
    labels: allMonths,
    datasets: [
      {
        label: "Commits",
        data: values,
        fill: true,
        tension: 0.45,
        borderColor: "rgba(125, 82, 255, 1)",
        backgroundColor: "rgba(125, 82, 255, 0.10)",
        borderWidth: 3,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: "rgba(255,255,255,0.65)",
          font: { size: 12 },
          // Show label for every other month (Jan, Mar, May, Jul, Sep, Nov, etc.)
          callback: (value, index) => {
            return index % 2 === 0 ? allMonths[index] : "";
          },
        },
        grid: { display: false },
      },
      y: { display: false },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.6)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
  };

  const totalCommits = values.reduce((a, b) => a + b, 0);

  return (
    <div
      className="
        bg-white/5 border border-white/10 backdrop-blur-xl
        rounded-3xl p-8 shadow-[0_0_40px_rgba(80,80,255,0.15)]
        w-full
      "
    >
      {/* TOP INFO */}
      <div className="mb-6">
        <p className="text-sm text-white/60">Commit Activity</p>

        <h2 className="text-3xl font-bold text-white mt-1">
          {totalCommits.toLocaleString()} Commits
        </h2>

        <p className="text-sm text-white/40 mt-2">Last Year Trend</p>
      </div>

      {/* CHART AREA */}
      <div className="h-48 relative">
        <div className="absolute inset-0 blur-3xl bg-purple-700/20 rounded-2xl" />
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
