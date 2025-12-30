import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { RefreshCw, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { DashboardData, DrillDownCOW } from "@shared/api";
import { RegionalDistributionCard } from "./components/dashboard/RegionalDistributionCard";
import { StatusSummaryCards } from "./components/dashboard/StatusSummaryCards";
import { OffAirByVendorCard } from "./components/dashboard/OffAirByVendorCard";
import { OffAirByWarehouseCard } from "./components/dashboard/OffAirByWarehouseCard";
import { CowAgeBreakdownCard } from "./components/dashboard/CowAgeBreakdownCard";
import { DrillDownModal } from "./components/dashboard/DrillDownModal";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  // Drill-down modal state
  const [drillDownOpen, setDrillDownOpen] = useState(false);
  const [drillDownTitle, setDrillDownTitle] = useState("");
  const [drillDownData, setDrillDownData] = useState<DrillDownCOW[]>([]);
  const [drillDownLoading, setDrillDownLoading] = useState(false);

  async function fetchDashboard() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/cows/dashboard");
      if (!response.ok) throw new Error("Failed to fetch dashboard data");
      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch dashboard data");
      console.error("Error fetching dashboard:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSync() {
    setSyncing(true);
    try {
      const response = await fetch("/api/cows/sync", { method: "POST" });
      if (!response.ok) throw new Error("Sync failed");
      await fetchDashboard();
      alert("Sync successful! Dashboard updated.");
    } catch (err) {
      alert(`Sync failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setSyncing(false);
    }
  }

  async function handleDrillDown(
    title: string,
    params: Record<string, string>
  ) {
    setDrillDownTitle(title);
    setDrillDownOpen(true);
    setDrillDownLoading(true);

    try {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`/api/cows/dashboard/drill-down?${query}`);
      if (!response.ok) throw new Error("Failed to fetch drill-down data");
      const result = await response.json();
      setDrillDownData(result.data);
    } catch (err) {
      console.error("Error fetching drill-down data:", err);
      setDrillDownData([]);
    } finally {
      setDrillDownLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();

    // Auto-refresh every 30 minutes
    const interval = setInterval(fetchDashboard, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatLastUpdated = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd-MM-yyyy HH:mm");
    } catch {
      return "Unknown";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">COW Registry Dashboard</h1>
            <p className="text-muted-foreground">
              Operational snapshot: Regional distribution, deployment status, warehouse inventory
            </p>
          </div>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all font-medium"
          >
            <RefreshCw size={18} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Syncing..." : "Sync Now"}
          </button>
        </div>

        {/* Last Updated */}
        {dashboardData && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 px-4 py-2 rounded-lg">
            <span>Last updated: {formatLastUpdated(dashboardData.lastSyncedAt)}</span>
            <span className="text-xs">({dashboardData.totalCows} total COWs)</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <AlertCircle size={20} className="text-red-600" />
            <div>
              <p className="text-red-700 font-medium">Failed to load dashboard</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-48 bg-secondary/30 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : dashboardData ? (
          <div className="space-y-6">
            {/* Section 1: Status Summary (Top Priority) */}
            <div>
              <StatusSummaryCards
                data={dashboardData.statusSummary}
                onDrillDown={(status) => handleDrillDown(
                  status === "ON-AIR" 
                    ? "ON-AIR COWs" 
                    : status === "OFF-AIR"
                      ? "Warehouse / Not Deployed"
                      : "STANDBY COWs",
                  { siteStatus: status }
                )}
              />
            </div>

            {/* Section 2 & 3: Regional + Warehouse (2-column on desktop) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RegionalDistributionCard
                data={dashboardData.regionalDistribution}
                onDrillDown={(region) => handleDrillDown(
                  `${region} - COW Distribution`,
                  { region }
                )}
              />
              <OffAirByVendorCard
                data={dashboardData.offAirByVendor}
                onDrillDown={(vendor) => handleDrillDown(
                  `${vendor} - Warehouse Stock`,
                  { vendor, siteStatus: "OFF-AIR" }
                )}
              />
            </div>

            {/* Section 4: New vs Old */}
            <CowAgeBreakdownCard
              data={dashboardData.cowAgeBreakdown}
              onDrillDown={(age) => handleDrillDown(
                `${age} COWs`,
                { cowAge: age }
              )}
            />
          </div>
        ) : null}

        {/* Drill-Down Modal */}
        <DrillDownModal
          isOpen={drillDownOpen}
          title={drillDownTitle}
          data={drillDownData}
          loading={drillDownLoading}
          onClose={() => setDrillDownOpen(false)}
        />
      </div>
    </Layout>
  );
}
