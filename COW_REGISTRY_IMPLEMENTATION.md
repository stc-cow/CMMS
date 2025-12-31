# COW Registry Implementation Documentation

## Overview

A complete COW (Cell on Wheels) Registry system has been implemented as part of the ACES COW Movement Management System (CMMS). This documentation covers the architecture, data flow, and usage.

## Architecture

### Data Flow

```
Google Sheets CSV
        ↓
[Server Sync Service (15 min interval)]
        ↓
[SQLite/JSON Database (.data/cows.json)]
        ↓
[REST API Routes (/api/cows/*)]
        ↓
[React Frontend Components]
```

## Backend Implementation

### 1. **Database Layer** (`server/db.ts`)

- **Storage**: JSON file-based database (`.data/cows.json`)
- **Functions**:
  - `upsertCOWs()` - Insert or update COW records
  - `getAllCOWs()` - Retrieve all COWs
  - `getCOWByCowId()` - Get specific COW by ID
  - `searchCOWs()` - Search with filters
  - `getLastSyncTime()` - Get last sync timestamp
  - `markCOWAsInactive()` - Soft delete by marking OFF-AIR

### 2. **Sync Service** (`server/sync.ts`)

- **Google Sheets Integration**: Fetches CSV from provided URL
- **CSV Parsing**: Handles quoted fields and multiple column name variations
- **Upsert Logic**: Auto-creates or updates records based on COW ID
- **Periodic Sync**: Runs every 15 minutes by default
- **Timestamp Tracking**: Records `lastSyncedAt` and `lastUpdatedAt`

### 3. **API Routes** (`server/routes/cows.ts`)

#### GET /api/cows/list

- Returns paginated list of COWs
- **Parameters**:
  - `page` - Page number (default: 1)
  - `pageSize` - Items per page (default: 20, max: 100)
  - `cowId` - Search by COW ID
  - `region` - Filter by region
  - `city` - Filter by city
  - `location` - Filter by location
  - `siteStatus` - Filter by status (ON-AIR, OFF-AIR, STANDBY)
  - `vendor` - Filter by vendor
  - `remote` - Filter by remote/metro

#### GET /api/cows/:cowId

- Returns full details for a specific COW

#### POST /api/cows/sync

- Manually trigger sync from Google Sheets

#### GET /api/cows/sync/status

- Returns last sync timestamp and sync configuration

#### GET /api/cows/stats

- Returns registry statistics (total, status breakdown, vendor count, etc.)

## Frontend Implementation

### 1. **Data Types** (`shared/api.ts`)

```typescript
- COW - Full COW master data model (50+ fields)
- COWListItem - Subset for list view display
- QuickStatusBadge - Computed health indicators
- COWListResponse - Paginated list API response
- COWDetailResponse - Single COW detail response
- COWSearchFilters - Search/filter request parameters
```

### 2. **COW Registry List View** (`client/pages/COWRegistry.tsx`)

**Features**:

- Paginated table with 11 operational columns:
  - COW ID, Site Label, Region, City, Location
  - Vendor, Technology, Tower Height, Status
  - Health Badges, Action Link
- Search & Filter Panel:
  - Search by COW ID
  - Filters: Region, City, Site Status, Vendor
  - Clear all filters button
- Last Sync Info Box
- Manual Sync Trigger Button
- Real-time pagination

**Status Badges** (`client/components/cow/StatusBadge.tsx`):

- Green (✓) - OK
- Amber (⚠️) - Attention/STANDBY
- Red (✗) - Critical/OFF-AIR

### 3. **COW Detail Page** (`client/pages/COWDetail.tsx`)

**7-Tab Interface**:

#### Tab 1: General Info

- COW ID, Site Label, EBU/Non-EBU
- Region, District, City, Location
- Coordinates (if available)
- Site Status, Vendor, COW Age
- Remarks

#### Tab 2: Technology Configuration

- Availability (2G, 3G, LTE, 5G)
- Configuration details
- Band counts and configuration level

#### Tab 3: Power & Generator

- PG Status, MDB Status/Type
- SEC Connection
- Generator specs (qty, make, engine, capacity)
- Fuel tank, cooling system

#### Tab 4: BBU & DC Power

- BBU brand, status, capacity
- Backup time
- DC Power brand and capacity
- Rectifier counts

#### Tab 5: HVAC & Shelter

- Shelter/Outdoor designation
- AC make, type, capacity, qty, status
- HVAC brand and status

#### Tab 6: Security & Safety

- Fire panel type/status
- Cylinder status and manual/auto
- Shelter tube rods status
- Security lights, GPS
- Combination number

#### Tab 7: Transport & Tower

- Tower height, type, system
- Vehicle make and plate numbers (EN/AR)
- Microwave link details
- Last deployment date

## Key Features

### 1. **Master Data Management**

- Single source of truth from Google Sheets
- Automatic synchronization (15-minute interval)
- No manual field editing for synced data
- Soft deletes (mark inactive instead of removing)

### 2. **Quick Status Badges** (Derived Data)

- **Power Health**: Computed from PG Status + MDB Status
- **BBU Health**: Computed from BBU Status + Backup Time
- **Site Availability**: Computed from Site Status
- Color-coded: Green (OK), Amber (Attention), Red (Critical)

### 3. **Search & Filter Capabilities**

- Fast, client-side filtered API queries
- Multiple search dimensions
- Clear filters option
- Real-time pagination

### 4. **Change Tracking**

- `lastSyncedAt` - When data was synced from Google Sheets
- `lastUpdatedAt` - When record was last updated
- `createdAt` - When record was first created
- Displayed in human-readable format (DD-MM-YYYY HH:MM)

### 5. **Performance Optimizations**

- Paginated API responses (20 items per page, max 100)
- Subset data for list view (only necessary fields)
- Search filters before pagination
- Soft-delete instead of hard delete

## Data Model

### Core Fields (50+ total)

```typescript
Interface COW {
  // Primary
  id: string (DB generated)
  cowId: string (unique from source)

  // General (10 fields)
  siteLabel, ebuNonEbu, region, district, city, location
  latitude, longitude, siteStatus, vendor, cowAge, remarks

  // Technology (11 fields)
  technology2g/3g/lte/5g, availability, configuration
  lteBandCount, _5gBandCount, lteConfigurationLevel

  // Power (11 fields)
  pgStatus, mdbType/Status, secConnection
  gensetQty, make, engine, alternator
  capacity, fuelTankCapacity, coolingSystem
  underRepairingOvhauling

  // BBU (11 fields)
  installedBbu, bbuBrand, voltCapacity
  noOfCells, noOfStrings, backupTime, bbuStatus
  dcPowerBrand, totalCapacity, cabinetStatus
  rectifiersInstalled/Required

  // HVAC (8 fields)
  shelterOutdoor, acMake, acCapacity, acType, acQty
  acStatus1/2, hvacBrand, hvacStatus

  // Security (8 fields)
  firePanelType/Status, cylinderStatus, manualAuto
  shelterTubeRodsStatus, securityLightStatus
  combinationNumber, gpsStatus

  // Transport (10 fields)
  towerHeight, towerType, towerSystem
  vehicleMake, plateNumberEnglish/Arabic
  mwDish, mwFrequency, mwConfiguration, mwLinkType
  lastDeployDate, underReplacement

  // Metadata (3 fields)
  lastSyncedAt, lastUpdatedAt, createdAt
}
```

## Usage Guide

### For Operators

1. **View Registry**: Navigate to "COW Registry" in sidebar
2. **Search**: Use COW ID search for quick lookup
3. **Filter**: Use region, city, status, vendor filters
4. **View Details**: Click "View" to see all 7 tabs of data
5. **Check Status**: Look at health badges (Power, BBU, Availability)

### For Administrators

1. **Manual Sync**: Click "Sync Now" to immediately pull from Google Sheets
2. **Check Status**: See "Last synced" timestamp
3. **Monitor Stats**: Use `/api/cows/stats` endpoint for reporting

### For Developers

**Testing with Sample Data**:

```typescript
import { seedSampleData } from "./server/seed";
seedSampleData(); // Populates with 3 sample COWs
```

**Custom Sync Interval**:

```typescript
// In server/index.ts
startPeriodicSync(30); // Change from 15 to 30 minutes
```

**Direct Database Access**:

```typescript
import { getAllCOWs, searchCOWs, getCOWByCowId } from "./server/db";

const allCows = getAllCOWs();
const filtered = searchCOWs({ region: "Riyadh", siteStatus: "ON-AIR" });
const cow = getCOWByCowId("ACES-RYD-001");
```

## Integration Points (Future)

### Movements Module

- Use COW ID as foreign key
- Auto-populate COW data when creating movement
- Link to "View Movement History" from COW detail

### Invoicing Module

- Reference COW equipment for cost allocation
- Use tower height, generator capacity for billing calculations

### Analytics & Reporting

- Use stats endpoint for dashboards
- Track status changes over time
- Monitor health metrics

## Files Created/Modified

### Backend

- `server/db.ts` - Database layer
- `server/sync.ts` - Google Sheets sync service
- `server/routes/cows.ts` - API routes
- `server/seed.ts` - Sample data generator
- `server/index.ts` - Modified to register routes and start sync

### Frontend

- `client/pages/COWRegistry.tsx` - List view page
- `client/pages/COWDetail.tsx` - Detail view with 7 tabs
- `client/components/cow/StatusBadge.tsx` - Status badge component
- `client/components/cow/index.ts` - Component exports
- `client/App.tsx` - Modified to add routes

### Shared

- `shared/api.ts` - Data types and interfaces

## Configuration

### Sync Schedule

Default: Every 15 minutes
Location: `server/index.ts` - `startPeriodicSync(15)`

### Pagination

Default page size: 20 items
Max page size: 100 items

### Database Location

Default: `.data/cows.json`
Location: `server/db.ts` - `DB_DIR`, `COW_DB_FILE`

## Future Enhancements

1. **Real Database**: Migrate from JSON to PostgreSQL/Neon
2. **Real-time Sync**: WebSocket notifications on data changes
3. **Audit Trail**: Track all changes with user/timestamp
4. **Bulk Operations**: Import/export COW data
5. **Advanced Analytics**: Dashboard with charts and trends
6. **Mobile Optimization**: Responsive design improvements
7. **Offline Mode**: Sync data for offline access
8. **Movement Integration**: Complete Movements module linking

## Troubleshooting

### Google Sheets Not Syncing

- Check CSV URL is public and accessible
- Verify gid (sheet ID) in URL
- Check server logs for sync errors
- Manually trigger sync via POST /api/cows/sync

### Empty Registry

- Perform manual sync via UI
- Check if Google Sheet has data
- Check .data/cows.json file permissions

### Filter Not Working

- Ensure exact field values (case-sensitive for some)
- Try without filters to see all data
- Check browser console for API errors

## Support

- Sync API logs in server console
- Database file: `.data/cows.json` (human-readable)
- Frontend errors in browser console
- API responses include error details
