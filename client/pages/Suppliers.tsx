import { PlaceholderPage } from "./Placeholder";
import { Users } from "lucide-react";

export default function Suppliers() {
  return (
    <PlaceholderPage
      icon={<Users size={32} />}
      title="Supplier Management"
      description="Manage supplier master data including unified names, CR/VAT numbers, bank details, contract terms, rate cards, and contact persons. Configure pricing rules by equipment, route, and unit type."
      breadcrumb="Suppliers"
    />
  );
}
