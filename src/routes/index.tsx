import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import DashboardPage from "../pages/Dashboard";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import { useCurrentUser } from "../hooks/useCurrentUser";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route element={<GuestOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function ProtectedRoute() {
  const { user, loading } = useCurrentUser();

  if (loading) {
    return <RouteLoadingCard title="Carregando" message="Validando sua sessão..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function GuestOnlyRoute() {
  const { user, loading } = useCurrentUser();

  if (loading) {
    return <RouteLoadingCard title="Carregando" message="Verificando acesso..." />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

interface RouteLoadingCardProps {
  title: string;
  message: string;
}

function RouteLoadingCard({ title, message }: RouteLoadingCardProps) {
  return (
    <section className="page-card">
      <h2>{title}</h2>
      <p>{message}</p>
    </section>
  );
}
