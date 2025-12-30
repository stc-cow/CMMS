import { RegionalDistribution } from "@shared/api";
import { TrendingUp } from "lucide-react";

interface Props {
  data: RegionalDistribution[];
}

export function RegionalDistributionCard({ data }: Props) {
  const maxValue = Math.max(...data.map((d) => d.totalCows), 0);

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp size={24} className="text-primary" />
        <h2 className="text-xl font-semibold text-foreground">COW Distribution by Region</h2>
      </div>

      <div className="space-y-3">
        {data.length === 0 ? (
          <p className="text-muted-foreground text-sm">No data available</p>
        ) : (
          data.map((item) => {
            const percentage = maxValue > 0 ? (item.totalCows / maxValue) * 100 : 0;
            return (
              <div key={item.region} className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-foreground">{item.region}</span>
                  <span className="text-muted-foreground font-semibold">{item.totalCows}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary to-primary/70 h-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
