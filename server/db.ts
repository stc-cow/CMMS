import fs from "fs";
import path from "path";
import { COW } from "../shared/api";

const DB_DIR = path.join(process.cwd(), ".data");
const COW_DB_FILE = path.join(DB_DIR, "cows.json");

interface DBStore {
  cows: Record<string, COW>;
  lastSyncedAt: string;
}

// Initialize database directory and file if they don't exist
function ensureDbDir() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(COW_DB_FILE)) {
    fs.writeFileSync(COW_DB_FILE, JSON.stringify({ cows: {}, lastSyncedAt: new Date().toISOString() }));
  }
}

function readDb(): DBStore {
  ensureDbDir();
  try {
    const data = fs.readFileSync(COW_DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { cows: {}, lastSyncedAt: new Date().toISOString() };
  }
}

function writeDb(db: DBStore) {
  ensureDbDir();
  fs.writeFileSync(COW_DB_FILE, JSON.stringify(db, null, 2));
}

/**
 * Upsert COW records into the database
 * If COW ID exists, update; otherwise insert
 */
export function upsertCOWs(cows: COW[]) {
  const db = readDb();
  const now = new Date().toISOString();

  cows.forEach((cow) => {
    const cowId = cow.cowId;
    if (db.cows[cowId]) {
      // Update existing
      db.cows[cowId] = {
        ...db.cows[cowId],
        ...cow,
        lastUpdatedAt: now,
      };
    } else {
      // Insert new
      db.cows[cowId] = {
        ...cow,
        id: generateId(),
        createdAt: now,
        lastUpdatedAt: now,
      };
    }
  });

  db.lastSyncedAt = now;
  writeDb(db);
}

/**
 * Get all COWs
 */
export function getAllCOWs(): COW[] {
  const db = readDb();
  return Object.values(db.cows);
}

/**
 * Get COW by ID
 */
export function getCOWByCowId(cowId: string): COW | null {
  const db = readDb();
  return db.cows[cowId] || null;
}

/**
 * Search COWs with filters
 */
export function searchCOWs(filters: {
  cowId?: string;
  location?: string;
  city?: string;
  region?: string;
  siteStatus?: string;
  vendor?: string;
  remote?: boolean;
}): COW[] {
  const cows = getAllCOWs();

  return cows.filter((cow) => {
    if (filters.cowId && !cow.cowId.includes(filters.cowId)) return false;
    if (filters.location && !cow.location.toLowerCase().includes(filters.location.toLowerCase()))
      return false;
    if (filters.city && !cow.city.toLowerCase().includes(filters.city.toLowerCase()))
      return false;
    if (filters.region && !cow.region.toLowerCase().includes(filters.region.toLowerCase()))
      return false;
    if (filters.siteStatus && cow.siteStatus !== filters.siteStatus) return false;
    if (filters.vendor && !cow.vendor.toLowerCase().includes(filters.vendor.toLowerCase()))
      return false;
    if (filters.remote !== undefined && cow.remote !== filters.remote) return false;
    return true;
  });
}

/**
 * Get last sync timestamp
 */
export function getLastSyncTime(): string {
  const db = readDb();
  return db.lastSyncedAt;
}

/**
 * Mark COW as inactive (soft delete)
 */
export function markCOWAsInactive(cowId: string) {
  const db = readDb();
  if (db.cows[cowId]) {
    db.cows[cowId].siteStatus = "OFF-AIR";
    db.cows[cowId].lastUpdatedAt = new Date().toISOString();
    writeDb(db);
  }
}

/**
 * Generate unique ID (simple UUID-like string)
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
