# Supabase Migration Guide

## Overview
This guide walks you through migrating all data from the local JSON files to Supabase.

## Prerequisites
- Supabase project: https://rmcgmcmqpjhqxrwuzbmy.supabase.co
- Publishable Key: `sb_publishable_GD5r_Ixnmpmd9VoBi8L2qg_L5nyiZEP`
- You need a **Service Role Key** from Supabase to run migrations

## Step 1: Get Your Service Role Key

1. Go to your Supabase dashboard: https://app.supabase.com/
2. Navigate to your project
3. Go to **Settings** → **API**
4. Copy your **Service Role Key** (Keep this secret!)
5. Set it as an environment variable:
   ```bash
   export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
   ```

## Step 2: Create the Database Schema

1. Go to your Supabase dashboard
2. Navigate to the **SQL Editor**
3. Click "New Query"
4. Copy the entire content from `server/migrations/setup-schema.sql`
5. Paste it into the SQL editor
6. Click "Run" to execute

This will create:
- `cows` table (main COW registry)
- `suppliers` table (supplier master data)
- `supplier_equipment` table (equipment-supplier relationships)
- `warehouses` table (reference warehouse data)
- Indexes for performance

## Step 3: Install Dependencies

```bash
pnpm install
```

This installs `@supabase/supabase-js` which is required for migrations.

## Step 4: Run Migrations

**Option A: Migrate Everything at Once**
```bash
npm run migrate:all
```

**Option B: Migrate Individual Tables**
```bash
# Migrate warehouses first (reference data)
npm run migrate:warehouses

# Migrate COWs (555 records)
npm run migrate:cows

# Migrate suppliers (12 records)
npm run migrate:suppliers
```

## Step 5: Verify the Migration

1. Go to your Supabase dashboard
2. Navigate to the **SQL Editor**
3. Run these queries to verify:

```sql
-- Check COWs count
SELECT COUNT(*) FROM cows;

-- Check Suppliers count
SELECT COUNT(*) FROM suppliers;

-- Check Warehouses count
SELECT COUNT(*) FROM warehouses;

-- View sample COW record
SELECT * FROM cows LIMIT 1;

-- View sample Supplier record
SELECT * FROM suppliers LIMIT 1;
```

## Step 6: Update Backend Routes (In Progress)

The following routes need to be updated to use Supabase:

**Dashboard API Routes:**
- `/api/cows/dashboard/status-summary` - Query `cows` table
- `/api/cows/dashboard/regional-distribution` - Group by region
- `/api/cows/dashboard/off-air-by-vendor` - Filter OFF-AIR by vendor
- `/api/cows/dashboard/off-air-by-warehouse` - Filter OFF-AIR by warehouse
- `/api/cows/dashboard/cow-age-breakdown` - Group by cowAge
- `/api/cows/dashboard/warehouse-drill-down` - Join with warehouses

**COW Registry Routes:**
- `/api/cows/list` - List all COWs with pagination
- `/api/cows/search` - Search COWs by filters
- `/api/cows/:id` - Get single COW detail

**Supplier Routes:**
- `GET /api/suppliers` - List all suppliers
- `POST /api/suppliers` - Create new supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier
- `GET /api/suppliers/:id/equipment` - Get supplier equipment

## Environment Variables

Make sure these are set:
```bash
VITE_SUPABASE_URL=https://rmcgmcmqpjhqxrwuzbmy.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_GD5r_Ixnmpmd9VoBi8L2qg_L5nyiZEP
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Data Structure Mapping

### COWs Table
```
Local JSON Field → Database Column
cowId → cow_id
siteLabel → site_label
ebuNonEbu → ebu_non_ebu
region → region
district → district
city → city
location → location
latitude → latitude
longitude → longitude
siteStatus → site_status
remote → remote
vendor → vendor
cowAge → cow_age
assignedWarehouse → assigned_warehouse
warehouseDistanceKm → warehouse_distance_km
... (all other fields mapped to snake_case columns)
```

### Suppliers Table
```
Local Field → Database Column
name → name
crNumber → cr_number
vatNumber → vat_number
contactPerson → contact_person
phone → phone
email → email
```

## Troubleshooting

**Error: "Missing Supabase environment variables"**
- Make sure `SUPABASE_SERVICE_ROLE_KEY` is set
- Check that it's the correct key from your Supabase dashboard

**Error: "Permission denied"**
- Verify you're using the Service Role Key, not the Anon Key
- Check your Supabase RLS policies (they may need to be configured)

**Error: "Duplicate key value"**
- Some records may already exist in the database
- This is normal if you're re-running migrations
- The database constraints prevent duplicates (good for data integrity!)

**Migration is slow**
- Migrations run in batches of 100 records
- 555 COWs should take less than a minute
- This is normal and prevents timeout issues

## Next Steps

1. ✅ Set up Supabase environment
2. ✅ Create database schema
3. ✅ Run migrations
4. ⏳ Update backend routes to query Supabase
5. ⏳ Update frontend to use new API endpoints
6. ⏳ Test all functionality
7. ⏳ Deploy to production

## Rollback

If you need to rollback:

1. Go to Supabase dashboard
2. Navigate to **SQL Editor**
3. Run:
```sql
DROP TABLE IF EXISTS supplier_equipment;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS cows;
DROP TABLE IF EXISTS warehouses;
```

4. Your local JSON files remain unchanged

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Project Dashboard: https://app.supabase.com/
- Check migration logs above for specific errors
