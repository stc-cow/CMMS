/**
 * Complete Setup and Migration Script
 * This script:
 * 1. Creates database tables
 * 2. Migrates warehouse data
 * 3. Migrates COW data (555 records)
 * 4. Migrates supplier data (12 records)
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing environment variables!");
  console.error("   VITE_SUPABASE_URL:", supabaseUrl ? "✓" : "✗");
  console.error("   SUPABASE_SERVICE_ROLE_KEY:", supabaseKey ? "✓" : "✗");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Database schema SQL
const SCHEMA_SQL = `
-- Create COWs table
CREATE TABLE IF NOT EXISTS cows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cow_id TEXT UNIQUE NOT NULL,
  site_label TEXT,
  ebu_non_ebu TEXT,
  region TEXT,
  district TEXT,
  city TEXT,
  location TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  site_status TEXT CHECK (site_status IN ('ON-AIR', 'OFF-AIR', 'STANDBY')),
  remote BOOLEAN,
  vendor TEXT,
  cow_age TEXT CHECK (cow_age IN ('OLD', 'NEW')),
  assigned_warehouse TEXT,
  warehouse_distance_km DECIMAL,
  remarks TEXT,
  technology_2g BOOLEAN,
  technology_3g BOOLEAN,
  technology_lte BOOLEAN,
  technology_5g BOOLEAN,
  availability_2g TEXT,
  availability_3g TEXT,
  availability_lte TEXT,
  availability_5g TEXT,
  configuration_2g TEXT,
  configuration_3g TEXT,
  configuration_lte TEXT,
  configuration_5g TEXT,
  lte_band_count INTEGER,
  _5g_band_count INTEGER,
  lte_configuration_level TEXT,
  pg_status TEXT,
  mdb_type TEXT,
  mdb_status TEXT,
  sec_connection TEXT,
  genset_qty INTEGER,
  genset_make TEXT,
  engine TEXT,
  alternator TEXT,
  capacity TEXT,
  fuel_tank_capacity TEXT,
  cooling_system TEXT,
  under_repairing_ovhauling TEXT,
  installed_bbu TEXT,
  bbu_brand TEXT,
  volt_capacity TEXT,
  no_of_cells INTEGER,
  no_of_strings INTEGER,
  backup_time TEXT,
  bbu_status TEXT,
  dc_power_brand TEXT,
  total_capacity TEXT,
  cabinet_status TEXT,
  rectifiers_installed INTEGER,
  rectifiers_required INTEGER,
  shelter_outdoor TEXT,
  ac_make TEXT,
  ac_capacity TEXT,
  ac_type TEXT,
  ac_qty INTEGER,
  ac_status_1 TEXT,
  ac_status_2 TEXT,
  hvac_brand TEXT,
  hvac_status TEXT,
  fire_panel_type TEXT,
  fire_panel_status TEXT,
  cylinder_status TEXT,
  manual_auto TEXT,
  shelter_tube_rods_status TEXT,
  security_light_status TEXT,
  combination_number TEXT,
  gps_status TEXT,
  tower_height INTEGER,
  tower_type TEXT,
  tower_system TEXT,
  vehicle_make TEXT,
  plate_number_english TEXT,
  plate_number_arabic TEXT,
  mw_dish TEXT,
  mw_frequency TEXT,
  mw_configuration TEXT,
  mw_link_type TEXT,
  last_deploy_date TEXT,
  under_replacement BOOLEAN,
  last_synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  cr_number TEXT,
  vat_number TEXT,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Supplier Equipment junction table
CREATE TABLE IF NOT EXISTS supplier_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  equipment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Warehouses table
CREATE TABLE IF NOT EXISTS warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  latitude DECIMAL,
  longitude DECIMAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cows_cow_id ON cows(cow_id);
CREATE INDEX IF NOT EXISTS idx_cows_site_status ON cows(site_status);
CREATE INDEX IF NOT EXISTS idx_cows_region ON cows(region);
CREATE INDEX IF NOT EXISTS idx_cows_vendor ON cows(vendor);
CREATE INDEX IF NOT EXISTS idx_cows_assigned_warehouse ON cows(assigned_warehouse);
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);
CREATE INDEX IF NOT EXISTS idx_supplier_equipment_supplier_id ON supplier_equipment(supplier_id);
`;

async function createSchema() {
  console.log("\n📊 Creating database schema...");
  try {
    // Split the SQL into individual statements and execute them
    const statements = SCHEMA_SQL.split(";").filter((s) => s.trim());

    for (const statement of statements) {
      if (!statement.trim()) continue;

      const { error } = await supabase.rpc("exec_sql", {
        sql: statement + ";",
      });

      // If exec_sql doesn't exist, try the direct approach
      if (
        error &&
        error.message.includes("function exec_sql")
      ) {
        console.warn(
          "   ⚠️  Note: Schema creation via RPC not available.",
        );
        console.warn(
          "   📝 Please run the SQL manually in Supabase dashboard:",
        );
        console.warn("   1. Go to SQL Editor");
        console.warn("   2. Create new query");
        console.warn(
          "   3. Copy content from: server/migrations/setup-schema.sql",
        );
        console.warn("   4. Click Run");
        return false;
      }
    }

    console.log("   ✓ Schema created successfully");
    return true;
  } catch (error) {
    console.error("   ❌ Error creating schema:", error);
    return false;
  }
}

async function migrateWarehouses() {
  console.log("\n🏢 Migrating warehouses...");
  try {
    const warehouses = [
      { name: "ACES WH Muzahmiya", latitude: 24.517206, longitude: 46.268152 },
      { name: "STC WH Jeddah", latitude: 21.458816, longitude: 39.211939 },
      { name: "STC Sharma WH", latitude: 28.0659, longitude: 35.1728 },
      {
        name: "ACES Dammam WH",
        latitude: 26.201199,
        longitude: 49.947945,
      },
      {
        name: "Madinah STC WH",
        latitude: 24.419135,
        longitude: 39.527377,
      },
      { name: "ACES Makkah WH", latitude: 21.31922, longitude: 39.9033 },
      { name: "STC WH Al Ula", latitude: 26.613083, longitude: 37.9245 },
    ];

    const { error } = await supabase.from("warehouses").insert(
      warehouses.map((w) => ({
        name: w.name,
        latitude: w.latitude,
        longitude: w.longitude,
      })),
    );

    if (error) {
      if (error.message.includes("duplicate key")) {
        console.log("   ℹ️  Warehouses already exist in database");
        return true;
      }
      throw error;
    }

    console.log(`   ✓ Migrated ${warehouses.length} warehouses`);
    return true;
  } catch (error) {
    console.error("   ❌ Error migrating warehouses:", error);
    return false;
  }
}

async function migrateCows() {
  console.log("\n🐄 Migrating COW data...");
  try {
    const cowsJsonPath = path.join(process.cwd(), ".data/cows.json");
    const cowsData = JSON.parse(fs.readFileSync(cowsJsonPath, "utf-8"));

    if (!cowsData.data || !Array.isArray(cowsData.data)) {
      throw new Error("Invalid cows.json structure");
    }

    const cows = cowsData.data;
    console.log(`   Found ${cows.length} COWs to migrate`);

    const cowsToInsert = cows.map((cow: any) => ({
      cow_id: cow.cowId,
      site_label: cow.siteLabel,
      ebu_non_ebu: cow.ebuNonEbu,
      region: cow.region,
      district: cow.district || null,
      city: cow.city,
      location: cow.location,
      latitude: cow.latitude || null,
      longitude: cow.longitude || null,
      site_status: cow.siteStatus,
      remote: cow.remote || null,
      vendor: cow.vendor,
      cow_age: cow.cowAge,
      assigned_warehouse: cow.assignedWarehouse || null,
      warehouse_distance_km: cow.warehouseDistanceKm || null,
      remarks: cow.remarks || null,
      technology_2g: cow.technology2g || null,
      technology_3g: cow.technology3g || null,
      technology_lte: cow.technologyLte || null,
      technology_5g: cow.technology5g || null,
      availability_2g: cow.availability2g || null,
      availability_3g: cow.availability3g || null,
      availability_lte: cow.availabilityLte || null,
      availability_5g: cow.availability5g || null,
      configuration_2g: cow.configuration2g || null,
      configuration_3g: cow.configuration3g || null,
      configuration_lte: cow.configurationLte || null,
      configuration_5g: cow.configuration5g || null,
      lte_band_count: cow.lteBandCount || null,
      _5g_band_count: cow._5gBandCount || null,
      lte_configuration_level: cow.lteConfigurationLevel || null,
      pg_status: cow.pgStatus || null,
      mdb_type: cow.mdbType || null,
      mdb_status: cow.mdbStatus || null,
      sec_connection: cow.secConnection || null,
      genset_qty: cow.gensetQty || null,
      genset_make: cow.gensetMake || null,
      engine: cow.engine || null,
      alternator: cow.alternator || null,
      capacity: cow.capacity || null,
      fuel_tank_capacity: cow.fuelTankCapacity || null,
      cooling_system: cow.coolingSystem || null,
      under_repairing_ovhauling: cow.underRepairingOvhauling || null,
      installed_bbu: cow.installedBbu || null,
      bbu_brand: cow.bbuBrand || null,
      volt_capacity: cow.voltCapacity || null,
      no_of_cells: cow.noOfCells || null,
      no_of_strings: cow.noOfStrings || null,
      backup_time: cow.backupTime || null,
      bbu_status: cow.bbuStatus || null,
      dc_power_brand: cow.dcPowerBrand || null,
      total_capacity: cow.totalCapacity || null,
      cabinet_status: cow.cabinetStatus || null,
      rectifiers_installed: cow.rectifiersInstalled || null,
      rectifiers_required: cow.rectifiersRequired || null,
      shelter_outdoor: cow.shelterOutdoor || null,
      ac_make: cow.acMake || null,
      ac_capacity: cow.acCapacity || null,
      ac_type: cow.acType || null,
      ac_qty: cow.acQty || null,
      ac_status_1: cow.acStatus1 || null,
      ac_status_2: cow.acStatus2 || null,
      hvac_brand: cow.hvacBrand || null,
      hvac_status: cow.hvacStatus || null,
      fire_panel_type: cow.firePanelType || null,
      fire_panel_status: cow.firePanelStatus || null,
      cylinder_status: cow.cylinderStatus || null,
      manual_auto: cow.manualAuto || null,
      shelter_tube_rods_status: cow.shelterTubeRodsStatus || null,
      security_light_status: cow.securityLightStatus || null,
      combination_number: cow.combinationNumber || null,
      gps_status: cow.gpsStatus || null,
      tower_height: cow.towerHeight || null,
      tower_type: cow.towerType || null,
      tower_system: cow.towerSystem || null,
      vehicle_make: cow.vehicleMake || null,
      plate_number_english: cow.plateNumberEnglish || null,
      plate_number_arabic: cow.plateNumberArabic || null,
      mw_dish: cow.mwDish || null,
      mw_frequency: cow.mwFrequency || null,
      mw_configuration: cow.mwConfiguration || null,
      mw_link_type: cow.mwLinkType || null,
      last_deploy_date: cow.lastDeployDate || null,
      under_replacement: cow.underReplacement || false,
      last_synced_at: new Date(cow.lastSyncedAt).toISOString(),
      last_updated_at: new Date(cow.lastUpdatedAt).toISOString(),
      created_at: new Date(cow.createdAt).toISOString(),
    }));

    // Insert in batches
    const batchSize = 100;
    let inserted = 0;

    for (let i = 0; i < cowsToInsert.length; i += batchSize) {
      const batch = cowsToInsert.slice(i, i + batchSize);
      const { error } = await supabase.from("cows").insert(batch);

      if (error && !error.message.includes("duplicate key")) {
        throw error;
      }

      inserted += batch.length;
      if (i === 0 || (i + batchSize) % 500 === 0) {
        console.log(`   Processing ${Math.min(i + batchSize, cowsToInsert.length)}/${cowsToInsert.length}`);
      }
    }

    console.log(`   ✓ Migrated ${inserted} COWs`);
    return true;
  } catch (error) {
    console.error("   ❌ Error migrating COWs:", error);
    return false;
  }
}

async function migrateSuppliers() {
  console.log("\n🏭 Migrating suppliers...");
  try {
    const suppliers = [
      { name: "Masar Al Metahidah" },
      { name: "Engineering Intelligence" },
      { name: "Sheikha Al-Mutairi" },
      { name: "Nakilat Al Khair" },
      { name: "Sword of Time Logistics Services" },
      { name: "Seera Alraedah Cont. Est." },
      { name: "Rawafie Al Majd for Equipment Rental Est." },
      { name: "Quick Arrive for transportation Est." },
      { name: "Hamad Abdullah H . Al-Obaidan EST" },
      { name: "Majed Sunhat Alotaibi EST" },
      { name: "Balansia Alarbaia for General Contracting Est." },
      { name: "Abdullah Ibrahim Al-Subaie Contracting Est." },
    ];

    const { error } = await supabase.from("suppliers").insert(suppliers);

    if (error) {
      if (error.message.includes("duplicate key")) {
        console.log("   ℹ️  Suppliers already exist in database");
        return true;
      }
      throw error;
    }

    console.log(`   ✓ Migrated ${suppliers.length} suppliers`);
    return true;
  } catch (error) {
    console.error("   ❌ Error migrating suppliers:", error);
    return false;
  }
}

async function main() {
  console.log("╔════════════════════════════════════════╗");
  console.log("║  SUPABASE SETUP & MIGRATION UTILITY    ║");
  console.log("╚════════════════════════════════════════╝");

  console.log("\n✓ Environment variables loaded");
  console.log(`  URL: ${supabaseUrl.substring(0, 30)}...`);

  // Try schema creation (may not work without direct RPC)
  const schemaOk = await createSchema();

  // Continue with data migration regardless
  const warehousesOk = await migrateWarehouses();
  const cowsOk = await migrateCows();
  const suppliersOk = await migrateSuppliers();

  console.log("\n╔════════════════════════════════════════╗");
  console.log("║  MIGRATION SUMMARY                     ║");
  console.log("╚════════════════════════════════════════╝");

  if (!schemaOk) {
    console.log(
      "\n⚠️  IMPORTANT: Schema creation step skipped",
    );
    console.log("\n   You need to create the tables manually:");
    console.log("   1. Go to: https://app.supabase.com");
    console.log("   2. Select your project");
    console.log("   3. Go to: SQL Editor");
    console.log("   4. Create new query");
    console.log(
      "   5. Copy & paste: server/migrations/setup-schema.sql",
    );
    console.log("   6. Click Run");
    console.log(
      "\n   After that, rerun this script to migrate data.",
    );
  }

  console.log("\n" + (warehousesOk ? "✓" : "✗") + " Warehouses: " + (warehousesOk ? "OK" : "FAILED"));
  console.log("" + (cowsOk ? "✓" : "✗") + " COWs (555): " + (cowsOk ? "OK" : "FAILED"));
  console.log("" + (suppliersOk ? "✓" : "✗") + " Suppliers (12): " + (suppliersOk ? "OK" : "FAILED"));

  if (warehousesOk && cowsOk && suppliersOk) {
    console.log(
      "\n✨ All migrations completed successfully!",
    );
    console.log("\n📊 Next steps:");
    console.log("   1. Verify data in Supabase dashboard");
    console.log("   2. Update backend routes to use Supabase");
    console.log("   3. Test all functionality");
    process.exit(0);
  } else {
    console.log("\n⚠️  Some migrations failed. Please check the errors above.");
    process.exit(1);
  }
}

main().catch(console.error);
