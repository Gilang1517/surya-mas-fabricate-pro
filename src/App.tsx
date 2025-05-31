import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Materials from "./pages/Materials";
import MaterialDetails from "./pages/MaterialDetails";
import Machines from "./pages/Machines";
import MachineDetails from "./pages/MachineDetails";
import Transactions from "./pages/Transactions";
import MachineTransactions from "./pages/MachineTransactions";
import MachineBorrow from "./pages/MachineBorrow";
import MachineService from "./pages/MachineService";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import StockControl from "./pages/StockControl";
import UserManagement from "./pages/UserManagement";
import PermissionManagement from "./pages/PermissionManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Index />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="materials" element={<Materials />} />
                <Route path="materials/:id" element={<MaterialDetails />} />
                <Route path="machines" element={<Machines />} />
                <Route path="machines/:id" element={<MachineDetails />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="machine-transactions" element={<MachineTransactions />} />
                <Route path="machine-borrow" element={<MachineBorrow />} />
                <Route path="machine-service" element={<MachineService />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="reports" element={<Reports />} />
                <Route path="stock-control" element={<StockControl />} />
                <Route path="user-management" element={
                  <ProtectedRoute requireAdmin={true}>
                    <UserManagement />
                  </ProtectedRoute>
                } />
                <Route path="permission-management" element={
                  <ProtectedRoute requireAdmin={true}>
                    <PermissionManagement />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
