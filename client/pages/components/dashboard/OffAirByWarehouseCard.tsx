import { OffAirByWarehouse, WarehouseDistribution } from "@shared/api";
import { Package, MapPin } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  data: OffAirByWarehouse[];
  onDrillDown?: (warehouse: string) => void;
}

interface DrillDownState {
  isOpen: boolean;
  warehouse: string | null;
  loading: boolean;
  items: WarehouseDistribution[];
}

export function OffAirByWarehouseCard({ data, onDrillDown }: Props) {
  const [drillDown, setDrillDown] = useState<DrillDownState>({
    isOpen: false,
    warehouse: null,
    loading: false,
    items: [],
  });

  const totalOffAir = data.reduce((sum, item) => sum + item.count, 0);

  const handleDrillDown = async (warehouse: string) => {
    setDrillDown({
      isOpen: true,
      warehouse,
      loading: true,
      items: [],
    });

    try {
      const params = new URLSearchParams({ warehouse });
      const response = await fetch(`/api/cows/dashboard/warehouse-drill-down?${params}`);
      if (!response.ok) throw new Error("Failed to fetch warehouse data");
      const result = await response.json();
      setDrillDown((prev) => ({
        ...prev,
        loading: false,
        items: result.data || [],
      }));
    } catch (error) {
      console.error("Error fetching warehouse drill-down:", error);
      setDrillDown((prev) => ({
        ...prev,
        loading: false,
        items: [],
      }));
    }

    onDrillDown?.(warehouse);
  };

  const closeDrillDown = () => {
    setDrillDown({
      isOpen: false,
      warehouse: null,
      loading: false,
      items: [],
    });
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2">
          <MapPin size={24} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">OFF-AIR COWs by Warehouse</h2>
        </div>

        {data.length === 0 ? (
          <p className="text-muted-foreground text-sm">No OFF-AIR COWs assigned to warehouses</p>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2">
              {data.map((item) => {
                const percentage = totalOffAir > 0 ? (item.count / totalOffAir) * 100 : 0;
                return (
                  <button
                    key={item.warehouse}
                    onClick={() => handleDrillDown(item.warehouse)}
                    className="w-full text-left space-y-1 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group border border-transparent hover:border-primary/20"
                  >
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.warehouse}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground font-semibold text-right min-w-12">
                          {item.count}
                        </span>
                        <span className="text-xs text-muted-foreground">({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Total OFF-AIR: <span className="font-semibold text-foreground">{totalOffAir} COWs</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Warehouse Drill-Down Modal */}
      <Dialog open={drillDown.isOpen} onOpenChange={closeDrillDown}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {drillDown.warehouse}: {drillDown.items.length} COWs
            </DialogTitle>
          </DialogHeader>

          {drillDown.loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading...</div>
            </div>
          ) : drillDown.items.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">No COWs found for this warehouse</div>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-2 pr-4">
                {drillDown.items.map((item) => (
                  <div
                    key={item.cowId}
                    className="p-3 rounded-lg bg-secondary/30 border border-secondary space-y-1"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-semibold text-foreground">{item.cowId}</p>
                        <p className="text-xs text-muted-foreground">{item.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-primary">
                          {item.distanceKm.toFixed(2)} km
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span><strong>Vendor:</strong> {item.vendor}</span>
                      <span><strong>Region:</strong> {item.region}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
