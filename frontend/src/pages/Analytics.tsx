import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";

interface ClickByDate {
  date: string;
  clicks: number;
}

interface AnalyticsData {
  shortCode: string;
  longUrl: string;
  totalClicks: number;
  clicksByDate: ClickByDate[];
}

const Analytics = () => {
  const { shortCode } = useParams();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get(`/analytics/${shortCode}`);
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [shortCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-300 flex items-center justify-center">
        Loading analytics...
      </div>
    );
  }

  if (!data || data.clicksByDate.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-300 flex items-center justify-center">
        No analytics data available.
      </div>
    );
  }

  // ===== Derived Metrics =====
  const averageClicks =
    data.totalClicks / (data.clicksByDate.length || 1);

  const peakDay = data.clicksByDate.reduce(
    (max, current) =>
      current.clicks > max.clicks ? current : max,
    data.clicksByDate[0]
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">
            Analytics
          </h1>
          <p className="text-gray-400 break-all">
            Short Code: {data.shortCode}
          </p>
          <p className="text-gray-500 text-sm break-all">
            {data.longUrl}
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400">Total Clicks</p>
            <p className="text-3xl font-bold mt-2">
              {data.totalClicks}
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400">Average / Day</p>
            <p className="text-3xl font-bold mt-2">
              {averageClicks.toFixed(2)}
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400">Peak Day</p>
            <p className="text-lg font-semibold mt-2">
              {peakDay.date}
            </p>
            <p className="text-gray-300 text-sm">
              {peakDay.clicks} clicks
            </p>
          </div>

        </div>

        {/* Line Chart */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-96 mb-10">
          <h2 className="text-lg font-semibold mb-4">
            Click Trend (Line)
          </h2>

          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={data.clicksByDate}>
              <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Area Chart */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-96 mb-10">
          <h2 className="text-lg font-semibold mb-4">
            Trend (Area)
          </h2>

          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={data.clicksByDate}>
              <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  color: "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey="clicks"
                stroke="#10B981"
                fill="#10B98133"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-96">
          <h2 className="text-lg font-semibold mb-4">
            Daily Distribution (Bar)
          </h2>

          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={data.clicksByDate}>
              <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  color: "#fff",
                }}
              />
              <Bar
                dataKey="clicks"
                fill="#6366F1"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Analytics;