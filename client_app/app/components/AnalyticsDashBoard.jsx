import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend
} from "recharts";

const COLORS = {
  positive: "#34d399",
  negative: "#f87171",
  neutral: "#60a5fa"
};


const MONTHS = [
  "",
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
  "Dec"
];

export default function AnalyticsDashboard({ analytics }) {

  if (!analytics) return null;

 const submissionData = analytics.submissionRate.map(item => ({
  name: `${MONTHS[item._id.month]} ${item._id.year}`,
  submissions: item.count
}));

  const sentimentData = analytics.sentiment.map(item => ({
    name: item._id,
    value: item.count
  }));

  const sourceData = analytics.sourceDistribution.map(item => ({
    name: item._id,
    value: item.count
  }));

  const positive =
    analytics.sentiment.find(s => s._id === "POSITIVE")?.count || 0;

  const negative =
    analytics.sentiment.find(s => s._id === "NEGATIVE")?.count || 0;

  const total = analytics.totalTestimonials;

  return (
    <div className="space-y-10">


      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-xl shadow-lg">
          <p className="text-sm text-blue-100">Total Testimonials</p>
          <p className="text-3xl font-bold mt-2">{total}</p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-6 rounded-xl shadow-lg">
          <p className="text-sm text-green-100">Positive</p>
          <p className="text-3xl font-bold mt-2">{positive}</p>
        </div>

        <div className="bg-gradient-to-br from-red-600 to-rose-700 p-6 rounded-xl shadow-lg">
          <p className="text-sm text-red-100">Negative</p>
          <p className="text-3xl font-bold mt-2">{negative}</p>
        </div>

      </div>


      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">
            📈 Testimonial Submission Rate
          </h2>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={submissionData}>

            <defs>
              <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#374151"/>

          <XAxis
  dataKey="name"
  stroke="#9ca3af"
  tick={{ fontSize: 12 }}
/>

            <YAxis
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
            />

            <Tooltip
              contentStyle={{
                background: "#111827",
                border: "1px solid #374151"
              }}
            />

            <Area
              type="monotone"
              dataKey="submissions"
              stroke="#60a5fa"
              fillOpacity={1}
              fill="url(#colorSub)"
              strokeWidth={3}
            />

            <Line
              type="monotone"
              // dataKey="submissions"
              stroke="#60a5fa"
              strokeWidth={3}
              dot={{ r: 4 }}
            />

          </AreaChart>
        </ResponsiveContainer>

      </div>

      <div className="grid md:grid-cols-2 gap-6">

       

        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">

          <h2 className="text-lg font-semibold mb-4">
            😊 Sentiment Distribution
          </h2>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>

              <Pie
                data={sentimentData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {sentimentData.map((entry, index) => {

                  const color =
                    entry.name === "POSITIVE"
                      ? COLORS.positive
                      : entry.name === "NEGATIVE"
                      ? COLORS.negative
                      : COLORS.neutral;

                  return (
                    <Cell key={index} fill={color} />
                  );

                })}
              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>
          </ResponsiveContainer>

        </div>


        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">

          <h2 className="text-lg font-semibold mb-4">
            🌐 Source Distribution
          </h2>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>

              <Pie
                data={sourceData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {sourceData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={[
                      "#60a5fa",
                      "#34d399",
                      "#facc15",
                      "#f87171",
                      "#a78bfa"
                    ][index % 5]}
                  />
                ))}
              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>
          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}