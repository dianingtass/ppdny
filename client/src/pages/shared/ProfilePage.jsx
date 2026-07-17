import { useState, useEffect, useRef } from "react";
import api from "../../config/api";
import { 
  User, Save, Lock, Camera, Loader2, ArrowLeft 
} from "lucide-react";
import AlertToast from "../../components/AlertToast";
import { useAlert } from "../../hooks/useAlert";
import ProfileAvatar from '../../components/ProfileAvatar';
import PasswordModal from "../../components/PasswordModal";

export default function ProfilePage({ role }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const { message, showAlert, clearAlert } = useAlert();

  const [dataDiri, setDataDiri] = useState({
    nama_lengkap: "",
    jenis_kelamin: "",
    email: "",
    no_hp: "",
    alamat: "",
    foto_profil: null
  });
  const [dataKepegawaian, setDataKepegawaian] = useState({ nip: "-" });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (role) {
      fetchProfile();
    }
  }, [role]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/${role}/profile`);
      if (response.data.success) {
        const { data_diri, data_kepegawaian } = response.data.data;
        setDataDiri(data_diri || {});
        setDataKepegawaian(data_kepegawaian || { nip: "-" });
      }
    } catch (err) {
      console.error(err);
      showAlert("error", "Gagal memuat data profil");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/${role}/profile/update`, dataDiri);
      showAlert("success", "Data profil berhasil disimpan");
    } catch (err) {
      showAlert("error", "Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { 
      showAlert("error", "Ukuran file max. 2MB"); 
      return; 
    }

    const formData = new FormData();
    formData.append("foto", file);

    try {
      setSaving(true);
      const res = await api.post(`/${role}/profile/photo`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data.success) {
        setDataDiri(prev => ({ ...prev, foto_profil: res.data.data.url }));
        showAlert("success", "Foto profil berhasil diperbarui");
      }
    } catch (err) {
      showAlert("error", "Gagal upload foto");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (passwordBaru) => {
    setSavingPassword(true);
    try {
      await api.put(`/${role}/profile/password`, { password_baru: passwordBaru });
      showAlert("success", "Password berhasil diubah");
      setShowPasswordModal(false);
    } catch (err) {
      showAlert("error", "Gagal mengubah password");
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-green-600" />
      </div>
    );
  }

  const roleNameMap = {
    admin: "Admin",
    pengurus: "Pengurus",
    timkesehatan: "Tim Kesehatan",
    pimpinan: "Pimpinan"
  };
  const roleName = roleNameMap[role] || "Staff";

  return (
    <div className="w-full pb-10">
      <AlertToast message={message} onClose={clearAlert} />

      {/* Header Banner */}
      <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Profil {roleName}</h1>
          <p className="text-gray-500 text-sm">Kelola informasi pribadi dan keamanan akun Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Photo & Password */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-6 text-left">Foto Profil</h2>
          <div className="relative inline-block group">
            <ProfileAvatar
              fotoProfil={dataDiri.foto_profil}
              nama={dataDiri.nama_lengkap}
              className="w-28 h-28 md:w-32 md:h-32 border-4 border-white shadow-md mx-auto"
              iconSize={64}
            />
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/png, image/jpeg, image/jpg" 
              onChange={handlePhotoUpload} 
            />
            <button 
              onClick={() => fileInputRef.current.click()} 
              disabled={saving} 
              className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 shadow-sm transition border-2 border-white cursor-pointer"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-500">Unggah Foto Profil<br/><span className="text-xs">Format JPG/PNG, Maks 2MB</span></p>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <button 
              type="button" 
              onClick={() => setShowPasswordModal(true)} 
              className="w-full py-3 px-4 text-sm font-bold text-green-600 bg-green-50 hover:bg-green-100 rounded-xl transition flex items-center justify-center"
            >
              <Lock size={16} className="mr-2" /> Ganti Kata Sandi
            </button>
          </div>
        </div>

        {/* Right Column: Profile Data Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Informasi Pribadi</h2>
          
          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nomor Induk Pegawai (NIP)</label>
              <input 
                type="text" 
                value={dataKepegawaian.nip || "-"} 
                disabled 
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 font-medium cursor-not-allowed" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
              <input 
                type="text" 
                required
                value={dataDiri.nama_lengkap || ""} 
                onChange={(e) => setDataDiri({ ...dataDiri, nama_lengkap: e.target.value })} 
                className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Jenis Kelamin</label>
                <select 
                  value={dataDiri.jenis_kelamin || ""} 
                  onChange={(e) => setDataDiri({ ...dataDiri, jenis_kelamin: e.target.value })} 
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 bg-white transition"
                >
                  <option value="" disabled>Pilih...</option>
                  <option value="Laki_laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                <input 
                  type="email" 
                  required
                  value={dataDiri.email || ""} 
                  onChange={(e) => setDataDiri({ ...dataDiri, email: e.target.value })} 
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nomor Handphone (WhatsApp)</label>
              <input 
                type="text" 
                inputMode="numeric"
                required
                value={dataDiri.no_hp || ""} 
                onChange={(e) => setDataDiri({ ...dataDiri, no_hp: e.target.value.replace(/\D/g, "") })} 
                className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Alamat Tinggal</label>
              <textarea 
                rows="3" 
                required
                value={dataDiri.alamat || ""} 
                onChange={(e) => setDataDiri({ ...dataDiri, alamat: e.target.value })} 
                className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-none transition" 
              />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button 
                type="submit" 
                disabled={saving} 
                className="w-full md:w-auto px-8 py-3.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition flex items-center justify-center disabled:bg-green-300"
              >
                {saving ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />} Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>

      <PasswordModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)} 
        onSubmit={handleChangePassword} 
        saving={savingPassword} 
      />
    </div>
  );
}
