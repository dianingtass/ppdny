import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login"
import SantriDashboard from "./pages/santri/dashboard"
<<<<<<< Updated upstream
=======
import SantriProfil from "./pages/santri/pendataan"
import SantriKeuangan from "./pages/santri/keuangan"
>>>>>>> Stashed changes

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/santri" element={<SantriDashboard />} />
<<<<<<< Updated upstream
=======
        <Route path="/santri/profil" element={<SantriProfil />} />
        <Route path="/santri/keuangan" element={<SantriKeuangan />} />
>>>>>>> Stashed changes
      </Routes>
    </BrowserRouter>
  );
}

export default App