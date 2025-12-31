import { OffAirByVendor } from "@shared/api";
import { Package } from "lucide-react";

interface Props {
  data: OffAirByVendor[];
  onDrillDown?: (vendor: string) => void;
}

export function OffAirByVendorCard({ data, onDrillDown }: Props) {
  const totalOffAir = data.reduce((sum, item) => sum + item.count, 0);
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-indigo-500",
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Package size={24} className="text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Warehouse Stock by Vendor
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          {data.length === 0 ? (
            <p className="text-muted-foreground text-sm">No OFF-AIR COWs</p>
          ) : (
            data.map((item, idx) => (
              <button
                key={item.vendor}
                onClick={() => onDrillDown?.(item.vendor)}
                className="group flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${colors[idx % colors.length]}`}
                  />
                  <span className="font-medium text-foreground text-sm">
                    {item.vendor}
                  </span>
                </div>
                <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                  {item.count}
                </span>
              </button>
            ))
          )}
        </div>

        <div className="flex items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-5xl font-bold text-primary">{totalOffAir}</p>
            <p className="text-muted-foreground text-sm">Total in Warehouse</p>
          </div>
        </div>
      </div>
    </div>
  );
}
