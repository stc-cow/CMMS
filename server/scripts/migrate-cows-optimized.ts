import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateCows() {
  try {
    console.log("Starting COW data migration...");

    // Read the JSON file
    const cowsJsonPath = path.join(process.cwd(), ".data/cows.json");
    console.log(`Reading from: ${cowsJsonPath}`);

    const fileContent = fs.readFileSync(cowsJsonPath, "utf-8");
    const cowsData = JSON.parse(fileContent);

    // Handle both possible structures
    let cows: any[] = [];

    console.log(`JSON structure detected. Keys: ${Object.keys(cowsData).join(", ")}`);
    console.log(`cowsData.cows type: ${typeof cowsData.cows}`);
    console.log(`Is array? ${Array.isArray(cowsData.cows)}`);

    if (Array.isArray(cowsData)) {
      cows = cowsData;
      console.log(`✓ Found ${cows.length} COWs (direct array)`);
    } else if (cowsData.data && Array.isArray(cowsData.data)) {
      cows = cowsData.data;
      console.log(`✓ Found ${cows.length} COWs (in data field)`);
    } else if (cowsData.cows) {
      // Try direct assignment without checking isArray (in case it's already parsed)
      if (Array.isArray(cowsData.cows)) {
        cows = cowsData.cows;
      } else if (typeof cowsData.cows === 'object' && cowsData.cows !== null) {
        // It might be a single object, but in our case it should be an array
        console.warn(`⚠️  cows field exists but is not an array. Type: ${typeof cowsData.cows}`);
        if (cowsData.cows.data && Array.isArray(cowsData.cows.data)) {
          cows = cowsData.cows.data;
        } else {
          throw new Error(`cows field is not an array`);
        }
      }
      console.log(`✓ Found ${cows.length} COWs (in cows field)`);
    } else {
      throw new Error(
        `Invalid cows.json structure. Found keys: ${Object.keys(cowsData).join(", ")}`,
      );
    }

    if (cows.length === 0) {
      throw new Error("No COW records found in the JSON file");
    }

    console.log(`Preparing ${cows.length} records for migration...`);

    // Prepare data for insertion
    const cowsToInsert = cows.map((cow: any) => {
      const siteStatus =
        cow.siteStatus || cow.site_status || "STANDBY";
      const cowAge = cow.cowAge || cow.cow_age || "NEW";

      return {
        cow_id: cow.cowId || cow.cow_id,
        site_label: cow.siteLabel || cow.site_label,
        ebu_non_ebu: cow.ebuNonEbu || cow.ebu_non_ebu,
        region: cow.region,
        district: cow.district || null,
        city: cow.city,
        location: cow.location,
        latitude: cow.latitude || null,
        longitude: cow.longitude || null,
        site_status: siteStatus,
        remote: cow.remote || null,
        vendor: cow.vendor,
        cow_age: cowAge,
        assigned_warehouse: cow.assignedWarehouse || cow.assigned_warehouse || null,
        warehouse_distance_km: cow.warehouseDistanceKm || cow.warehouse_distance_km || null,
        remarks: cow.remarks || null,
        technology_2g: cow.technology2g || cow.technology_2g || null,
        technology_3g: cow.technology3g || cow.technology_3g || null,
        technology_lte: cow.technologyLte || cow.technology_lte || null,
        technology_5g: cow.technology5g || cow.technology_5g || null,
        availability_2g: cow.availability2g || cow.availability_2g || null,
        availability_3g: cow.availability3g || cow.availability_3g || null,
        availability_lte: cow.availabilityLte || cow.availability_lte || null,
        availability_5g: cow.availability5g || cow.availability_5g || null,
        configuration_2g: cow.configuration2g || cow.configuration_2g || null,
        configuration_3g: cow.configuration3g || cow.configuration_3g || null,
        configuration_lte: cow.configurationLte || cow.configuration_lte || null,
        configuration_5g: cow.configuration5g || cow.configuration_5g || null,
        lte_band_count: cow.lteBandCount || cow.lte_band_count || null,
        _5g_band_count: cow._5gBandCount || cow._5g_band_count || null,
        lte_configuration_level:
          cow.lteConfigurationLevel || cow.lte_configuration_level || null,
        pg_status: cow.pgStatus || cow.pg_status || null,
        mdb_type: cow.mdbType || cow.mdb_type || null,
        mdb_status: cow.mdbStatus || cow.mdb_status || null,
        sec_connection: cow.secConnection || cow.sec_connection || null,
        genset_qty: cow.gensetQty || cow.genset_qty || null,
        genset_make: cow.gensetMake || cow.genset_make || null,
        engine: cow.engine || null,
        alternator: cow.alternator || null,
        capacity: cow.capacity || null,
        fuel_tank_capacity: cow.fuelTankCapacity || cow.fuel_tank_capacity || null,
        cooling_system: cow.coolingSystem || cow.cooling_system || null,
        under_repairing_ovhauling:
          cow.underRepairingOvhauling || cow.under_repairing_ovhauling || null,
        installed_bbu: cow.installedBbu || cow.installed_bbu || null,
        bbu_brand: cow.bbuBrand || cow.bbu_brand || null,
        volt_capacity: cow.voltCapacity || cow.volt_capacity || null,
        no_of_cells: cow.noOfCells || cow.no_of_cells || null,
        no_of_strings: cow.noOfStrings || cow.no_of_strings || null,
        backup_time: cow.backupTime || cow.backup_time || null,
        bbu_status: cow.bbuStatus || cow.bbu_status || null,
        dc_power_brand: cow.dcPowerBrand || cow.dc_power_brand || null,
        total_capacity: cow.totalCapacity || cow.total_capacity || null,
        cabinet_status: cow.cabinetStatus || cow.cabinet_status || null,
        rectifiers_installed: cow.rectifiersInstalled || cow.rectifiers_installed || null,
        rectifiers_required: cow.rectifiersRequired || cow.rectifiers_required || null,
        shelter_outdoor: cow.shelterOutdoor || cow.shelter_outdoor || null,
        ac_make: cow.acMake || cow.ac_make || null,
        ac_capacity: cow.acCapacity || cow.ac_capacity || null,
        ac_type: cow.acType || cow.ac_type || null,
        ac_qty: cow.acQty || cow.ac_qty || null,
        ac_status_1: cow.acStatus1 || cow.ac_status_1 || null,
        ac_status_2: cow.acStatus2 || cow.ac_status_2 || null,
        hvac_brand: cow.hvacBrand || cow.hvac_brand || null,
        hvac_status: cow.hvacStatus || cow.hvac_status || null,
        fire_panel_type: cow.firePanelType || cow.fire_panel_type || null,
        fire_panel_status: cow.firePanelStatus || cow.fire_panel_status || null,
        cylinder_status: cow.cylinderStatus || cow.cylinder_status || null,
        manual_auto: cow.manualAuto || cow.manual_auto || null,
        shelter_tube_rods_status:
          cow.shelterTubeRodsStatus || cow.shelter_tube_rods_status || null,
        security_light_status:
          cow.securityLightStatus || cow.security_light_status || null,
        combination_number: cow.combinationNumber || cow.combination_number || null,
        gps_status: cow.gpsStatus || cow.gps_status || null,
        tower_height: cow.towerHeight || cow.tower_height || null,
        tower_type: cow.towerType || cow.tower_type || null,
        tower_system: cow.towerSystem || cow.tower_system || null,
        vehicle_make: cow.vehicleMake || cow.vehicle_make || null,
        plate_number_english:
          cow.plateNumberEnglish || cow.plate_number_english || null,
        plate_number_arabic:
          cow.plateNumberArabic || cow.plate_number_arabic || null,
        mw_dish: cow.mwDish || cow.mw_dish || null,
        mw_frequency: cow.mwFrequency || cow.mw_frequency || null,
        mw_configuration: cow.mwConfiguration || cow.mw_configuration || null,
        mw_link_type: cow.mwLinkType || cow.mw_link_type || null,
        last_deploy_date: cow.lastDeployDate || cow.last_deploy_date || null,
        under_replacement: cow.underReplacement || cow.under_replacement || false,
        last_synced_at: cow.lastSyncedAt ? new Date(cow.lastSyncedAt).toISOString() : new Date().toISOString(),
        last_updated_at: cow.lastUpdatedAt ? new Date(cow.lastUpdatedAt).toISOString() : new Date().toISOString(),
        created_at: cow.createdAt ? new Date(cow.createdAt).toISOString() : new Date().toISOString(),
      };
    });

    // Insert in batches to avoid timeout
    const batchSize = 100;
    let inserted = 0;
    let failed = 0;

    console.log(`Inserting ${cowsToInsert.length} records in batches of ${batchSize}...`);

    for (let i = 0; i < cowsToInsert.length; i += batchSize) {
      const batch = cowsToInsert.slice(i, i + batchSize);
      const { error, data } = await supabase.from("cows").insert(batch);

      if (error) {
        console.error(`❌ Batch ${Math.floor(i / batchSize) + 1} error:`, error.message);
        failed += batch.length;
      } else {
        inserted += batch.length;
      }

      const progress = Math.min(i + batchSize, cowsToInsert.length);
      const percent = ((progress / cowsToInsert.length) * 100).toFixed(1);
      console.log(`   ${progress}/${cowsToInsert.length} (${percent}%)`);
    }

    console.log(`\n✓ Migration complete: ${inserted} inserted, ${failed} failed`);
    return inserted > 0;
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

// Run migration
migrateCows()
  .then(() => {
    console.log("✓ COW migration completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("✗ Migration failed:", error);
    process.exit(1);
  });
