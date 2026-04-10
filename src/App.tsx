import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EventsList } from "./pages/EventsList";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginForm } from "./pages/LoginPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<EventsList />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
