import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./features/authSlice";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UserList from "./pages/UserList";
import Upload from "./pages/Upload";
import VideoLibrary from "./pages/VideoLibrary";
import WatchVideo from "./pages/WatchVideo";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Loading Guard: Prevents the app from showing the Login screen
  // for a split second while checking for an existing cookie.
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {user && <Navbar />}
        <div className="container mx-auto px-4 py-8">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/register"
              element={!user ? <Register /> : <Navigate to="/dashboard" />}
            />

            {/* General Protected Routes */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["admin", "editor", "viewer"]} />
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/library" element={<VideoLibrary />} />
              <Route path="/watch/:id" element={<WatchVideo />} />
            </Route>

            {/* Content Creation Routes (Admin & Editor Only) */}
            <Route
              element={<ProtectedRoute allowedRoles={["admin", "editor"]} />}
            >
              <Route path="/upload" element={<Upload />} />
            </Route>

            {/* Admin Management (Admin Only) */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/users" element={<UserList />} />
            </Route>

            {/* Default Catch-all */}
            <Route
              path="*"
              element={<Navigate to={user ? "/dashboard" : "/login"} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
