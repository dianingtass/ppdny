import './App.css'
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from "./components/ProtectedRoutes";
import Layout from "./components/Layout"
import { AuthProvider } from "./context/AuthContext";
import InstallPrompt from "./components/InstallPrompt";

// Public Pages
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/Login"));
const MateriView = lazy(() => import("./pages/viewMateri"));
const DetailMateri = lazy(() => import("./pages/detailMateri"));
const FormPendaftaran = lazy(() => import("./pages/ppdb/formPendaftaran"));
const CekStatus = lazy(() => import("./pages/ppdb/cekStatus"));

// Santri Pages
const SantriDashboard = lazy(() => import("./pages/santri/dashboard"));
const SantriProfile = lazy(() => import("./pages/santri/pendataan"));
const SantriKeuangan = lazy(() => import("./pages/santri/keuangan"));
const SantriKegiatan = lazy(() => import("./pages/santri/kegiatan"));
const SantriPengaduan = lazy(() => import("./pages/santri/pengaduan"));
const SantriLayanan = lazy(() => import("./pages/santri/layanan"));
const SantriRiwayatLayanan = lazy(() => import("./pages/santri/riwayatLayanan"));
const SantriScabiesDashboard = lazy(() => import("./pages/santri/scabiesDashboard"));
const SantriScabiesKonsultasi = lazy(() => import("./pages/santri/scabiesKonsultasi"));
const SantriScabiesKonsultasiRoom = lazy(() => import("./pages/santri/scabiesKonsultasiRoom"));

// General / Shared
const MateriManage = lazy(() => import("./pages/manageMateri"));
const FaqPage = lazy(() => import("./pages/faq"));

// Pengurus Pages
const PengurusDashboard = lazy(() => import("./pages/pengurus/dashboard"));
const PengurusSantri = lazy(() => import("./pages/pengurus/dataSantri"));
const PengurusOrangtua = lazy(() => import("./pages/pengurus/dataOrangtua"));
const PengurusUstadz = lazy(() => import("./pages/pengurus/dataUstadz"));
const PengurusKelas = lazy(() => import("./pages/pengurus/dataKelas"));
const PengurusKamar = lazy(() => import("./pages/pengurus/dataKamar"));
const PengurusJenisLayanan = lazy(() => import("./pages/pengurus/jenisLayanan"));
const PengurusJenisTagihan = lazy(() => import("./pages/pengurus/jenisTagihan"));
const PengurusRiwayatLayanan = lazy(() => import("./pages/pengurus/riwayatLayanan"));
const PengurusKeuangan = lazy(() => import("./pages/pengurus/keuangan"));
const PengurusKegiatan = lazy(() => import("./pages/pengurus/kegiatan"));

// Tim Kesehatan Pages
const TimkesDashboard = lazy(() => import("./pages/timkesehatan/dashboard"));
const TimkesScreening = lazy(() => import("./pages/timkesehatan/screening/daftarSantriScreening"));
const TimkesDetailScreening = lazy(() => import("./pages/timkesehatan/screening/portalScreening"));
const TimkesCreateScreening = lazy(() => import("./pages/timkesehatan/screening/formScreening"));
const TimkesViewScreening = lazy(() => import("./pages/timkesehatan/screening/viewScreening"));
const TimkesAbsensiKebersihan = lazy(() => import("./pages/timkesehatan/absensi/daftarKamarAbsensi"));
const TimkesDetailAbsensi = lazy(() => import("./pages/timkesehatan/absensi/portalAbsensi"));
const TimkesCreateAbsensi = lazy(() => import("./pages/timkesehatan/absensi/formAbsensi"));
const TimkesLaporanAbsensi = lazy(() => import("./pages/timkesehatan/absensi/viewAbsensi"));
const TimkesObservasi = lazy(() => import("./pages/timkesehatan/observasi/daftarSantriObservasi"));
const TimkesDetailObservasi = lazy(() => import("./pages/timkesehatan/observasi/portalObservasi"));
const TimkesCreateObservasi = lazy(() => import("./pages/timkesehatan/observasi/formObservasi"));
const TimkesViewObservasi = lazy(() => import("./pages/timkesehatan/observasi/viewObservasi"));
const TimkesKonsultasiPage = lazy(() => import("./pages/timkesehatan/konsultasi"));
const TimkesKonsultasiRiwayatPage = lazy(() => import("./pages/timkesehatan/konsultasiRiwayat"));

// Orang Tua Pages
const OrangtuaDashboard = lazy(() => import("./pages/orangtua/dashboard"));
const OrangtuaScabiesDashboard = lazy(() => import("./pages/orangtua/scabiesDashboard"));
const OrangTuaPortalScreening = lazy(() => import("./pages/orangtua/screening/portalScreening"));
const OrangTuaViewScreening = lazy(() => import("./pages/orangtua/screening/viewScreening"));
const OrangTuaPortalObservasi = lazy(() => import("./pages/orangtua/observasi/portalObservasi"));
const OrangTuaViewObservasi = lazy(() => import("./pages/orangtua/observasi/viewObservasi"));
const OrangtuaProfile = lazy(() => import("./pages/orangtua/pendataan"));
const OrangtuaKegiatan = lazy(() => import("./pages/orangtua/kegiatan"));
const OrangtuaKeuangan = lazy(() => import("./pages/orangtua/keuangan"));
const OrangtuaPengaduan = lazy(() => import("./pages/orangtua/pengaduan"));

// Ustadz Pages
const UstadzDashboard = lazy(() => import("./pages/ustadz/dashboard"));
const UstadzProfile = lazy(() => import("./pages/ustadz/pendataan"));
const UstadzKegiatan = lazy(() => import("./pages/ustadz/kegiatan"));
const UstadzSantri = lazy(() => import("./pages/ustadz/daftarSantri"));
const UstadzPengaduan = lazy(() => import("./pages/ustadz/pengaduan"));

// Pimpinan Pages
const PimpinanDashboard = lazy(() => import("./pages/pimpinan/dashboard"));
const PimpinanSantri = lazy(() => import("./pages/pimpinan/dataSantri"));
const PimpinanUstadz = lazy(() => import("./pages/pimpinan/dataUstadz"));
const PimpinanPengaduan = lazy(() => import("./pages/pimpinan/pengaduan"));
const PimpinanKeuangan = lazy(() => import("./pages/pimpinan/keuangan"));
const PimpinanStaf = lazy(() => import("./pages/pimpinan/dataStaf"));
const PimpinanFeedback = lazy(() => import("./pages/pimpinan/feedback"));
const PimpinanScreening = lazy(() => import("./pages/pimpinan/screening/daftarSantriScreening"));
const PimpinanDetailScreening = lazy(() => import("./pages/pimpinan/screening/portalScreening"));
const PimpinanViewScreening = lazy(() => import("./pages/pimpinan/screening/viewScreening"));
const PimpinanObservasi = lazy(() => import("./pages/pimpinan/observasi/daftarSantriObservasi"));
const PimpinanDetailObservasi = lazy(() => import("./pages/pimpinan/observasi/portalObservasi"));
const PimpinanViewObservasi = lazy(() => import("./pages/pimpinan/observasi/viewObservasi"));
const PimpinanOrangtua = lazy(() => import("./pages/pimpinan/dataOrangtua"));
const PimpinanKelas = lazy(() => import("./pages/pimpinan/dataKelas"));
const PimpinanKamar = lazy(() => import("./pages/pimpinan/dataKamar"));
const PimpinanKegiatan = lazy(() => import("./pages/pimpinan/kegiatan"));
const PimpinanRiwayatLayanan = lazy(() => import("./pages/pimpinan/riwayatLayanan"));
const PimpinanAbsensiKebersihan = lazy(() => import("./pages/pimpinan/absensi/daftarKamarAbsensi"));
const PimpinanDetailAbsensi = lazy(() => import("./pages/pimpinan/absensi/portalAbsensi"));
const PimpinanLaporanAbsensi = lazy(() => import("./pages/pimpinan/absensi/viewAbsensi"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/dashboard"));
const AdminStaf = lazy(() => import("./pages/admin/manajemenStaf"));
const AdminSantri = lazy(() => import("./pages/admin/dataSantri"));
const AdminOrangtua = lazy(() => import("./pages/admin/dataOrangtua"));
const AdminUstadz = lazy(() => import("./pages/admin/dataUstadz"));
const AdminKelas = lazy(() => import("./pages/admin/dataKelas"));
const AdminKamar = lazy(() => import("./pages/admin/dataKamar"));
const AdminJenisLayanan = lazy(() => import("./pages/admin/jenisLayanan"));
const AdminJenisTagihan = lazy(() => import("./pages/admin/jenisTagihan"));
const AdminPengaduan = lazy(() => import("./pages/admin/pengaduan"));
const AdminScreening = lazy(() => import("./pages/admin/screening/daftarSantriScreening"));
const AdminDetailScreening = lazy(() => import("./pages/admin/screening/portalScreening"));
const AdminCreateScreening = lazy(() => import("./pages/admin/screening/formScreening"));
const AdminViewScreening = lazy(() => import("./pages/admin/screening/viewScreening"));
const AdminKegiatan = lazy(() => import("./pages/admin/kegiatan"));
const AdminRiwayatLayanan = lazy(() => import("./pages/admin/riwayatLayanan"));
const AdminKeuangan = lazy(() => import("./pages/admin/keuangan"));
const AdminFeedback = lazy(() => import("./pages/admin/feedback"));
const AdminLog = lazy(() => import("./pages/admin/log"));
const AdminObservasi = lazy(() => import("./pages/admin/observasi/daftarSantriObservasi"));
const AdminDetailObservasi = lazy(() => import("./pages/admin/observasi/portalObservasi"));
const AdminCreateObservasi = lazy(() => import("./pages/admin/observasi/formObservasi"));
const AdminViewObservasi = lazy(() => import("./pages/admin/observasi/viewObservasi"));
const AdminAbsensiKebersihan = lazy(() => import("./pages/admin/absensi/daftarKamarAbsensi"));
const AdminDetailAbsensi = lazy(() => import("./pages/admin/absensi/portalAbsensi"));
const AdminCreateAbsensi = lazy(() => import("./pages/admin/absensi/formAbsensi"));
const AdminLaporanAbsensi = lazy(() => import("./pages/admin/absensi/viewAbsensi"));

// PPDB Pages
const PpdbDashboard = lazy(() => import("./pages/ppdb/adminDashboard"));
const Pendaftar = lazy(() => import("./pages/ppdb/adminPendaftar"));
const Seleksi = lazy(() => import("./pages/ppdb/panitiaSeleksi"));

function App() {
  return (
    <AuthProvider>
      <InstallPrompt />
      <BrowserRouter>
        <Suspense fallback={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/materi" element={<MateriView />} />
          <Route path="/materi/:id" element={<DetailMateri />} />
          <Route path="/ppdb/daftar" element={<FormPendaftaran />} />
          <Route path="/ppdb/cek-status" element={<CekStatus />} />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute allowedRoles={['santri']} />}>
            <Route path="/santri">
              <Route index element={<SantriDashboard />} />
              <Route path="profil" element={<SantriProfile />} />
              <Route path="keuangan" element={<SantriKeuangan />} />
              <Route path="kegiatan" element={<SantriKegiatan />} />
              <Route path="pengaduan" element={<SantriPengaduan />} />
              <Route path="layanan">
                <Route index element={<SantriLayanan />} />
                <Route path="riwayat" element={<SantriRiwayatLayanan />} />
              </Route>
              <Route path="scabies">
                <Route index element={<SantriScabiesDashboard />} />
                <Route path="viewMateri" element={<MateriView />} />
                <Route path="viewMateri/:id" element={<DetailMateri />} />
                <Route path="konsultasi" element={<SantriScabiesKonsultasi />} />
                <Route path="konsultasi/room/:roomId" element={<SantriScabiesKonsultasiRoom />} />
              </Route>
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['pengurus']} />}>
            <Route path="/pengurus" element={<Layout />}>
              <Route index element={<PengurusDashboard />} />
              <Route path="data-santri" element={<PengurusSantri />} />
              <Route path="data-orangtua" element={<PengurusOrangtua />} />
              <Route path="data-ustadz" element={<PengurusUstadz />} />
              <Route path="data-kelas" element={<PengurusKelas />} />
              <Route path="data-kamar" element={<PengurusKamar />} />
              <Route path="jenis-layanan" element={<PengurusJenisLayanan />} />
              <Route path="jenis-tagihan" element={<PengurusJenisTagihan />} />
              <Route path="riwayat-layanan" element={<PengurusRiwayatLayanan />} />
              <Route path="keuangan" element={<PengurusKeuangan />} />
              <Route path="kegiatan" element={<PengurusKegiatan />} />
              <Route path="ppdb/rekapitulasi" element={<PpdbDashboard />} />
              <Route path="ppdb/pendaftar" element={<Pendaftar />} />
              <Route path="ppdb/seleksi" element={<Seleksi />} />
              <Route path="faq" element={<FaqPage />} />
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
              <Route path="profil" element={<OrangtuaProfile />} />
              <Route path="kegiatan" element={<OrangtuaKegiatan />} />
              <Route path="keuangan" element={<OrangtuaKeuangan />} />
              <Route path="pengaduan" element={<OrangtuaPengaduan />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ustadz']} />}>
            <Route path="/ustadz">
              <Route index element={<UstadzDashboard />} />
              <Route path="profil" element={<UstadzProfile />} />
              <Route path="kegiatan" element={<UstadzKegiatan />} />
              <Route path="daftar-santri" element={<UstadzSantri />} />
              <Route path="pengaduan" element={<UstadzPengaduan />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['pimpinan']} />}>
            <Route path="/pimpinan" element={<Layout />}>
              <Route index element={<PimpinanDashboard />} />
              <Route path="data-santri" element={<PimpinanSantri />} />
              <Route path="data-ustadz" element={<PimpinanUstadz />} />
              <Route path="data-staf" element={<PimpinanStaf />} />
              <Route path="data-orangtua" element={<PimpinanOrangtua />} />
              <Route path="data-kelas" element={<PimpinanKelas />} />
              <Route path="data-kamar" element={<PimpinanKamar />} />
              <Route path="kegiatan" element={<PimpinanKegiatan />} />
              <Route path="riwayat-layanan" element={<PimpinanRiwayatLayanan />} />
              
              {/* ABSENSI KEBERSIHAN */}
              <Route path="daftarAbsensiKamar" element={<PimpinanAbsensiKebersihan />} />
              <Route path="daftarAbsensiKamar/:id" element={<PimpinanDetailAbsensi />} />
              <Route path="daftarAbsensiKamar/:id/laporan" element={<PimpinanLaporanAbsensi />} />

              <Route path="scabies/materi" element={<MateriView />} />
              <Route path="scabies/materi/:id" element={<DetailMateri />} />
              <Route path="pengaduan" element={<PimpinanPengaduan />} />
              <Route path="keuangan" element={<PimpinanKeuangan />} />
              <Route path="feedback" element={<PimpinanFeedback />} />
              <Route path="ppdb/rekapitulasi" element={<PpdbDashboard />} />
              <Route path="ppdb/pendaftar" element={<Pendaftar />} />
              <Route path="ppdb/seleksi" element={<Seleksi />} />
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
              <Route path="data-staf" element={<AdminStaf />} />
              <Route path="data-santri" element={<AdminSantri />} />
              <Route path="data-orangtua" element={<AdminOrangtua />} />
              <Route path="data-ustadz" element={<AdminUstadz />} />
              <Route path="data-kelas" element={<AdminKelas />} />
              <Route path="data-kamar" element={<AdminKamar />} />
              <Route path="jenis-layanan" element={<AdminJenisLayanan />} />
              <Route path="jenis-tagihan" element={<AdminJenisTagihan />} />
              <Route path="pengaduan" element={<AdminPengaduan />} />
              <Route path="kegiatan" element={<AdminKegiatan />} />
              <Route path="riwayat-layanan" element={<AdminRiwayatLayanan />} />
              <Route path="keuangan" element={<AdminKeuangan />} />
              <Route path="feedback" element={<AdminFeedback />} />
              <Route path="log" element={<AdminLog />} />

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
              <Route path="ppdb/rekapitulasi" element={<PpdbDashboard />} />
              <Route path="ppdb/pendaftar" element={<Pendaftar />} />
              <Route path="ppdb/seleksi" element={<Seleksi />} />
              <Route path="faq" element={<FaqPage />} />
            </Route>
          </Route>

        </Routes>
      </Suspense>
    </BrowserRouter>
  </AuthProvider>
  );
}

export default App
