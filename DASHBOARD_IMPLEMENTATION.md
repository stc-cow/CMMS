# COW Registry Dashboard Implementation

## Overview

Replaced the COW Registry table view with an operational dashboard that provides a 10-second management snapshot of COW assets across regions, deployment status, and warehouse inventory.

## Architecture

### API Endpoints Added

#### 1. `GET /api/cows/dashboard`

Returns aggregated dashboard data for all 4 sections:

- **Regional Distribution**: Total COWs per region (sorted by count)
- **Status Summary**: Count of ON-AIR, OFF-AIR, and STANDBY COWs
- **Warehouse Stock**: OFF-AIR COWs grouped by vendor
- **Age Breakdown**: Count of New vs Old COWs
- **Metadata**: Total COWs count, last sync timestamp

#### 2. `GET /api/cows/dashboard/drill-down`

Filtered drill-down list for modal views.
Query params:

- `region` - Filter by region
- `vendor` - Filter by vendor
- `siteStatus` - Filter by status (ON-AIR, OFF-AIR, STANDBY)
- `cowAge` - Filter by age (NEW, OLD)

Returns simplified COW list (cowId, region, vendor, siteStatus, location).

### Data Types (shared/api.ts)

```typescript
- RegionalDistribution: { region, totalCows }
- StatusSummary: { onAir, offAir, standby }
- OffAirByVendor: { vendor, count }
- CowAgeBreakdown: { new, old }
- DrillDownCOW: { cowId, region, vendor, siteStatus, location }
- DashboardData: Complete dashboard response
```

### Components

#### Dashboard Page (`client/pages/Dashboard.tsx`)

Main page component with:

- Auto-refresh every 30 minutes
- Manual sync button
- Loading states
- Error handling
- Drill-down modal management
- Last updated timestamp (DD-MM-YYYY HH:MM format)

#### Section 1: Status Summary Cards (`client/pages/components/dashboard/StatusSummaryCards.tsx`)

Three KPI cards:

- 🟢 ON-AIR COWs (green)
- 🔴 Warehouse / Not Deployed (red, labeled as OFF-AIR)
- 🟡 STANDBY COWs (amber)

Click-to-drill behavior for each status.

#### Section 2: Regional Distribution (`client/pages/components/dashboard/RegionalDistributionCard.tsx`)

Horizontal bar chart showing COW count per region:

- Regions sorted by count (descending)
- Percentage-based visual bars
- Total display per region

#### Section 3: Warehouse Stock by Vendor (`client/pages/components/dashboard/OffAirByVendorCard.tsx`)

OFF-AIR COWs grouped by vendor:

- Colored vendor indicators
- Total warehouse count
- Click-to-drill by vendor

#### Section 4: New vs Old COWs (`client/pages/components/dashboard/CowAgeBreakdownCard.tsx`)

Age breakdown with:

- Two expandable cards (New / Old)
- Percentage breakdown
- Total COW count
- Click-to-drill by age

#### Drill-Down Modal (`client/pages/components/dashboard/DrillDownModal.tsx`)

Read-only list modal showing:

- COW ID
- Location
- Region
- Vendor
- Status badge (color-coded)

No editing capabilities - view only.

## User Answers (10-Second Snapshot)

The dashboard answers these questions in under 10 seconds:

1. **How many COWs per region?**
   → Section 1: Regional Distribution bar chart

2. **How many OFF-AIR in warehouse?**
   → Section 2: Status Summary card (red, labeled "Warehouse / Not Deployed")

3. **Which vendor has most OFF-AIR COWs?**
   → Section 3: Warehouse Stock by Vendor (sorted descending)

4. **How many New vs Old?**
   → Section 4: New vs Old COWs (side-by-side comparison)

## Features

✅ **Operational Metrics Only** (no technical configs, equipment, power, BBU, HVAC)  
✅ **Live Google Sheet Integration** (556+ COW records synced automatically)  
✅ **Auto-Refresh** (every 30 minutes)  
✅ **Manual Sync Button** (instant refresh)  
✅ **Last Updated Timestamp** (DD-MM-YYYY HH:MM format)  
✅ **Click-to-Drill** (view COWs matching any filter)  
✅ **Read-Only Modal** (no editing in drill-down)  
✅ **Color-Coded Status** (green=ON-AIR, red=OFF-AIR, amber=STANDBY)  
✅ **Fast Load Times** (aggregated API responses)  
✅ **Error Handling** (graceful failure messages)

## Data Flow

1. Backend syncs Google Sheet CSV every 15 minutes → `.data/cows.json`
2. Frontend fetches `/api/cows/dashboard` for aggregated data
3. User can manually trigger sync via "Sync Now" button
4. Click any number or section to open drill-down modal
5. Modal fetches `/api/cows/dashboard/drill-down` with filters
6. Auto-refresh re-fetches dashboard data every 30 minutes

## Removed

❌ COW Registry table view (`client/pages/COWRegistry.tsx` - no longer routed)  
❌ Technical detail tabs (General, Tech, Power, BBU, HVAC, Security)  
❌ 100+ column table display  
❌ Edit forms  
❌ Equipment specifications

## Routing

- `/cows` → Dashboard (was COW Registry table)
- `/cows/:cowId` → COW Detail (unchanged, for drill-down if needed)

## Performance

- Dashboard data aggregation: O(n) single pass
- Drill-down queries: Filtered in-memory
- Modal data: Simplified fields only
- Page load: < 1 second (with cached data)

## Acceptance Criteria ✅

✅ Management can answer 4 questions in 10 seconds  
✅ Page loads fast  
✅ Data auto-updates from Google Sheet (30 min interval)  
✅ Manual sync available  
✅ Drill-down for detailed views  
✅ Read-only interface  
✅ Last updated timestamp shown  
✅ Operational metrics only (no technical details)
