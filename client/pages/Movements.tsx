import { PlaceholderPage } from "./Placeholder";
import { Truck } from "lucide-react";

export default function Movements() {
  return (
    <PlaceholderPage
      icon={<Truck size={32} />}
      title="Movement Management"
      description="Create, track, and manage COW movements. Define routes, scope (loading/move/unloading), assign suppliers and equipment, and track the entire lifecycle from draft through completion and invoicing."
      breadcrumb="Movements"
    />
  );
}
