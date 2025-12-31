import { CowAgeBreakdown } from "@shared/api";
import { Zap } from "lucide-react";

interface Props {
  data: CowAgeBreakdown;
  onDrillDown?: (age: "NEW" | "OLD") => void;
}

export function CowAgeBreakdownCard({ data, onDrillDown }: Props) {
  const total = data.new + data.old;
  const newPercentage = total > 0 ? (data.new / total) * 100 : 0;
  const oldPercentage = total > 0 ? (data.old / total) * 100 : 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Zap size={24} className="text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          New vs Old COWs
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <button
            onClick={() => onDrillDown?.("NEW")}
            className="w-full group flex flex-col p-4 rounded-lg bg-green-500/10 border border-green-500/20 hover:shadow-md transition-all cursor-pointer"
          >
            <p className="text-sm font-medium text-muted-foreground mb-1">
              New COWs
            </p>
            <p className="text-4xl font-bold text-green-600 group-hover:text-green-700 transition-colors">
              {data.new}
            </p>
            <div className="mt-2 w-full bg-secondary rounded-full h-2">
              <div
                className="bg-green-500 h-full rounded-full"
                style={{ width: `${newPercentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {newPercentage.toFixed(1)}%
            </p>
          </button>

          <button
            onClick={() => onDrillDown?.("OLD")}
            className="w-full group flex flex-col p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 hover:shadow-md transition-all cursor-pointer"
          >
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Old COWs
            </p>
            <p className="text-4xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
              {data.old}
            </p>
            <div className="mt-2 w-full bg-secondary rounded-full h-2">
              <div
                className="bg-orange-500 h-full rounded-full"
                style={{ width: `${oldPercentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {oldPercentage.toFixed(1)}%
            </p>
          </button>
        </div>

        <div className="flex items-center justify-center bg-secondary/30 rounded-lg p-6">
          <div className="text-center space-y-2">
            <p className="text-5xl font-bold text-foreground">{total}</p>
            <p className="text-muted-foreground">Total COWs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
