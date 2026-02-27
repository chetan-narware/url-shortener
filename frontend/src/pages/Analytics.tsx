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
} from "recharts";

interface AnalyticsData {
  shortCode: string;
  longUrl: string;
  totalClicks: number;
  clicksByDate: {
    date: string;
    clicks: number;
  }[];
}

const Analytics = () => {
  const { shortCode } = useParams();
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get(`/analytics/${shortCode}`);
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch analytics");
      }
    };

    fetchAnalytics();
  }, [shortCode]);

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-300 flex items-center justify-center">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-gray-800 p-6 rounded-lg shadow border border-gray-700">

        {/* Header */}
        <h1 className="text-2xl font-semibold mb-6">
          Analytics for {data.shortCode}
        </h1>

        {/* Summary */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <div className="bg-gray-700 p-4 rounded">
            <p className="text-sm text-gray-400">Total Clicks</p>
            <p className="text-2xl font-bold">
              {data.totalClicks}
            </p>
          </div>

          <div className="bg-gray-700 p-4 rounded">
            <p className="text-sm text-gray-400">Long URL</p>
            <p className="text-sm break-all">
              {data.longUrl}
            </p>
          </div>

        </div>

        {/* Chart */}
        <div className="bg-gray-700 p-6 rounded h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.clicksByDate}>
              <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  color: "#fff",
                }}
                labelStyle={{ color: "#fff" }}
              />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Analytics;