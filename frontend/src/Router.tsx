import { Route, Routes } from "react-router";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";
import Employees from "./pages/Employees";
import Organisation from "./pages/Organisation";
import ProtectedRoute from "./components/protectedRoute";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="employees" element={<Employees />} />
          <Route path="organisation" element={<Organisation />} />
        </Route>
      </Route>
    </Routes>
  );
}
