import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import COWRegistry from "./pages/COWRegistry";
import COWDetail from "./pages/COWDetail";
import Movements from "./pages/Movements";
import Suppliers from "./pages/Suppliers";
import RateCards from "./pages/RateCards";
import Invoices from "./pages/Invoices";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Index />} />
            <Route path="/cows" element={<COWRegistry />} />
            <Route path="/cows/:cowId" element={<COWDetail />} />
            <Route path="/movements" element={<Movements />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/rate-cards" element={<RateCards />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
