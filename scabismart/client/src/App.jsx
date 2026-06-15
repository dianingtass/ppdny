import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoutes";
import Layout from "./components/Layout"
import { AuthProvider } from "./context/AuthContext";
import InstallPrompt from "./components/InstallPrompt";

import LandingPage from "./pages/LandingPage"

import SantriDashboard from "./pages/santri/dashboard"

import SantriScabiesDashboard from "./pages/santri/scabiesDashboard"
import SantriScabiesKonsultasi from "./pages/santri/scabiesKonsultasi"
import SantriScabiesKonsultasiRoom from "./pages/santri/scabiesKonsultasiRoom"
import MateriView from "./pages/viewMateri"
import DetailMateri from "./pages/detailMateri"
import MateriManage from "./pages/manageMateri"
import FaqPage from "./pages/faq"



import TimkesDashboard from "./pages/timkesehatan/dashboard"
import TimkesScreening from "./pages/timkesehatan/screening/daftarSantriScreening"
import TimkesDetailScreening from "./pages/timkesehatan/screening/portalScreening"
import TimkesCreateScreening from "./pages/timkesehatan/screening/formScreening"
import TimkesViewScreening from "./pages/timkesehatan/screening/viewScreening"
import TimkesAbsensiKebersihan from "./pages/timkesehatan/absensi/daftarKamarAbsensi"
import TimkesDetailAbsensi from "./pages/timkesehatan/absensi/portalAbsensi"
import TimkesCreateAbsensi from "./pages/timkesehatan/absensi/formAbsensi"
import TimkesLaporanAbsensi from "./pages/timkesehatan/absensi/viewAbsensi"
import TimkesObservasi from "./pages/timkesehatan/observasi/daftarSantriObservasi"
import TimkesDetailObservasi from "./pages/timkesehatan/observasi/portalObservasi"
import TimkesCreateObservasi from "./pages/timkesehatan/observasi/formObservasi"
import TimkesViewObservasi from "./pages/timkesehatan/observasi/viewObservasi"
import TimkesKonsultasiPage from "./pages/timkesehatan/konsultasi"
import TimkesKonsultasiRiwayatPage from "./pages/timkesehatan/konsultasiRiwayat"

import OrangtuaDashboard from "./pages/orangtua/dashboard"
import OrangtuaScabiesDashboard from "./pages/orangtua/scabiesDashboard"
import OrangTuaPortalScreening from "./pages/orangtua/screening/portalScreening"
import OrangTuaViewScreening from "./pages/orangtua/screening/viewScreening"
import OrangTuaPortalObservasi from "./pages/orangtua/observasi/portalObservasi"
import OrangTuaViewObservasi from "./pages/orangtua/observasi/viewObservasi"




import PimpinanDashboard from "./pages/pimpinan/dashboard"

import PimpinanScreening from "./pages/pimpinan/screening/daftarSantriScreening"
import PimpinanDetailScreening from "./pages/pimpinan/screening/portalScreening"
import PimpinanViewScreening from "./pages/pimpinan/screening/viewScreening"
import PimpinanObservasi from "./pages/pimpinan/observasi/daftarSantriObservasi"
import PimpinanDetailObservasi from "./pages/pimpinan/observasi/portalObservasi"
import PimpinanViewObservasi from "./pages/pimpinan/observasi/viewObservasi"

import AdminDashboard from "./pages/admin/dashboard"

import AdminScreening from "./pages/admin/screening/daftarSantriScreening"
import AdminDetailScreening from "./pages/admin/screening/portalScreening"
import AdminCreateScreening from "./pages/admin/screening/formScreening"
import AdminViewScreening from "./pages/admin/screening/viewScreening"

import AdminObservasi from "./pages/admin/observasi/daftarSantriObservasi"
import AdminDetailObservasi from "./pages/admin/observasi/portalObservasi"
import AdminCreateObservasi from "./pages/admin/observasi/formObservasi"
import AdminViewObservasi from "./pages/admin/observasi/viewObservasi"

import AdminAbsensiKebersihan from "./pages/admin/absensi/daftarKamarAbsensi"
import AdminDetailAbsensi from "./pages/admin/absensi/portalAbsensi"
import AdminCreateAbsensi from "./pages/admin/absensi/formAbsensi"
import AdminLaporanAbsensi from "./pages/admin/absensi/viewAbsensi"

       

function App() {
  return (
    <AuthProvider>
      <InstallPrompt />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/materi" element={<MateriView />} />
          <Route path="/materi/:id" element={<DetailMateri />} />

          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute allowedRoles={['santri']} />}>
            <Route path="/santri">
              <Route index element={<Navigate to="/santri/scabies" replace />} />

              <Route path="scabies">
                <Route index element={<SantriScabiesDashboard />} />
                <Route path="viewMateri" element={<MateriView />} />
                <Route path="viewMateri/:id" element={<DetailMateri />} />
                <Route path="konsultasi" element={<SantriScabiesKonsultasi />} />
                <Route path="konsultasi/room/:roomId" element={<SantriScabiesKonsultasiRoom />} />
              </Route>
            </Route>
          </Route>



          <Route element={<ProtectedRoute allowedRoles={['timkesehatan']} />}>
            <Route path="/timkesehatan" element={<Layout />}>
              <Route index element={<TimkesDashboard />} />

              {/* MATERI */}
              <Route path="manageMateri" element={<MateriManage />} />
              <Route path="manageMateri/:id" element={<DetailMateri />} />
              <Route path="daftarSantriScreening" element={<TimkesScreening />} />
              
              {/* SCREENING */}
              <Route
                path="daftarSantriScreening/:id/create"
                element={<TimkesCreateScreening />}
              />
              <Route
                path="daftarSantriScreening/:id/edit/:screeningId"
                element={<TimkesCreateScreening />}
              />
              <Route
                path="daftarSantriScreening/:id"
                element={<TimkesDetailScreening />}
              />
              <Route
                path="/timkesehatan/daftarSantriScreening/:id/view/:screeningId"
                element={<TimkesViewScreening />}
              />

              {/* ABSENSI KEBERSIHAN */}
              <Route path="daftarAbsensiKamar" element={<TimkesAbsensiKebersihan />}/>
              <Route path="daftarAbsensiKamar/:id" element={<TimkesDetailAbsensi />} />
              <Route path="daftarAbsensiKamar/:id/create" element={<TimkesCreateAbsensi />} />
              <Route
                path="/timkesehatan/daftarAbsensiKamar/:id/edit/:id_heading"
                element={<TimkesCreateAbsensi/>}
                />
              <Route path="daftarAbsensiKamar/:id/laporan" element={<TimkesLaporanAbsensi />} />

              {/* OBSERVASI */}
              <Route path="daftarSantriObservasi" element={<TimkesObservasi />} />
              <Route path="daftarSantriObservasi/:id" element={<TimkesDetailObservasi />} />
              <Route path="daftarSantriObservasi/:id/create" element={<TimkesCreateObservasi />} />
              <Route path="daftarSantriObservasi/:id/view/:observasiId" element={<TimkesViewObservasi />} />

              {/* KONSULTASI */}
              <Route path="konsultasi" element={<TimkesKonsultasiPage />} />
              <Route path="konsultasi/riwayat" element={<TimkesKonsultasiRiwayatPage />} />

              {/* FAQ */}
              <Route path="faq" element={<FaqPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['orangtua']} />}>
            <Route path="/orangtua">
              <Route index element={<OrangtuaDashboard />} />
              <Route path="kesehatan" element={<OrangtuaScabiesDashboard />} />
              <Route path="daftarSantriScreening/:id" element={<OrangTuaPortalScreening />} />
              <Route path="daftarSantriScreening/:id/view/:screeningId" element={<OrangTuaViewScreening />} />
              <Route path="daftarSantriObservasi/:id" element={<OrangTuaPortalObservasi />} />
              <Route path="daftarSantriObservasi/:id/view/:observasiId" element={<OrangTuaViewObservasi />} />

            </Route>
          </Route>



          <Route element={<ProtectedRoute allowedRoles={['pimpinan']} />}>
            <Route path="/pimpinan" element={<Layout />}>
              <Route index element={<PimpinanDashboard />} />

              <Route path="scabies/materi" element={<MateriView />} />
              <Route path="scabies/materi/:id" element={<DetailMateri />} />

              <Route path="daftarSantriScreening" element={<PimpinanScreening />} />
              <Route path="daftarSantriScreening/:id" element={<PimpinanDetailScreening />} />
              <Route path="daftarSantriScreening/:id/view/:screeningId" element={<PimpinanViewScreening />} />
              <Route path="daftarSantriObservasi" element={<PimpinanObservasi />} />
              <Route path="daftarSantriObservasi/:id" element={<PimpinanDetailObservasi />} />
              <Route path="daftarSantriObservasi/:id/view/:observasiId" element={<PimpinanViewObservasi />} />
              <Route path="faq" element={<FaqPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<Layout />}>
              <Route index element={<AdminDashboard />} />


              <Route path="manageMateri" element={<MateriManage />} />
              <Route path="manageMateri/:id" element={<DetailMateri />} />
              <Route path="daftarSantriScreening" element={<AdminScreening />} />
              <Route path="daftarSantriScreening/:id/create" element={<AdminCreateScreening />} />
              <Route path="daftarSantriScreening/:id/edit/:screeningId" element={<AdminCreateScreening />} />
              <Route path="daftarSantriScreening/:id" element={<AdminDetailScreening />} />
              <Route path="daftarSantriScreening/:id/view/:screeningId" element={<AdminViewScreening />} />
              <Route path="daftarSantriObservasi" element={<AdminObservasi />} />
              <Route path="daftarSantriObservasi/:id" element={<AdminDetailObservasi />} />
              <Route path="daftarSantriObservasi/:id/create" element={<AdminCreateObservasi />} />
              <Route path="daftarSantriObservasi/:id/view/:observasiId" element={<AdminViewObservasi />} />
              
              {/* ABSENSI KEBERSIHAN */}
              <Route path="daftarAbsensiKamar" element={<AdminAbsensiKebersihan />}/>
              <Route path="daftarAbsensiKamar/:id" element={<AdminDetailAbsensi />} />
              <Route path="daftarAbsensiKamar/:id/create" element={<AdminCreateAbsensi />} />
              <Route
                path="/admin/daftarAbsensiKamar/:id/edit/:id_heading"
                element={<AdminCreateAbsensi/>}
              />
              <Route path="daftarAbsensiKamar/:id/laporan" element={<AdminLaporanAbsensi />} />

              <Route path="faq" element={<FaqPage />} />
            </Route>
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
