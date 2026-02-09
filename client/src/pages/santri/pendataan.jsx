import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  User, Save, Lock, Camera, ArrowLeft, Loader2, 
  AlertTriangle, CheckCircle, Trash2, Plus, Edit2, X 
} from "lucide-react";

// Import Komponen Baru
import PasswordModal from "../../components/PasswordModal";
import OrtuModal from "../../components/OrtuModal";

export default function SantriProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  // Data Profil
  const [dataPondok, setDataPondok] = useState({});
  const [dataDiri, setDataDiri] = useState({});
  const [orangTua, setOrangTua] = useState([]);
  const [fotoProfil, setFotoProfil] = useState(null);
  
  // State Modal Control
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showOrtuModal, setShowOrtuModal] = useState(false);
  
  // State Edit Helper
  const [isEditingOrtu, setIsEditingOrtu] = useState(false); 
  const [editOrtuData, setEditOrtuData] = useState(null); // Data ortu yg sedang diedit
  const [editId, setEditId] = useState(null); // ID Relasi

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  
  const API_URL = "http://localhost:3000/api/santri/profile"; 

  const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const showAlert = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => { setMessage({ type: "", text: "" }); }, 3000);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/");
      if (response.data.success) {
        const { data_pondok, data_diri, orang_tua, foto_profil } = response.data.data;
        setDataPondok(data_pondok);
        setDataDiri(data_diri);
        setOrangTua(orang_tua);
        setFotoProfil(foto_profil);
      }
    } catch (err) {
      console.error(err);
      showAlert("error", "Gagal memuat data profil");
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers Profil Utama ---
  const handleUpdateDataDiri = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await api.put("/update", dataDiri);
      showAlert("success", "Data diri berhasil disimpan");
    } catch (err) {
      showAlert("error", "Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showAlert("error", "Ukuran file maksimal 2MB"); return; }
    const formData = new FormData();
    formData.append('foto', file); 
    try {
      setSaving(true); 
      const res = await api.post('/photo', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data.success) {
          setFotoProfil(res.data.data.url);
          showAlert("success", "Foto profil berhasil diperbarui");
      }
    } catch (err) {
      showAlert("error", "Gagal upload foto");
    } finally {
      setSaving(false);
    }
  };

  // --- Handlers Modal Password ---
  const handleSubmitPassword = async (newPassword) => {
    setSaving(true);
    try {
      await api.put("/password", { password_baru: newPassword });
      showAlert("success", "Password berhasil diubah");
      setShowPasswordModal(false);
    } catch (err) {
      showAlert("error", "Gagal mengubah password");
    } finally {
      setSaving(false);
    }
  };

  // --- Handlers Modal Orang Tua ---
  const handleOpenAddOrtu = () => {
    setIsEditingOrtu(false);
    setEditOrtuData(null);
    setEditId(null);
    setShowOrtuModal(true);
  };

  const handleEditOrtuClick = (ortu) => {
    setIsEditingOrtu(true);
    setEditId(ortu.id); // ID tabel relasi
    setEditOrtuData({
        nama: ortu.nama,
        hubungan: ortu.hubungan,
        no_hp: ortu.no_hp,
        id_user_wali: ortu.id_user_wali // ID user wali (utk referensi)
    });
    setShowOrtuModal(true);
  };

  const handleSubmitOrtu = async (formData, isManualInput) => {
    setSaving(true);
    try {
      if (isEditingOrtu) {
        await api.put(`/orangtua/${editId}`, formData);
        showAlert("success", "Data berhasil diperbarui");
      } else {
        await api.post("/orangtua", formData);
        showAlert("success", isManualInput 
            ? "Data berhasil ditambah! Akun wali baru telah dibuat." 
            : "Data berhasil ditautkan!"
        );
      }
      fetchProfile();
      setShowOrtuModal(false);
    } catch (err) {
      console.error(err);
      showAlert("error", err.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOrtu = async (id) => {
    if (window.confirm("Yakin hapus data ini?")) {
      try {
        await api.delete(`/orangtua/${id}`);
        fetchProfile();
        showAlert("success", "Data berhasil dihapus");
      } catch (err) {
        showAlert("error", "Gagal menghapus data");
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-blue-600" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-10 w-full overflow-x-hidden">
      
      {/* Toast Notification */}
      {message.text && (
        <div className={`fixed top-4 left-4 right-4 md:top-8 md:right-8 md:left-auto md:w-96 z-[9999] p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-5 fade-in duration-300 border-l-4 ${message.type === 'error' ? 'bg-white border-red-500 text-red-700' : 'bg-white border-green-500 text-green-700'}`}>
          <div className={`flex-shrink-0 p-2 rounded-full ${message.type === 'error' ? 'bg-red-100' : 'bg-green-100'}`}>
             {message.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
          </div>
          <p className="text-sm font-medium flex-1">{message.text}</p>
          <button onClick={() => setMessage({type:"", text:""})} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-500 text-white p-6 pb-24 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate("/santri")} className="flex-shrink-0 p-2 hover:bg-white/20 rounded-full transition"><ArrowLeft size={24} /></button>
          <div className="min-w-0"><h1 className="text-2xl font-bold truncate">Edit Profil</h1><p className="text-blue-100 text-sm truncate">Kelola informasi pribadi dan akun</p></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 -mt-16 space-y-6 relative z-10">
        
        {/* 1. Foto Profil */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 text-center">
          <h2 className="text-lg font-bold text-gray-800 mb-6 text-left">Foto Profil</h2>
          <div className="relative inline-block group">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-md mx-auto overflow-hidden">
              {fotoProfil ? <img src={fotoProfil} alt="Profil" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = ""; setFotoProfil(null); }} /> : <User size={64} className="text-blue-400" />}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handlePhotoUpload} />
            <button onClick={() => fileInputRef.current.click()} disabled={saving} className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow-sm transition border-2 border-white cursor-pointer">{saving ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}</button>
          </div>
          <p className="mt-4 text-sm text-gray-500">Unggah Foto Profil<br/><span className="text-xs">Format JPG/PNG, Maks 2MB</span></p>
        </div>

        {/* 2. Data Pondok */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Data Pondok</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-xs font-medium text-gray-500 mb-1">NIS</label><input type="text" value={dataPondok.nis || ''} readOnly className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed" /></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Kelas</label><input type="text" value={dataPondok.kelas || ''} readOnly className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed" /></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Kamar</label><input type="text" value={dataPondok.kamar || ''} readOnly className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed" /></div>
          </div>
        </div>

        {/* 3. Data Diri */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Data Diri</h2>
            <button type="button" onClick={() => setShowPasswordModal(true)} className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-lg transition flex items-center"><Lock size={16} className="mr-2" /> Ganti Kata Sandi</button>
          </div>
          <form onSubmit={handleUpdateDataDiri} className="space-y-4">
            {/* ... Inputs Data Diri (Sama seperti sebelumnya) ... */}
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label><input type="text" value={dataDiri.nama_lengkap || ''} onChange={(e) => setDataDiri({...dataDiri, nama_lengkap: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label><select value={dataDiri.jenis_kelamin || ''} onChange={(e) => setDataDiri({...dataDiri, jenis_kelamin: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"><option value="">Pilih...</option><option value="Laki_laki">Laki-laki</option><option value="Perempuan">Perempuan</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Tempat Lahir</label><input type="text" value={dataDiri.tempat_lahir || ''} onChange={(e) => setDataDiri({...dataDiri, tempat_lahir: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label><input type="date" value={dataDiri.tanggal_lahir || ''} onChange={(e) => setDataDiri({...dataDiri, tanggal_lahir: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={dataDiri.email || ''} onChange={(e) => setDataDiri({...dataDiri, email: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Nomor HP</label><input type="text" value={dataDiri.no_hp || ''} onChange={(e) => setDataDiri({...dataDiri, no_hp: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Alamat Tinggal</label><textarea rows="3" value={dataDiri.alamat || ''} onChange={(e) => setDataDiri({...dataDiri, alamat: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none" /></div>
            <div className="pt-2"><button type="submit" disabled={saving} className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition flex items-center justify-center disabled:bg-blue-300">{saving ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />} Simpan Data Diri</button></div>
          </form>
        </div>

        {/* 5. Manajemen Orang Tua */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
            <h2 className="text-lg font-bold text-gray-800">Data Orang Tua/Wali</h2>
            <button onClick={handleOpenAddOrtu} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg font-medium transition flex items-center w-full md:w-auto justify-center"><Plus size={16} className="mr-1" /> Tambah Data</button>
          </div>

          {/* Table & Cards (Display Only) */}
          <div className="block md:hidden space-y-4 w-full">
            {orangTua.map((ortu, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-3 w-full">
                <div className="flex justify-between items-start gap-2"><div className="min-w-0 flex-1"><h4 className="font-bold text-gray-800 break-words leading-tight">{ortu.nama}</h4><div className="mt-1"><span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full inline-block">{ortu.hubungan}</span></div></div></div>
                <div className="flex items-center text-sm text-gray-600 bg-white p-2 rounded-lg border border-gray-100 w-full"><span className="font-mono truncate w-full">{ortu.no_hp}</span></div>
                <div className="flex gap-2 pt-2 border-t border-gray-200 mt-1"><button onClick={() => handleEditOrtuClick(ortu)} className="flex-1 flex items-center justify-center py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"><Edit2 size={14} className="mr-1" /> Edit</button><button onClick={() => handleDeleteOrtu(ortu.id)} className="flex-1 flex items-center justify-center py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"><Trash2 size={14} className="mr-1" /> Hapus</button></div>
              </div>
            ))}
            {orangTua.length === 0 && <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300 w-full"><p className="text-gray-500 text-sm">Belum ada data orang tua</p></div>}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead><tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"><th className="p-3 rounded-tl-lg">Nama Wali</th><th className="p-3">Hubungan</th><th className="p-3">Nomor HP</th><th className="p-3 rounded-tr-lg text-right">Aksi</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {orangTua.map((ortu, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="p-3 text-sm font-medium text-gray-800">{ortu.nama}</td><td className="p-3 text-sm text-gray-600">{ortu.hubungan}</td><td className="p-3 text-sm text-gray-600">{ortu.no_hp}</td>
                    <td className="p-3 text-right space-x-2"><button onClick={() => handleEditOrtuClick(ortu)} className="text-blue-500 hover:text-blue-700 text-sm font-medium inline-flex items-center"><Edit2 size={14} className="mr-1" /> Edit</button><span className="text-gray-300">|</span><button onClick={() => handleDeleteOrtu(ortu.id)} className="text-red-500 hover:text-red-700 text-sm font-medium inline-flex items-center"><Trash2 size={14} className="mr-1" /> Hapus</button></td>
                  </tr>
                ))}
                {orangTua.length === 0 && <tr><td colSpan="4" className="p-4 text-center text-sm text-gray-500">Belum ada data orang tua</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* --- RENDER COMPONENTS MODAL --- */}
      
      <PasswordModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handleSubmitPassword}
        saving={saving}
      />

      <OrtuModal 
        isOpen={showOrtuModal}
        onClose={() => setShowOrtuModal(false)}
        api={api}
        isEditing={isEditingOrtu}
        editData={editOrtuData}
        onSubmit={handleSubmitOrtu}
        saving={saving}
      />

    </div>
  );
}