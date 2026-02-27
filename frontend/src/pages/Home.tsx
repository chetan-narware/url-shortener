import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-6">

      <h1 className="text-4xl font-bold mb-6 text-center">
        Simplify Your Links.
      </h1>

      <p className="text-gray-400 max-w-xl text-center mb-8">
        Shortify helps you generate short, shareable links with built-in
        analytics. Track clicks, monitor trends, and manage your URLs
        in one simple dashboard.
      </p>

      {isAuthenticated ? (
        <Link
          to="/dashboard"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded"
        >
          Go to Dashboard
        </Link>
      ) : (
        <div className="space-x-4">
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="border border-gray-600 hover:bg-gray-800 px-6 py-3 rounded"
          >
            Login
          </Link>
        </div>
      )}

    </div>
  );
};

export default Home;