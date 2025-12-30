import { ReactNode } from "react";
import { Layout } from "@/components/layout";
import { Link } from "react-router-dom";
import { ArrowLeft, Zap } from "lucide-react";

interface PlaceholderProps {
  icon: ReactNode;
  title: string;
  description: string;
  breadcrumb?: string;
}

export function PlaceholderPage({
  icon,
  title,
  description,
  breadcrumb,
}: PlaceholderProps) {
  return (
    <Layout>
      <div className="space-y-8">
        {breadcrumb && (
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        )}

        <div className="flex flex-col items-center justify-center text-center py-20">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
            <div className="text-primary text-4xl">{icon}</div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-3">{title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8">
            {description}
          </p>

          <div className="bg-card border border-border rounded-xl p-8 max-w-2xl w-full">
            <div className="flex items-start gap-4 mb-6">
              <Zap className="text-primary flex-shrink-0 mt-1" size={20} />
              <div className="text-left">
                <h3 className="font-bold text-foreground mb-2">
                  Feature Coming Soon
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This module is being implemented. Continue working with the
                  assistant to build out this feature.
                </p>
                <div className="bg-primary/5 rounded-lg p-4 text-sm">
                  <p className="text-muted-foreground">
                    <strong>How to proceed:</strong> Ask the assistant to
                    implement this module with specific details about what you
                    need. The assistant will build screens, forms, and logic
                    based on your requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:shadow-lg transition-shadow"
          >
            <ArrowLeft size={18} />
            Return to Dashboard
          </Link>
        </div>
      </div>
    </Layout>
  );
}
