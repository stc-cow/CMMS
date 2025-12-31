import { X, Loader2 } from "lucide-react";
import { DrillDownCOW } from "@shared/api";

interface Props {
  isOpen: boolean;
  title: string;
  data: DrillDownCOW[];
  loading: boolean;
  onClose: () => void;
}

export function DrillDownModal({
  isOpen,
  title,
  data,
  loading,
  onClose,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded transition-colors"
            aria-label="Close modal"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : data.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">No COWs found</p>
            </div>
          ) : (
            <div className="p-6 space-y-2">
              {data.map((cow) => (
                <div
                  key={cow.cowId}
                  className="flex items-start justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="space-y-1 flex-1">
                    <p className="font-semibold text-foreground">{cow.cowId}</p>
                    <p className="text-sm text-muted-foreground">
                      {cow.location}
                    </p>
                    <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                      <span>Region: {cow.region}</span>
                      <span>Vendor: {cow.vendor}</span>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        cow.siteStatus === "ON-AIR"
                          ? "bg-green-500/10 text-green-700"
                          : cow.siteStatus === "OFF-AIR"
                            ? "bg-red-500/10 text-red-700"
                            : "bg-yellow-500/10 text-yellow-700"
                      }`}
                    >
                      {cow.siteStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-secondary/20 flex items-center justify-between sticky bottom-0">
          <p className="text-sm text-muted-foreground">
            {data.length} COWs found
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors font-medium text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
