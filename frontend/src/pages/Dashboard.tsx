import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

interface UrlData {
  shortCode: string;
  longUrl: string;
  clickCount: number;
}

const Dashboard = () => {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [longUrl, setLongUrl] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const copyToClipboard = (shortCode: string) => {
    const fullUrl = `${import.meta.env.VITE_API_URL}/api/urls/${shortCode}`;
    navigator.clipboard.writeText(fullUrl);
    alert("Link copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Create URL Card */}
        <div className="bg-gray-800 p-6 rounded-lg shadow mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Create Short URL
          </h2>

          <form onSubmit={handleCreate} className="flex gap-3">
            <input
              type="text"
              placeholder="Enter long URL"
              className="flex-1 p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </form>
        </div>

        {/* URLs List */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Your URLs
          </h2>

          {urls.length === 0 ? (
            <p className="text-gray-400">
              No URLs created yet.
            </p>
          ) : (
            <div className="space-y-4">
              {urls.map((url) => (
                <div
                  key={url.shortCode}
                  className="bg-gray-800 p-5 rounded-lg shadow border border-gray-700"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="text-sm text-gray-400">Short Link</p>
                      <a
                       href={`${import.meta.env.VITE_API_URL}/api/urls/${url.shortCode}`}
                        target="_blank"
                        className="text-blue-400 hover:underline break-all"
                      >
                        {url.shortCode}
                      </a>
                    </div>

                    <button
                      onClick={() => copyToClipboard(url.shortCode)}
                      className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm"
                    >
                      Copy
                    </button>
                  </div>

                  <p className="text-sm text-gray-400 mb-2">
                    {url.longUrl}
                  </p>

                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm">
                      Clicks:{" "}
                      <span className="font-semibold">
                        {url.clickCount}
                      </span>
                    </span>

                    <Link
                      to={`/analytics/${url.shortCode}`}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
                    >
                      View Analytics
                    </Link>
                  </div>
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