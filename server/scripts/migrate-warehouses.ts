import { WAREHOUSES } from "../warehouse";
import { supabase } from "../supabase-client";

async function migrateWarehouses() {
  try {
    console.log("Starting Warehouses data migration...");

    const warehousesToInsert = WAREHOUSES.map((warehouse) => ({
      id: crypto.randomUUID(),
      name: warehouse.name,
      latitude: warehouse.latitude,
      longitude: warehouse.longitude,
      created_at: new Date().toISOString(),
    }));

    console.log(`Inserting ${warehousesToInsert.length} warehouses...`);

    const { error } = await supabase
      .from("warehouses")
      .insert(warehousesToInsert);

    if (error) {
      console.error("Error inserting warehouses:", error);
      throw error;
    }

    console.log(
      `✓ Successfully migrated ${warehousesToInsert.length} warehouses to Supabase`,
    );
    return true;
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

// Run migration
migrateWarehouses()
  .then(() => {
    console.log("Migration completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
