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

-- Create Warehouses table (reference data)
CREATE TABLE IF NOT EXISTS warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  latitude DECIMAL,
  longitude DECIMAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_cows_cow_id ON cows(cow_id);
CREATE INDEX idx_cows_site_status ON cows(site_status);
CREATE INDEX idx_cows_region ON cows(region);
CREATE INDEX idx_cows_vendor ON cows(vendor);
CREATE INDEX idx_cows_assigned_warehouse ON cows(assigned_warehouse);
CREATE INDEX idx_suppliers_name ON suppliers(name);
CREATE INDEX idx_supplier_equipment_supplier_id ON supplier_equipment(supplier_id);
