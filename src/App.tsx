import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";
import { DashboardOverview } from "./pages/admin/DashboardOverview";
import { EventsManagement } from "./pages/admin/EventsManagement";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Redirect root to admin for now, or handle landing page */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="events" element={<EventsManagement />} />
          <Route path="users" element={<div>Users Management (TBD)</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
