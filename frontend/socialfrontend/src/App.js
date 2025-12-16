import "./App.css";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./authContext/UserCotenxt";
import RegisterForm from "./pages/RegisterForm";
import LoginForm from "./pages/LoginForm";
import Profile from "./pages/Profile";
import { Toaster } from "sonner";
import UserDetails from "./pages/UserDetails";
import Notifications from "./pages/Notifications";

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route
              path="/"
              element={user ? <Home /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/notifications"
              element={
                user ? <Notifications /> : <Navigate to="/login" replace />
              }
            />

            <Route
              path="/register"
              element={user ? <Navigate to="/" replace /> : <RegisterForm />}
            />
            <Route
              path="/login"
              element={user ? <Navigate to="/" replace /> : <LoginForm />}
            />

            <Route path="/userdetails/:id" element={<UserDetails />} />

            <Route path="/profile/:id" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  );
}

export default App;
