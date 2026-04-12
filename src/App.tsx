import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { LoginForm } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { EventsList } from "./pages/EventsList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Base url */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterPage />} />
          <Route path="/events" element={<EventsList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;