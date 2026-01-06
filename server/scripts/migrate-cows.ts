import fs from "fs";
import path from "path";
import { supabase } from "../supabase-client";
import type { COW } from "../../shared/api";

async function migrateCows() {
  try {
    console.log("Starting COW data migration...");

    // Read the JSON file
    const cowsJsonPath = path.join(process.cwd(), ".data/cows.json");
    const cowsData = JSON.parse(fs.readFileSync(cowsJsonPath, "utf-8"));

    if (!cowsData.data || !Array.isArray(cowsData.data)) {
      throw new Error("Invalid cows.json structure");
    }

    const cows: COW[] = cowsData.data;
    console.log(`Found ${cows.length} COWs to migrate`);

    // Prepare data for insertion
    const cowsToInsert = cows.map((cow) => ({
      id: crypto.randomUUID(),
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

    // Insert in batches to avoid timeout
    const batchSize = 100;
    let inserted = 0;

    for (let i = 0; i < cowsToInsert.length; i += batchSize) {
      const batch = cowsToInsert.slice(i, i + batchSize);
      const { error } = await supabase.from("cows").insert(batch);

      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
        throw error;
      }

      inserted += batch.length;
      console.log(`Inserted ${inserted}/${cowsToInsert.length} COWs`);
    }

    console.log(`✓ Successfully migrated ${inserted} COWs to Supabase`);
    return true;
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

// Run migration
migrateCows()
  .then(() => {
    console.log("Migration completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
