# 🚀 Supabase Quick Start Guide

Your Supabase environment is now configured! Here's how to complete the migration:

## Step 1: Create Database Tables (Manual - 2 minutes)

This is a one-time setup. Go to your Supabase dashboard and run the schema SQL.

### Instructions:

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Select your project

2. **Navigate to SQL Editor**
   - In the left sidebar, click **SQL Editor**
   - Click **New Query** button

3. **Copy & Paste the Schema**
   - Open this file: `server/migrations/setup-schema.sql`
   - Select all content (Ctrl+A or Cmd+A)
   - Copy it
   - Paste into the Supabase SQL Editor

4. **Execute the SQL**
   - Click the **Run** button (green triangle icon)
   - Wait for completion (should be instant)
   - You should see "✓" next to each SQL command

5. **Verify Tables Created**
   - In the left sidebar, click **Table Editor**
   - You should see these new tables:
     - `cows` (555 records will be added)
     - `suppliers` (12 records will be added)
     - `warehouses` (7 reference records)
     - `supplier_equipment`

## Step 2: Run Data Migrations (Automatic - 2 minutes)

Once tables are created, the migration script will populate them with data.

### From Your Terminal:

```bash
# Install dependencies (if not already done)
pnpm install

# Run the comprehensive setup script
npm run migrate:setup
```

**What this does:**

- ✓ Migrates 7 warehouses
- ✓ Migrates 555 COW records
- ✓ Migrates 12 supplier records
- ✓ Creates all necessary indexes

### Alternative: Run Individual Migrations

```bash
# Just warehouses
npm run migrate:warehouses

# Just COWs (555 records)
npm run migrate:cows

# Just suppliers (12 records)
npm run migrate:suppliers

# All three
npm run migrate:all
```

## Step 3: Verify the Migration

### In Supabase Dashboard:

1. Go to **Table Editor**
2. Click on each table and verify row counts:

   ```
   cows → 555 rows
   suppliers → 12 rows
   warehouses → 7 rows
   ```

### Using SQL Queries:

Go to **SQL Editor** and run:

```sql
-- Check COWs
SELECT COUNT(*) as cow_count FROM cows;
-- Expected: 555

-- Check Suppliers
SELECT COUNT(*) as supplier_count FROM suppliers;
-- Expected: 12

-- Check Warehouses
SELECT COUNT(*) as warehouse_count FROM warehouses;
-- Expected: 7

-- Sample COW record
SELECT cow_id, region, city, site_status, vendor
FROM cows
LIMIT 1;
```

## Environment Variables ✓

Your environment is already configured:

```
VITE_SUPABASE_URL=https://rmcgmcmqpjhqxrwuzbmy.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_GD5r_Ixnmpmd9VoBi8L2qg...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Troubleshooting

### "Error: Tables don't exist"

**Solution:** Run Step 1 again - make sure to execute the schema SQL

### "Error: permission denied"

**Solution:** Make sure you're using the correct Service Role Key (not the Anon Key)

### "Error: Duplicate key value"

**Solution:** This is OK! It means the data is already in the database. Just skip and continue.

### "Migration taking too long"

**Solution:** This is normal for 555 COW records. It processes in batches of 100. Give it 2-3 minutes.

## What's Next?

After migration completes:

1. ✅ Database schema created
2. ✅ All data migrated to Supabase
3. ⏳ Update backend routes (in progress)
4. ⏳ Update frontend API calls
5. ⏳ Test all functionality

## Key Files

| File                                   | Purpose                        |
| -------------------------------------- | ------------------------------ |
| `server/supabase-client.ts`            | Supabase client initialization |
| `server/migrations/setup-schema.sql`   | Database schema creation       |
| `server/setup-and-migrate.ts`          | Complete migration script      |
| `server/scripts/migrate-cows.ts`       | COW data migration             |
| `server/scripts/migrate-suppliers.ts`  | Supplier data migration        |
| `server/scripts/migrate-warehouses.ts` | Warehouse data migration       |

## Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **Dashboard**: https://app.supabase.com/
- **Project URL**: https://rmcgmcmqpjhqxrwuzbmy.supabase.co

---

**Status**: ✨ Ready to migrate! Follow steps 1-2 above.
