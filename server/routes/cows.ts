import { Router } from "express";
import { getAllCOWs, getCOWByCowId, searchCOWs, getLastSyncTime } from "../db";
import { syncCOWsFromGoogleSheets } from "../sync";
import { COW, COWListItem, QuickStatusBadge } from "../../shared/api";

const router = Router();

/**
 * Helper: Compute quick status badges from COW data
 */
function computeQuickStatusBadges(cow: COW): QuickStatusBadge {
  // Power Health: Green if PG Status and MDB Status are good, Red if critical, Amber otherwise
  const powerHealth =
    (cow.pgStatus?.toUpperCase().includes("OK") || cow.pgStatus?.toUpperCase().includes("GOOD")) &&
    (cow.mdbStatus?.toUpperCase().includes("OK") || cow.mdbStatus?.toUpperCase().includes("GOOD"))
      ? "green"
      : cow.pgStatus?.toUpperCase().includes("FAIL") || cow.mdbStatus?.toUpperCase().includes("FAIL")
        ? "red"
        : "amber";

  // BBU Health: Green if BBU Status is good, Red if critical, Amber otherwise
  const bbuHealth =
    cow.bbuStatus?.toUpperCase().includes("OK") || cow.bbuStatus?.toUpperCase().includes("GOOD")
      ? "green"
      : cow.bbuStatus?.toUpperCase().includes("FAIL")
        ? "red"
        : "amber";

  // Site Availability: Green if ON-AIR, Red if OFF-AIR, Amber for STANDBY
  const siteAvailability =
    cow.siteStatus === "ON-AIR" ? "green" : cow.siteStatus === "OFF-AIR" ? "red" : "amber";

  return { powerHealth, bbuHealth, siteAvailability };
}

/**
 * Helper: Convert COW to COWListItem (subset for list view)
 */
function cowToListItem(cow: COW): COWListItem {
  // Build technology string
  const techs: string[] = [];
  if (cow.technology2g) techs.push("2G");
  if (cow.technology3g) techs.push("3G");
  if (cow.technologyLte) techs.push("LTE");
  if (cow.technology5g) techs.push("5G");
  const technology = techs.length > 0 ? techs.join("/") : "N/A";

  return {
    id: cow.id,
    cowId: cow.cowId,
    siteLabel: cow.siteLabel,
    region: cow.region,
    city: cow.city,
    remote: cow.remote,
    location: cow.location,
    siteStatus: cow.siteStatus,
    vendor: cow.vendor,
    technology,
    towerHeight: cow.towerHeight,
    gensetQty: cow.gensetQty,
    lastDeployDate: cow.lastDeployDate,
    underReplacement: cow.underReplacement || false,
    badges: computeQuickStatusBadges(cow),
    lastSyncedAt: cow.lastSyncedAt,
  };
}

/**
 * POST /api/cows/sync
 * Manually trigger a sync from Google Sheets
 */
router.post("/sync", async (req, res) => {
  try {
    const result = await syncCOWsFromGoogleSheets();
    if (result.success) {
      res.json({
        success: true,
        message: `Synced ${result.count} COW records`,
        count: result.count,
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || "Sync failed",
      });
    }
  } catch (error) {
    console.error("Error during manual sync:", error);
    res.status(500).json({ error: "Failed to trigger sync" });
  }
});

/**
 * GET /api/cows/sync/status
 * Get last sync information
 */
router.get("/sync/status", (_req, res) => {
  try {
    const lastSyncedAt = getLastSyncTime();
    res.json({
      lastSyncedAt,
      syncUrl: "Google Sheets CSV (scheduled every 15 minutes)",
    });
  } catch (error) {
    console.error("Error fetching sync status:", error);
    res.status(500).json({ error: "Failed to fetch sync status" });
  }
});

/**
 * GET /api/cows/stats
 * Get COW registry statistics
 */
router.get("/stats", (_req, res) => {
  try {
    const cows = getAllCOWs();
    const onAir = cows.filter((c) => c.siteStatus === "ON-AIR").length;
    const offAir = cows.filter((c) => c.siteStatus === "OFF-AIR").length;
    const standby = cows.filter((c) => c.siteStatus === "STANDBY").length;

    const vendors = [...new Set(cows.map((c) => c.vendor))];
    const regions = [...new Set(cows.map((c) => c.region))];
    const cities = [...new Set(cows.map((c) => c.city))];

    res.json({
      totalCOWs: cows.length,
      statusBreakdown: { onAir, offAir, standby },
      uniqueVendors: vendors.length,
      uniqueRegions: regions.length,
      uniqueCities: cities.length,
      lastSyncedAt: getLastSyncTime(),
    });
  } catch (error) {
    console.error("Error fetching COW stats:", error);
    res.status(500).json({ error: "Failed to fetch COW stats" });
  }
});

/**
 * GET /api/cows/dashboard
 * Get complete dashboard data (operational snapshot)
 * Sections: Regional distribution, Status summary, OFF-AIR by vendor, New vs Old
 */
router.get("/dashboard", (_req, res) => {
  try {
    const cows = getAllCOWs();
    const totalCows = cows.length;

    console.log(`[DASHBOARD] Loaded ${totalCows} COW records from database`);

    // Section 1: COW Distribution by Region
    // Region from Column E - 4 regions only
    const regionMap = new Map<string, number>();
    cows.forEach((cow) => {
      // Normalize region: trim whitespace, handle empty values
      const region = (cow.region || "").trim() || "Unassigned";
      regionMap.set(region, (regionMap.get(region) || 0) + 1);
    });
    const regionalDistribution = Array.from(regionMap.entries())
      .map(([region, count]) => ({ region, totalCows: count }))
      .sort((a, b) => b.totalCows - a.totalCows);

    // Verify regional sum equals total
    const regionalSum = regionalDistribution.reduce((sum, r) => sum + r.totalCows, 0);
    if (regionalSum !== totalCows) {
      console.warn(
        `[DASHBOARD] ⚠️ Regional distribution sum (${regionalSum}) != total COWs (${totalCows})`
      );
    }

    // Section 2: COW Status Summary
    const onAir = cows.filter((c) => c.siteStatus === "ON-AIR").length;
    const offAir = cows.filter((c) => c.siteStatus === "OFF-AIR").length;
    const standby = cows.filter((c) => c.siteStatus === "STANDBY").length;
    const statusSummary = { onAir, offAir, standby };
    const statusSum = onAir + offAir + standby;
    if (statusSum !== totalCows) {
      console.warn(`[DASHBOARD] ⚠️ Status sum (${statusSum}) != total COWs (${totalCows})`);
    }

    // Section 3: OFF-AIR COWs by Vendor (Warehouse Stock)
    const vendorMap = new Map<string, number>();
    cows
      .filter((c) => c.siteStatus === "OFF-AIR")
      .forEach((cow) => {
        const vendor = cow.vendor || "Unknown";
        vendorMap.set(vendor, (vendorMap.get(vendor) || 0) + 1);
      });
    const offAirByVendor = Array.from(vendorMap.entries())
      .map(([vendor, count]) => ({ vendor, count }))
      .sort((a, b) => b.count - a.count);

    // Section 4: New vs Old COWs
    const newCows = cows.filter((c) => c.cowAge === "NEW").length;
    const oldCows = cows.filter((c) => c.cowAge === "OLD").length;
    const cowAgeBreakdown = { new: newCows, old: oldCows };

    res.json({
      regionalDistribution,
      statusSummary,
      offAirByVendor,
      cowAgeBreakdown,
      lastSyncedAt: getLastSyncTime(),
      totalCows,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

/**
 * GET /api/cows/dashboard/drill-down
 * Get filtered COW list for drill-down modal
 * Query params: region, vendor, siteStatus, cowAge
 */
router.get("/dashboard/drill-down", (req, res) => {
  try {
    const { region, vendor, siteStatus, cowAge } = req.query;

    let cows = getAllCOWs();

    if (region) cows = cows.filter((c) => c.region === region);
    if (vendor) cows = cows.filter((c) => c.vendor === vendor);
    if (siteStatus) cows = cows.filter((c) => c.siteStatus === siteStatus);
    if (cowAge) cows = cows.filter((c) => c.cowAge === cowAge);

    const drillDownData = cows.map((cow) => ({
      cowId: cow.cowId,
      region: cow.region,
      vendor: cow.vendor,
      siteStatus: cow.siteStatus,
      location: cow.location,
    }));

    res.json({ data: drillDownData, count: drillDownData.length });
  } catch (error) {
    console.error("Error fetching drill-down data:", error);
    res.status(500).json({ error: "Failed to fetch drill-down data" });
  }
});

/**
 * GET /api/cows/list
 * Get paginated list of COWs with optional search/filters
 */
router.get("/list", (req, res) => {
  try {
    const {
      cowId,
      location,
      city,
      region,
      siteStatus,
      vendor,
      remote,
      page = "1",
      pageSize = "20",
    } = req.query;

    // Build filter object
    const filters: any = {};
    if (cowId) filters.cowId = String(cowId);
    if (location) filters.location = String(location);
    if (city) filters.city = String(city);
    if (region) filters.region = String(region);
    if (siteStatus) filters.siteStatus = String(siteStatus);
    if (vendor) filters.vendor = String(vendor);
    if (remote !== undefined) filters.remote = remote === "true";

    // Search with filters
    const cows = searchCOWs(filters);

    // Convert to list items
    const items = cows.map(cowToListItem);

    // Paginate
    const pageNum = Math.max(1, parseInt(String(page)) || 1);
    const pageSizeNum = Math.max(1, Math.min(100, parseInt(String(pageSize)) || 20));
    const startIdx = (pageNum - 1) * pageSizeNum;
    const endIdx = startIdx + pageSizeNum;
    const paginatedItems = items.slice(startIdx, endIdx);

    res.json({
      data: paginatedItems,
      total: items.length,
      page: pageNum,
      pageSize: pageSizeNum,
    });
  } catch (error) {
    console.error("Error fetching COW list:", error);
    res.status(500).json({ error: "Failed to fetch COW list" });
  }
});

/**
 * GET /api/cows/:cowId
 * Get detailed information for a specific COW
 */
router.get("/:cowId", (req, res) => {
  try {
    const { cowId } = req.params;
    const cow = getCOWByCowId(cowId);

    if (!cow) {
      return res.status(404).json({ error: "COW not found" });
    }

    res.json({ data: cow });
  } catch (error) {
    console.error("Error fetching COW detail:", error);
    res.status(500).json({ error: "Failed to fetch COW detail" });
  }
});

export default router;
