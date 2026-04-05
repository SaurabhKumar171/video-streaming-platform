import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/authSlice";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const { error, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));
    // result.payload now contains { id, role, organizationId, username }
    if (!result.error) navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded shadow-md w-96"
      >
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Login
        </h2>

        {error && (
          <p className="mb-4 text-sm text-red-500 bg-red-50 p-2 rounded border border-red-200">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-400"
            required
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-400"
            required
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>

        <button
          disabled={loading}
          className="w-full p-2 text-white bg-blue-600 rounded font-bold hover:bg-blue-700 transition"
        >
          {loading ? "Checking..." : "Login"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          New here?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Create an Organization
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
