import { PlaceholderPage } from "./Placeholder";
import { Package } from "lucide-react";

export default function COWRegistry() {
  return (
    <PlaceholderPage
      icon={<Package size={32} />}
      title="COW Registry"
      description="Manage your COW assets, including IDs, types, configurations, sites, regions, owners, cost centers, and status tracking. This is the master data foundation for all movement operations."
      breadcrumb="COW Registry"
    />
  );
}
