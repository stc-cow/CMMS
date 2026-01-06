import { supabase } from "../supabase-client";

interface Supplier {
  id: string;
  name: string;
  crNumber?: string;
  vatNumber?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  equipment?: string[];
}

// Initial suppliers data
const SUPPLIERS: Supplier[] = [
  { id: "1", name: "Masar Al Metahidah", equipment: [] },
  { id: "2", name: "Engineering Intelligence", equipment: [] },
  { id: "3", name: "Sheikha Al-Mutairi", equipment: [] },
  { id: "4", name: "Nakilat Al Khair", equipment: [] },
  { id: "5", name: "Sword of Time Logistics Services", equipment: [] },
  { id: "6", name: "Seera Alraedah Cont. Est.", equipment: [] },
  { id: "7", name: "Rawafie Al Majd for Equipment Rental Est.", equipment: [] },
  { id: "8", name: "Quick Arrive for transportation Est.", equipment: [] },
  { id: "9", name: "Hamad Abdullah H . Al-Obaidan EST", equipment: [] },
  { id: "10", name: "Majed Sunhat Alotaibi EST", equipment: [] },
  {
    id: "11",
    name: "Balansia Alarbaia for General Contracting Est.",
    equipment: [],
  },
  {
    id: "12",
    name: "Abdullah Ibrahim Al-Subaie Contracting Est.",
    equipment: [],
  },
];

async function migrateSuppliers() {
  try {
    console.log("Starting Suppliers data migration...");

    const suppliersToInsert = SUPPLIERS.map((supplier) => ({
      id: crypto.randomUUID(),
      name: supplier.name,
      cr_number: supplier.crNumber || null,
      vat_number: supplier.vatNumber || null,
      contact_person: supplier.contactPerson || null,
      phone: supplier.phone || null,
      email: supplier.email || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    console.log(`Inserting ${suppliersToInsert.length} suppliers...`);

    const { error } = await supabase
      .from("suppliers")
      .insert(suppliersToInsert);

    if (error) {
      console.error("Error inserting suppliers:", error);
      throw error;
    }

    console.log(
      `✓ Successfully migrated ${suppliersToInsert.length} suppliers to Supabase`,
    );
    return true;
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

// Run migration
migrateSuppliers()
  .then(() => {
    console.log("Migration completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
