
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Dashboard from "./pages/Dashboard";
import Materials from "./pages/Materials";
import MaterialDetails from "./pages/MaterialDetails";
import Machines from "./pages/Machines";
import MachineDetails from "./pages/MachineDetails";
import MachineTransactions from "./pages/MachineTransactions";
import MachineBorrow from "./pages/MachineBorrow";
import MachineService from "./pages/MachineService";
import Transactions from "./pages/Transactions";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/materials/:id" element={<MaterialDetails />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/machines" element={<Machines />} />
            <Route path="/machines/:id" element={<MachineDetails />} />
            <Route path="/machine-transactions" element={<MachineTransactions />} />
            <Route path="/machine-borrow" element={<MachineBorrow />} />
            <Route path="/machine-service" element={<MachineService />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
