import { PlaceholderPage } from "./Placeholder";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <PlaceholderPage
      icon={<SettingsIcon size={32} />}
      title="System Settings"
      description="Configure system-wide settings, user roles and permissions, approval workflows, company details, regional configurations, and integration parameters."
      breadcrumb="Settings"
    />
  );
}
