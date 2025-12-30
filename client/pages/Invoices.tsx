import { PlaceholderPage } from "./Placeholder";
import { FileText } from "lucide-react";

export default function Invoices() {
  return (
    <PlaceholderPage
      icon={<FileText size={32} />}
      title="Invoice Management"
      description="Auto-generate invoices from approved movements, group by supplier and period, apply VAT calculations, and manage approval workflows. Export to PDF, Excel, or invoice packs with supporting documentation."
      breadcrumb="Invoices"
    />
  );
}
