import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { Link } from "react-router-dom";
import { Package, Search, Filter, RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import { COWListItem, COWListResponse } from "@/../shared/api";
import { StatusBadge } from "@/components/cow/StatusBadge";
import { format } from "date-fns";

export default function COWRegistry() {
  const [cows, setCows] = useState<COWListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>("");
  const [syncing, setSyncing] = useState(false);

  // Search and filter state
  const [searchCowId, setSearchCowId] = useState("");
  const [filterRegion, setFilterRegion] = useState("");
  const [filterSiteStatus, setFilterSiteStatus] = useState("");
  const [filterVendor, setFilterVendor] = useState("");
  const [filterCity, setFilterCity] = useState("");

  // Fetch COW list
  async function fetchCOWs() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        ...(searchCowId && { cowId: searchCowId }),
        ...(filterRegion && { region: filterRegion }),
        ...(filterSiteStatus && { siteStatus: filterSiteStatus }),
        ...(filterVendor && { vendor: filterVendor }),
        ...(filterCity && { city: filterCity }),
      });

      const response = await fetch(`/api/cows/list?${params}`);
      if (!response.ok) throw new Error("Failed to fetch COWs");

      const data: COWListResponse = await response.json();
      setCows(data.data);
      setTotal(data.total);
      if (data.data.length > 0) {
        setLastSyncedAt(data.data[0].lastSyncedAt);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch COWs");
      console.error("Error fetching COWs:", err);
    } finally {
      setLoading(false);
    }
  }

  // Trigger manual sync
  async function handleSync() {
    setSyncing(true);
    try {
      const response = await fetch("/api/cows/sync", { method: "POST" });
      if (!response.ok) throw new Error("Sync failed");
      const data = await response.json();
      alert(`Sync successful! ${data.count} COWs updated.`);
      setPage(1);
      fetchCOWs();
    } catch (err) {
      alert(`Sync failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setSyncing(false);
    }
  }

  // Initial load
  useEffect(() => {
    fetchCOWs();
  }, [page, pageSize]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchCOWs();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchCowId, filterRegion, filterSiteStatus, filterVendor, filterCity]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2 mb-2">
              <Package size={32} className="text-primary" />
              COW Registry
            </h1>
            <p className="text-muted-foreground text-sm">
              Master database of all COW assets across regions and sites
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50"
            >
              {syncing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw size={18} />
                  Sync Now
                </>
              )}
            </button>
          </div>
        </div>

        {/* Last Sync Info */}
        {lastSyncedAt && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-3">
            <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              Last synced from Google Sheets:{" "}
              <span className="font-medium">
                {format(new Date(lastSyncedAt), "dd-MM-yyyy HH:mm")}
              </span>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Search size={18} className="text-muted-foreground" />
            <span className="font-medium text-foreground">Search & Filter</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* COW ID Search */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                COW ID
              </label>
              <input
                type="text"
                placeholder="Search by COW ID..."
                value={searchCowId}
                onChange={(e) => setSearchCowId(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-background"
              />
            </div>

            {/* Region Filter */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Region
              </label>
              <input
                type="text"
                placeholder="Filter by region..."
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-background"
              />
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                City
              </label>
              <input
                type="text"
                placeholder="Filter by city..."
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-background"
              />
            </div>

            {/* Site Status Filter */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Site Status
              </label>
              <select
                value={filterSiteStatus}
                onChange={(e) => setFilterSiteStatus(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-background"
              >
                <option value="">All Statuses</option>
                <option value="ON-AIR">ON-AIR</option>
                <option value="OFF-AIR">OFF-AIR</option>
                <option value="STANDBY">STANDBY</option>
              </select>
            </div>

            {/* Vendor Filter */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Vendor
              </label>
              <input
                type="text"
                placeholder="Filter by vendor..."
                value={filterVendor}
                onChange={(e) => setFilterVendor(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-background"
              />
            </div>

            {/* Clear Filters */}
            {(searchCowId || filterRegion || filterSiteStatus || filterVendor || filterCity) && (
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchCowId("");
                    setFilterRegion("");
                    setFilterSiteStatus("");
                    setFilterVendor("");
                    setFilterCity("");
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 size={32} className="animate-spin text-primary mx-auto mb-3" />
              <p className="text-muted-foreground">Loading COW Registry...</p>
            </div>
          </div>
        ) : cows.length === 0 ? (
          <div className="flex items-center justify-center py-12 bg-card border border-border rounded-lg">
            <div className="text-center">
              <Package size={48} className="text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No COWs found matching your criteria</p>
            </div>
          </div>
        ) : (
          <>
            {/* COWs Table */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium text-foreground">COW ID</th>
                      <th className="px-4 py-3 text-left font-medium text-foreground">Site Label</th>
                      <th className="px-4 py-3 text-left font-medium text-foreground">Region</th>
                      <th className="px-4 py-3 text-left font-medium text-foreground">City</th>
                      <th className="px-4 py-3 text-left font-medium text-foreground">Location</th>
                      <th className="px-4 py-3 text-left font-medium text-foreground">Vendor</th>
                      <th className="px-4 py-3 text-left font-medium text-foreground">Technology</th>
                      <th className="px-4 py-3 text-left font-medium text-foreground">Tower Height</th>
                      <th className="px-4 py-3 text-left font-medium text-foreground">Status</th>
                      <th className="px-4 py-3 text-center font-medium text-foreground">Health</th>
                      <th className="px-4 py-3 text-center font-medium text-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cows.map((cow, idx) => (
                      <tr
                        key={cow.id}
                        className={`border-b border-border hover:bg-muted/30 transition-colors ${
                          idx % 2 === 0 ? "bg-background" : "bg-muted/10"
                        }`}
                      >
                        <td className="px-4 py-3">
                          <span className="font-medium text-primary">{cow.cowId}</span>
                        </td>
                        <td className="px-4 py-3 text-foreground">{cow.siteLabel}</td>
                        <td className="px-4 py-3 text-foreground">{cow.region}</td>
                        <td className="px-4 py-3 text-foreground">{cow.city}</td>
                        <td className="px-4 py-3 text-foreground text-xs">{cow.location}</td>
                        <td className="px-4 py-3 text-foreground text-xs">{cow.vendor}</td>
                        <td className="px-4 py-3 text-foreground text-xs font-medium">
                          {cow.technology}
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {cow.towerHeight ? `${cow.towerHeight}m` : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={cow.siteStatus} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <StatusBadge
                              status={cow.badges.powerHealth}
                              size="small"
                              label="Power"
                            />
                            <StatusBadge
                              status={cow.badges.bbuHealth}
                              size="small"
                              label="BBU"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Link
                            to={`/cows/${cow.cowId}`}
                            className="text-primary hover:text-primary/80 font-medium text-xs"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of{" "}
                {total} COWs
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-2 border border-border rounded-lg text-sm font-medium hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-8 h-8 rounded-lg font-medium text-sm transition-colors ${
                          page === pageNum
                            ? "bg-primary text-primary-foreground"
                            : "border border-border hover:border-primary hover:text-primary"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-2 border border-border rounded-lg text-sm font-medium hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
