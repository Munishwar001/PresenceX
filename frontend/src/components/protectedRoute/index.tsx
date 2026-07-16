import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../../store/auth.store";
import { Spinner } from "../ui/spinner";

export default function ProtectedRoute() {
  const user = useAuthStore((state) => state.user);
  const refresh = useAuthStore((state) => state.refresh);
  const [checkingSession, setCheckingSession] = useState(!user);

  useEffect(() => {
    if (user) {
      setCheckingSession(false);
      return;
    }

    let cancelled = false;

    refresh().then(() => {
      if (!cancelled) setCheckingSession(false);
    });

    return () => {
      cancelled = true;
    };
  }, [user, refresh]);

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Spinner className="h-8 w-8 animate-spin rounded-full border-2 border-brand-100 border-t-brand-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
