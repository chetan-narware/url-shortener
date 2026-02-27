import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";

interface UrlData {
  shortCode: string;
  longUrl: string;
  clickCount: number;
}

const Dashboard = () => {
  const { logout } = useAuth();

  const [urls, setUrls] = useState<UrlData[]>([]);
  const [longUrl, setLongUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch user analytics
  const fetchUrls = async () => {
    try {
      const res = await api.get("/analytics/user");
      setUrls(res.data.urls);
    } catch (error) {
      console.error("Failed to fetch URLs");
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  // Create URL
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/urls", { longUrl });
      setLongUrl("");
      fetchUrls();
    } catch (error) {
      alert("Failed to create URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* Create URL Form */}
        <form onSubmit={handleCreate} className="mb-6">
          <input
            type="text"
            placeholder="Enter long URL"
            className="w-full p-2 border rounded mb-3"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {loading ? "Creating..." : "Create Short URL"}
          </button>
        </form>

        {/* URL List */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Your URLs</h2>

          {urls.length === 0 ? (
            <p>No URLs created yet.</p>
          ) : (
            <div className="space-y-4">
              {urls.map((url) => (
                <div
                  key={url.shortCode}
                  className="border p-4 rounded"
                >
                  <p className="font-semibold">
                    Short:
                    <a
                      href={`http://localhost:3000/api/urls/${url.shortCode}`}
                      target="_blank"
                      className="text-blue-600 ml-2"
                    >
                      {url.shortCode}
                    </a>
                  </p>

                  <p className="text-sm text-gray-600">
                    Long: {url.longUrl}
                  </p>

                  <p className="text-sm">
                    Clicks: {url.clickCount}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;