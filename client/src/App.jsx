import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login"
import SantriDashboard from "./pages/santri/dashboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/santri" element={<SantriDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App