/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// ============================================
// COW REGISTRY TYPES
// ============================================

/**
 * COW (Cell on Wheels) Master Data Model
 * Synced from Google Sheets CSV on a scheduled basis
 */
export interface COW {
  // Primary Key & Identity
  id: string; // Database ID (UUID)
  cowId: string; // COW ID (unique identifier from source)

  // General Information
  siteLabel: string;
  ebuNonEbu: string;
  region: string;
  district?: string;
  city: string;
  location: string;
  latitude?: number;
  longitude?: number;
  siteStatus: "ON-AIR" | "OFF-AIR" | "STANDBY";
  remote?: boolean; // Remote or Metropolitan
  vendor: string;
  cowAge: "OLD" | "NEW";

  // Warehouse Assignment (for OFF-AIR COWs only, calculated during sync)
  assignedWarehouse?: string; // Nearest warehouse name or "Unknown Location"
  warehouseDistanceKm?: number; // Distance to assigned warehouse in km

  remarks?: string;

  // Technology Configuration
  technology2g?: boolean;
  technology3g?: boolean;
  technologyLte?: boolean;
  technology5g?: boolean;
  availability2g?: string;
  availability3g?: string;
  availabilityLte?: string;
  availability5g?: string;
  configuration2g?: string;
  configuration3g?: string;
  configurationLte?: string;
  configuration5g?: string;
  lteBandCount?: number;
  _5gBandCount?: number;
  lteConfigurationLevel?: string;

  // Power & Generator
  pgStatus?: string;
  mdbType?: string;
  mdbStatus?: string;
  secConnection?: string;
  gensetQty?: number;
  gensetMake?: string;
  engine?: string;
  alternator?: string;
  capacity?: string;
  fuelTankCapacity?: string;
  coolingSystem?: string;
  underRepairingOvhauling?: string;

  // BBU & DC Power
  installedBbu?: string;
  bbuBrand?: string;
  voltCapacity?: string;
  noOfCells?: number;
  noOfStrings?: number;
  backupTime?: string;
  bbuStatus?: string;
  dcPowerBrand?: string;
  totalCapacity?: string;
  cabinetStatus?: string;
  rectifiersInstalled?: number;
  rectifiersRequired?: number;

  // HVAC & Shelter
  shelterOutdoor?: string;
  acMake?: string;
  acCapacity?: string;
  acType?: string;
  acQty?: number;
  acStatus1?: string;
  acStatus2?: string;
  hvacBrand?: string;
  hvacStatus?: string;

  // Security & Safety
  firePanelType?: string;
  firePanelStatus?: string;
  cylinderStatus?: string;
  manualAuto?: string;
  shelterTubeRodsStatus?: string;
  securityLightStatus?: string;
  combinationNumber?: string;
  gpsStatus?: string;

  // Transport & Tower
  towerHeight?: number;
  towerType?: string;
  towerSystem?: string;
  vehicleMake?: string;
  plateNumberEnglish?: string;
  plateNumberArabic?: string;
  mwDish?: string;
  mwFrequency?: string;
  mwConfiguration?: string;
  mwLinkType?: string;
  lastDeployDate?: string;
  underReplacement?: boolean;

  // Metadata
  lastSyncedAt: string; // ISO 8601 timestamp
  lastUpdatedAt: string; // ISO 8601 timestamp
  createdAt: string; // ISO 8601 timestamp
}

/**
 * Derived Quick Status Badge
 * Computed from raw COW data
 */
export interface QuickStatusBadge {
  powerHealth: "green" | "amber" | "red"; // From PG Status, MDB Status, AC Status
  bbuHealth: "green" | "amber" | "red"; // From BBU Status, Backup Time
  siteAvailability: "green" | "amber" | "red"; // From Site Status
}

/**
 * COW Registry List View Item
 * Subset of COW fields optimized for table display
 */
export interface COWListItem {
  id: string;
  cowId: string;
  siteLabel: string;
  region: string;
  city: string;
  remote?: boolean;
  location: string;
  siteStatus: "ON-AIR" | "OFF-AIR" | "STANDBY";
  vendor: string;
  technology: string; // e.g., "2G/3G/LTE/5G"
  towerHeight?: number;
  gensetQty?: number;
  lastDeployDate?: string;
  underReplacement: boolean;
  badges: QuickStatusBadge;
  lastSyncedAt: string;
}

/**
 * API Responses
 */
export interface COWListResponse {
  data: COWListItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface COWDetailResponse {
  data: COW;
}

export interface COWSearchFilters {
  cowId?: string;
  location?: string;
  city?: string;
  region?: string;
  siteStatus?: "ON-AIR" | "OFF-AIR" | "STANDBY";
  vendor?: string;
  remote?: boolean;
  technology?: string;
  page?: number;
  pageSize?: number;
}

// ============================================
// DASHBOARD TYPES
// ============================================

/**
 * Regional distribution data
 */
export interface RegionalDistribution {
  region: string;
  totalCows: number;
}

/**
 * Status summary KPI
 */
export interface StatusSummary {
  onAir: number;
  offAir: number;
  standby: number;
}

/**
 * OFF-AIR COWs by vendor (warehouse stock)
 */
export interface OffAirByVendor {
  vendor: string;
  count: number;
}

/**
 * New vs Old COWs breakdown
 */
export interface CowAgeBreakdown {
  new: number;
  old: number;
}

/**
 * OFF-AIR COWs by warehouse location
 */
export interface OffAirByWarehouse {
  warehouse: string;
  count: number;
}

/**
 * Warehouse drill-down COW record
 */
export interface WarehouseDistribution {
  cowId: string;
  vendor: string;
  region: string;
  location: string;
  distanceKm: number;
}

/**
 * Drill-down COW record (simplified for modal)
 */
export interface DrillDownCOW {
  cowId: string;
  region: string;
  vendor: string;
  siteStatus: string;
  location: string;
}

/**
 * Complete dashboard data
 */
export interface DashboardData {
  regionalDistribution: RegionalDistribution[];
  statusSummary: StatusSummary;
  offAirByVendor: OffAirByVendor[];
  offAirByWarehouse: OffAirByWarehouse[];
  cowAgeBreakdown: CowAgeBreakdown;
  lastSyncedAt: string;
  totalCows: number;
}
