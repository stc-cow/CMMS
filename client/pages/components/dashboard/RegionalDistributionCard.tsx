import { RegionalDistribution } from "@shared/api";
import { TrendingUp, MapPin } from "lucide-react";

interface Props {
  data: RegionalDistribution[];
  onDrillDown?: (region: string) => void;
}

export function RegionalDistributionCard({ data, onDrillDown }: Props) {
  const maxValue = Math.max(...data.map((d) => d.totalCows), 0);
  const totalCows = data.reduce((sum, item) => sum + item.totalCows, 0);

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-2">
        <MapPin size={24} className="text-primary" />
        <h2 className="text-xl font-semibold text-foreground">COW Distribution by Region</h2>
      </div>

      <div className="space-y-3">
        {data.length === 0 ? (
          <p className="text-muted-foreground text-sm">No data available</p>
        ) : (
          <>
            {data.map((item) => {
              const percentage = totalCows > 0 ? (item.totalCows / totalCows) * 100 : 0;
              const barPercentage = maxValue > 0 ? (item.totalCows / maxValue) * 100 : 0;
              return (
                <button
                  key={item.region}
                  onClick={() => onDrillDown?.(item.region)}
                  className="w-full text-left space-y-1 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group"
                >
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.region}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground font-semibold text-right min-w-12">
                        {item.totalCows}
                      </span>
                      <span className="text-xs text-muted-foreground">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-primary/70 h-full transition-all duration-300"
                      style={{ width: `${barPercentage}%` }}
                    />
                  </div>
                </button>
              );
            })}
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Total: {totalCows} COWs across {data.length} regions
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
