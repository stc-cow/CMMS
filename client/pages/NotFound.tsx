import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout";
import { Home, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center space-y-8">
        <div className="w-24 h-24 bg-destructive/10 rounded-2xl flex items-center justify-center">
          <AlertCircle className="w-12 h-12 text-destructive" />
        </div>

        <div className="space-y-3">
          <h1 className="text-5xl font-bold text-foreground">404</h1>
          <p className="text-xl text-muted-foreground">
            Page not found
          </p>
          <p className="text-sm text-muted-foreground/70 max-w-md">
            The page you're looking for doesn't exist. It may have been moved or
            deleted.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full text-left">
          <p className="text-xs text-muted-foreground font-mono break-all mb-3">
            Path: <span className="text-foreground font-semibold">{location.pathname}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Please use the navigation menu to find what you're looking for, or
            return to the dashboard.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:shadow-lg transition-shadow"
        >
          <Home size={18} />
          Return to Dashboard
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
