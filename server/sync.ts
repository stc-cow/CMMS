import { COW } from "../shared/api";
import { upsertCOWs, getLastSyncTime } from "./db";

const GOOGLE_SHEETS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vS0GkXnQMdKYZITuuMsAzeWDtGUqEJ3lWwqNdA67NewOsDOgqsZHKHECEEkea4nrukx4-DqxKmf62nC/pub?gid=2046046325&single=true&output=csv";

/**
 * Parse CSV text into COW records
 * Uses column index mapping (A-CM = indices 0-98)
 * Skips first row (metadata) and processes data rows
 */
function parseCSVToCOWs(csvText: string): COW[] {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  const firstRow = parseCSVLine(lines[0]);
  console.log(`[CSV] First row (metadata): ${firstRow.slice(0, 3).join(" | ")}...`);
  console.log(`[CSV] Columns detected: ${firstRow.length}`);
  console.log(`[CSV] Total rows to process: ${lines.length - 1}`);

  const cows: COW[] = [];
  let successCount = 0;
  let skipCount = 0;

  // Start from row 1 (skip metadata in row 0)
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) {
      skipCount++;
      continue;
    }

    const cow = mapRowToCOW(firstRow, values);
    if (cow && cow.cowId) {
      cows.push(cow);
      successCount++;
    } else {
      skipCount++;
      if (skipCount <= 3) {
        console.log(`[CSV] Skipped row ${i}: missing or empty COW ID`);
      }
    }
  }

  if (skipCount > 3) {
    console.log(`[CSV] ... and ${skipCount - 3} more rows skipped`);
  }

  console.log(`[CSV] Parse results: ${successCount} valid COWs, ${skipCount} skipped`);

  return cows;
}

/**
 * Parse a CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Column mapping: Letter → Index → COW field
 * Based on Google Sheet layout (A-CM = indices 0-90)
 * Column B (COW ID) at index 1 is the primary key
 */
const COLUMN_MAPPING: Record<number, keyof COW | null> = {
  0: null, // A – Numbering (not used)
  1: "cowId", // B – COW ID (PRIMARY KEY)
  2: "siteLabel", // C – Site Label
  3: "ebuNonEbu", // D – EBU / Royal
  4: "region", // E – Region
  5: "district", // F – District
  6: "city", // G – City
  7: "remote", // H – Remote / Metropolitan
  8: "location", // I – Location
  9: "latitude", // J – Latitude
  10: "longitude", // K – Longitude
  11: "siteStatus", // L – Site Status
  12: "lastDeployDate", // M – Last Deploying Date
  13: "underReplacement", // N – Under Replacement
  14: null, // O – 1st Deploying Date (not mapped)
  15: "cowAge", // P – COW OLD / NEW
  16: "vendor", // Q – Vendor
  17: null, // R – V-Sat (not mapped)
  18: null, // S – 2G Availability (duplicate, use index 40)
  19: null, // T – 2G Configuration (duplicate, use index 41)
  20: null, // U – 3G Availability (duplicate, use index 42)
  21: null, // V – 3G Configuration (duplicate, use index 43)
  22: null, // W – LTE Availability (duplicate, use index 44)
  23: null, // X – LTE Configuration (duplicate, use index 45)
  24: null, // Y – 5G Availability (duplicate, use index 46)
  25: null, // Z – 5G Configuration (duplicate, use index 47)
  26: null, // AA – 2G / 3G / LTE / 5G (not mapped)
  27: null, // AB – Tower Height (duplicate, use index 76)
  28: null, // AC – Multi Beam COWs (not mapped)
  29: "lteBandCount", // AD – LTE Band Count
  30: "_5gBandCount", // AE – 5G Band Count
  31: null, // AF – 5G Band Count (Without N28) (not mapped)
  32: "lteConfigurationLevel", // AG – LTE Configuration Level
  33: "shelterOutdoor", // AH – Shelter / Outdoor
  34: "secConnection", // AI – SEC Connection
  35: "mdbType", // AJ – MDB Type & Status
  36: "pgStatus", // AK – PG Status
  37: "gensetQty", // AL – Genset QTY
  38: null, // AM – ACES TG (not mapped)
  39: null, // AN – Under Repairing / Overhauling / Missing (handled separately)
  40: "availability2g", // S(2) – 2G Availability
  41: "configuration2g", // T(2) – 2G Configuration
  42: "availability3g", // U(2) – 3G Availability
  43: "configuration3g", // V(2) – 3G Configuration
  44: "availabilityLte", // W(2) – LTE Availability
  45: "configurationLte", // X(2) – LTE Configuration
  46: "availability5g", // Y(2) – 5G Availability
  47: "configuration5g", // Z(2) – 5G Configuration
  48: "gensetMake", // AO – Genset Make
  49: "engine", // AP – Engine
  50: "alternator", // AQ – Alternator
  51: "capacity", // AR – Capacity
  52: null, // AS – ATS Type (not mapped)
  53: "coolingSystem", // AT – Cooling System
  54: "fuelTankCapacity", // AU – Fuel Tank Capacity
  55: null, // AV – Fuel Tank Int / Ext / Veh (not mapped)
  56: "acMake", // AW – AC Make
  57: "acCapacity", // AX – AC Capacity
  58: "acType", // AY – AC Type (Split / Package)
  59: "acQty", // AZ – Qty
  60: "acStatus1", // BA – AC Status #1
  61: "acStatus2", // BB – AC Status #2
  62: "hvacBrand", // BC – HVAC Brand
  63: "hvacStatus", // BD – HVAC Status
  64: "installedBbu", // BE – Installed BBU
  65: "voltCapacity", // BF – BBU Volt & Capacity (AH)
  66: "noOfCells", // BG – Number of Cells
  67: "noOfStrings", // BH – No of Strings
  68: "bbuStatus", // BI – BBU Status
  69: "backupTime", // BJ – BBU Backup Time
  70: null, // BK – BBU Remarks (not mapped to avoid overwrite)
  71: "dcPowerBrand", // BL – DC Power Brand
  72: "totalCapacity", // BM – Total Capacity
  73: "cabinetStatus", // BN – DC Power Cabinet Status
  74: null, // BO – Installed Rectifiers (not mapped)
  75: null, // BP – Required Rectifiers (not mapped)
  76: null, // BQ – Rectifier Capacity (not mapped)
  77: "firePanelType", // BR – Fire Panel Type & Brand
  78: "firePanelStatus", // BS – Fire Panel Status
  79: "cylinderStatus", // BT – Cylinder Status
  80: "manualAuto", // BU – Cylinder Manual / Auto
  81: null, // BV – Brand (not mapped)
  82: null, // BW – Status (not mapped)
  83: "shelterTubeRodsStatus", // BX – Shelter Tube Rods Status
  84: "securityLightStatus", // BY – Security Light Status
  85: "gpsStatus", // BZ – GPS Status
  86: "vehicleMake", // CA – Vehicle Make
  87: "plateNumberEnglish", // CB – Plate #
  88: "plateNumberArabic", // CC – Arabic Plate #
  89: null, // CD – Vehicle Make (Arabic) (not mapped)
  90: null, // CE – Tower Height (Repeat) (use index 27)
  91: "towerType", // CF – Tower Type
  92: "towerSystem", // CG – Tower System
  93: null, // CH – FE ID (not mapped)
  94: "mwDish", // CI – MW Dish
  95: "mwFrequency", // CJ – MW Frequency
  96: "mwConfiguration", // CK – MW Configuration
  97: "mwLinkType", // CL – MW Link Type
  98: "remarks", // CM – Remarks
};

/**
 * Map CSV row to COW object using column index mapping
 * Rules: Map by column letter only, no header text, blank cells = NULL, no transformation
 */
function mapRowToCOW(_headers: string[], values: string[]): COW | null {
  // Column B (index 1) is primary key and required
  const cowId = values[1]?.trim() || "";
  if (!cowId) return null;

  // Skip header rows (COW ID is the column header text)
  if (cowId === "COW ID" || cowId === "COW_ID") return null;

  const now = new Date().toISOString();
  const cow: COW = {
    id: "", // Will be generated by DB
    cowId: cowId,
    siteLabel: nullifyEmpty(values[2]),
    ebuNonEbu: nullifyEmpty(values[3]),
    region: nullifyEmpty(values[4]),
    district: nullifyEmpty(values[5]),
    city: nullifyEmpty(values[6]),
    remote: parseBoolean(values[7]),
    location: nullifyEmpty(values[8]),
    latitude: parseNumber(values[9]),
    longitude: parseNumber(values[10]),
    siteStatus: parseStatus(values[11]),
    lastDeployDate: nullifyEmpty(values[12]),
    underReplacement: parseBoolean(values[13]),
    cowAge: parseCowAge(values[15]),
    vendor: nullifyEmpty(values[16]),
    availability2g: nullifyEmpty(values[40]),
    configuration2g: nullifyEmpty(values[41]),
    availability3g: nullifyEmpty(values[42]),
    configuration3g: nullifyEmpty(values[43]),
    availabilityLte: nullifyEmpty(values[44]),
    configurationLte: nullifyEmpty(values[45]),
    availability5g: nullifyEmpty(values[46]),
    configuration5g: nullifyEmpty(values[47]),
    lteBandCount: parseInteger(values[29]),
    _5gBandCount: parseInteger(values[30]),
    lteConfigurationLevel: nullifyEmpty(values[32]),
    shelterOutdoor: nullifyEmpty(values[33]),
    secConnection: nullifyEmpty(values[34]),
    mdbType: nullifyEmpty(values[35]),
    pgStatus: nullifyEmpty(values[36]),
    gensetQty: parseInteger(values[37]),
    gensetMake: nullifyEmpty(values[48]),
    engine: nullifyEmpty(values[49]),
    alternator: nullifyEmpty(values[50]),
    capacity: nullifyEmpty(values[51]),
    coolingSystem: nullifyEmpty(values[53]),
    fuelTankCapacity: nullifyEmpty(values[54]),
    acMake: nullifyEmpty(values[56]),
    acCapacity: nullifyEmpty(values[57]),
    acType: nullifyEmpty(values[58]),
    acQty: parseInteger(values[59]),
    acStatus1: nullifyEmpty(values[60]),
    acStatus2: nullifyEmpty(values[61]),
    hvacBrand: nullifyEmpty(values[62]),
    hvacStatus: nullifyEmpty(values[63]),
    installedBbu: nullifyEmpty(values[64]),
    voltCapacity: nullifyEmpty(values[65]),
    noOfCells: parseInteger(values[66]),
    noOfStrings: parseInteger(values[67]),
    bbuStatus: nullifyEmpty(values[68]),
    backupTime: nullifyEmpty(values[69]),
    dcPowerBrand: nullifyEmpty(values[71]),
    totalCapacity: nullifyEmpty(values[72]),
    cabinetStatus: nullifyEmpty(values[73]),
    firePanelType: nullifyEmpty(values[77]),
    firePanelStatus: nullifyEmpty(values[78]),
    cylinderStatus: nullifyEmpty(values[79]),
    manualAuto: nullifyEmpty(values[80]),
    shelterTubeRodsStatus: nullifyEmpty(values[83]),
    securityLightStatus: nullifyEmpty(values[84]),
    gpsStatus: nullifyEmpty(values[85]),
    vehicleMake: nullifyEmpty(values[86]),
    plateNumberEnglish: nullifyEmpty(values[87]),
    plateNumberArabic: nullifyEmpty(values[88]),
    towerType: nullifyEmpty(values[91]),
    towerSystem: nullifyEmpty(values[92]),
    mwDish: nullifyEmpty(values[94]),
    mwFrequency: nullifyEmpty(values[95]),
    mwConfiguration: nullifyEmpty(values[96]),
    mwLinkType: nullifyEmpty(values[97]),
    remarks: nullifyEmpty(values[98]),
    lastSyncedAt: now,
    lastUpdatedAt: now,
    createdAt: now,
  };

  return cow;
}

/**
 * Convert empty string to null (rule: blank cells = NULL)
 * Also trims whitespace from all values
 */
function nullifyEmpty(value: string | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

/**
 * Parse boolean value from cell (without transformation, just interpretation)
 */
function parseBoolean(value: string | undefined): boolean | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (normalized === "yes" || normalized === "true" || normalized === "1" || normalized === "on") {
    return true;
  }
  if (normalized === "no" || normalized === "false" || normalized === "0" || normalized === "off") {
    return false;
  }
  return undefined;
}

/**
 * Parse numeric value (returns undefined if not a number)
 */
function parseNumber(value: string | undefined): number | undefined {
  if (!value || value.trim() === "") return undefined;
  const num = parseFloat(value.trim());
  return isNaN(num) ? undefined : num;
}

/**
 * Parse integer value (returns undefined if not an integer)
 */
function parseInteger(value: string | undefined): number | undefined {
  if (!value || value.trim() === "") return undefined;
  const num = parseInt(value.trim(), 10);
  return isNaN(num) ? undefined : num;
}

/**
 * Parse site status (OFF-AIR, ON-AIR, STANDBY)
 * Default to "OFF-AIR" for empty/invalid values (not deployed)
 */
function parseStatus(value: string | undefined): "ON-AIR" | "OFF-AIR" | "STANDBY" {
  if (!value) return "OFF-AIR"; // Default for missing status
  const normalized = value.trim().toUpperCase();
  if (normalized === "ON-AIR" || normalized === "ON AIR") return "ON-AIR";
  if (normalized === "STANDBY") return "STANDBY";
  return "OFF-AIR"; // Default for unrecognized values
}

/**
 * Parse COW age (OLD or NEW)
 */
function parseCowAge(value: string | undefined): "OLD" | "NEW" | null {
  if (!value) return null;
  const normalized = value.trim().toUpperCase();
  return normalized === "OLD" ? "OLD" : "NEW";
}

/**
 * Fetch CSV from Google Sheets and sync to database
 */
export async function syncCOWsFromGoogleSheets(): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    console.log("[SYNC] Starting COW data sync from Google Sheets...");
    console.log(`[SYNC] URL: ${GOOGLE_SHEETS_CSV_URL}`);

    // Fetch CSV with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(GOOGLE_SHEETS_CSV_URL, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'ACES-CMMS/1.0 (COW Registry Sync Service)',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch Google Sheet: ${response.status} ${response.statusText}`);
    }

    const csvText = await response.text();
    console.log(`[SYNC] Downloaded CSV (${csvText.length} bytes)`);

    if (!csvText || csvText.length < 10) {
      throw new Error("CSV is empty or too small");
    }

    // Parse CSV to COWs
    const cows = parseCSVToCOWs(csvText);

    if (cows.length === 0) {
      console.warn("[SYNC] No valid COW records found in CSV. Check column headers and data format.");
      return { success: false, count: 0, error: "No valid COW records found in CSV" };
    }

    console.log(`[SYNC] Parsed ${cows.length} COW records`);

    // Detect duplicate COW IDs
    const cowIdCounts = new Map<string, number>();
    const duplicates: string[] = [];
    cows.forEach((cow) => {
      const count = cowIdCounts.get(cow.cowId) || 0;
      cowIdCounts.set(cow.cowId, count + 1);
      if (count > 0) {
        duplicates.push(cow.cowId);
      }
    });

    if (duplicates.length > 0) {
      console.warn(`[SYNC] ⚠️  Found ${duplicates.length} duplicate COW ID(s):`);
      duplicates.forEach((id) => {
        const count = cowIdCounts.get(id) || 0;
        console.warn(`[SYNC]   - ${id}: appears ${count} times`);
      });
      console.warn(`[SYNC] When upserting, duplicates will overwrite earlier entries.`);
      console.warn(`[SYNC] Database will contain ${cowIdCounts.size} unique COW IDs instead of ${cows.length}`);
    }

    // Check status distribution
    const statusCounts = {
      "ON-AIR": 0,
      "OFF-AIR": 0,
      "STANDBY": 0,
      "UNKNOWN": 0,
    };
    const invalidStatusCows: string[] = [];
    cows.forEach((cow) => {
      if (cow.siteStatus === "ON-AIR") statusCounts["ON-AIR"]++;
      else if (cow.siteStatus === "OFF-AIR") statusCounts["OFF-AIR"]++;
      else if (cow.siteStatus === "STANDBY") statusCounts["STANDBY"]++;
      else {
        statusCounts["UNKNOWN"]++;
        invalidStatusCows.push(cow.cowId);
      }
    });

    console.log(`[SYNC] Status distribution: ON-AIR=${statusCounts["ON-AIR"]}, OFF-AIR=${statusCounts["OFF-AIR"]}, STANDBY=${statusCounts["STANDBY"]}`);
    if (statusCounts["UNKNOWN"] > 0) {
      console.warn(
        `[SYNC] ⚠️  Found ${statusCounts["UNKNOWN"]} COW(s) with invalid/missing siteStatus:`
      );
      invalidStatusCows.slice(0, 5).forEach((id) => {
        const cow = cows.find((c) => c.cowId === id);
        console.warn(
          `[SYNC]   - ${id}: status="${cow?.siteStatus}" (value is ${cow?.siteStatus === null ? "null" : "not one of the expected values"})`
        );
      });
      if (invalidStatusCows.length > 5) {
        console.warn(`[SYNC]   ... and ${invalidStatusCows.length - 5} more`);
      }
    }

    // Upsert into database
    upsertCOWs(cows);
    console.log(`[SYNC] Successfully synced ${cows.length} COW records`);
    console.log(`[SYNC] Database now contains ${cowIdCounts.size} unique COW ID(s)`);

    return { success: true, count: cows.length };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[SYNC] Error during sync: ${errorMessage}`);

    // Log more context for debugging
    if (errorMessage.includes("ERR_ABORTED")) {
      console.error("[SYNC] Request timed out - Google Sheets URL may be unreachable");
    } else if (errorMessage.includes("401") || errorMessage.includes("403")) {
      console.error("[SYNC] Access denied - Google Sheets may require authentication or be private");
    } else if (errorMessage.includes("404")) {
      console.error("[SYNC] Sheet not found - check the Google Sheets URL");
    }

    return { success: false, count: 0, error: errorMessage };
  }
}

/**
 * Start periodic sync (every 15-30 minutes as recommended)
 */
export function startPeriodicSync(intervalMinutes: number = 15) {
  console.log(`[SYNC] Initializing periodic sync (every ${intervalMinutes} minutes)`);

  // Run once on startup (async, don't block)
  (async () => {
    console.log("[SYNC] Running initial sync on startup...");
    const result = await syncCOWsFromGoogleSheets();
    if (result.success) {
      console.log(`[SYNC] ✓ Initial sync successful: ${result.count} COW records`);
    } else {
      console.warn(`[SYNC] ✗ Initial sync failed: ${result.error}`);
      console.warn("[SYNC] Using sample data for now. To enable live sync:");
      console.warn("[SYNC] 1. Ensure Google Sheet is publicly shared");
      console.warn("[SYNC] 2. Verify CSV export URL is correct");
      console.warn("[SYNC] 3. Check server logs for detailed error messages");
    }
  })();

  // Then run periodically
  setInterval(
    () => {
      (async () => {
        const result = await syncCOWsFromGoogleSheets();
        if (!result.success) {
          console.warn(`[SYNC] Periodic sync failed: ${result.error}`);
        }
      })();
    },
    intervalMinutes * 60 * 1000
  );
}
