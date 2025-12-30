import { PlaceholderPage } from "./Placeholder";
import { Zap } from "lucide-react";

export default function RateCards() {
  return (
    <PlaceholderPage
      icon={<Zap size={32} />}
      title="Rate Card Management"
      description="Configure pricing rules for suppliers and equipment. Set rates by unit type (trip/day/hour), routes, distance bands, regions, and special charges. Manage effective dates for historical pricing accuracy."
      breadcrumb="Rate Cards"
    />
  );
}
