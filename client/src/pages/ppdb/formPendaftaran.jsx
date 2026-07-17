import React, { useState, useEffect } from "react";
import api from "../../config/api"; 
import { Link } from "react-router-dom";
import { CheckCircle, UploadCloud, ChevronRight, ChevronDown, Check, FileText, Loader2, ArrowLeft, Plus, X, Copy } from "lucide-react";

// IMPORT FUNGSI CETAK PDF DARI FILE UTILS
import { cetakBuktiPendaftaran } from "../../components/ppdb/CetakBuktiPpdb"; 

const STEPS = ["Pilih Gelombang", "Data Diri", "Data Wali", "Upload Dokumen", "Selesai"];

const initialOrangTua = {
  hubungan: "Ayah", nama: "", tempat_lahir: "", tanggal_lahir: "",
  pendidikan: "", pekerjaan: "", penghasilan: "", no_hp: "", alamat: "",
};

export default function FormPendaftaran() {
  const [step, setStep] = useState(0);
  const [gelombangList, setGelombangList] = useState([]);
  const [selectedGelombang, setSelectedGelombang] = useState(null);
  const [loadingGelombang, setLoadingGelombang] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); 

  const [dataDiri, setDataDiri] = useState({
    nama_lengkap: "", nama_panggilan: "", jenis_kelamin: "Laki_laki",
    tempat_lahir: "", tanggal_lahir: "", anak_ke: "", jumlah_saudara: "",
    alamat: "", no_hp: "", email: "",
    asal_sekolah: "", jurusan_asal: "", tahun_lulus: "", nilai_rata_rapor: "",
    kemampuan_quran: "", juz_hafalan: "0",
  });

  const [orangtua, setOrangtua] = useState([{ ...initialOrangTua }]);
  const [uploadStatus, setUploadStatus] = useState({});
  const [noPendaftaran, setNoPendaftaran] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [copiedRek, setCopiedRek] = useState(false);

  const handleCopyRek = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedRek(true);
      setTimeout(() => setCopiedRek(false), 2000);
    });
  };

  useEffect(() => {
    api.get("/ppdb/public/gelombang")
      .then((r) => setGelombangList(r.data.data))
      .catch(console.error)
      .finally(() => setLoadingGelombang(false));
  }, []);

  const handleDataDiriChange = (e) => setDataDiri((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleOrangtuaChange = (idx, e) => {
    const updated = [...orangtua];
    updated[idx][e.target.name] = e.target.value;
    setOrangtua(updated);
  };

  const addOrangtua = () => {
    if (orangtua.length >= 3) return;
    const hub = ["Ayah", "Ibu", "Wali"].find((h) => !orangtua.find((o) => o.hubungan === h));
    setOrangtua([...orangtua, { ...initialOrangTua, hubungan: hub || "Wali" }]);
  };

  const removeOrangtua = (idx) => {
    if (orangtua.length <= 1) return;
    setOrangtua(orangtua.filter((_, i) => i !== idx));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(dateString));
  };

  const handleSubmitPendaftaran = async () => {
    setErrorMsg("");
    try {
      setSubmitting(true);
      const res = await api.post("/ppdb/public/daftar", {
        id_tahun: selectedGelombang.id,
        ...dataDiri,
        orangtua: JSON.stringify(orangtua),
      });
      setNoPendaftaran(res.data.data.no_pendaftaran);
      setResult(res.data.data);
      setStep(3); 
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Gagal submit pendaftaran");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadDokumen = async (jenis, file) => {
    if (!noPendaftaran) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("jenis_dokumen", jenis);
    setUploadStatus((prev) => ({ ...prev, [jenis]: "uploading" }));
    try {
      await api.post(`/ppdb/public/dokumen/${noPendaftaran}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadStatus((prev) => ({ ...prev, [jenis]: "success" }));
    } catch (err) {
      setUploadStatus((prev) => ({ ...prev, [jenis]: "error" }));
    }
  };

  // PANGGILAN KE HELPER PDF EKSTERNAL
  const handleDownloadPdf = async () => {
    setIsPdfLoading(true);
    try {
      await cetakBuktiPendaftaran({
        noPendaftaran: noPendaftaran,
        namaLengkap: dataDiri.nama_lengkap,
        namaGelombang: selectedGelombang.nama_gelombang,
        tahunAjaran: selectedGelombang.tahun_ajaran
      });
    } catch (error) {
      setErrorMsg("Gagal memuat dokumen PDF. Silakan coba lagi.");
    } finally {
      setIsPdfLoading(false);
    }
  };

  const progressWidth = `${((step + 1) / STEPS.length) * 100}%`;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="bg-white shadow-sm border-b border-gray-100 px-6 py-4">
        <div className="mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12">
              <img src="/logo.png" alt="PPDNY" />
             </div>
             <div>
               <h1 className="text-lg font-bold text-gray-800 leading-tight">Form Pendaftaran</h1>
               <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider">PPDB SIM-TREN</p>
             </div>
          </div>
          {/* Di header kanan cukup Cek Status saja */}
          <Link to="/ppdb/cek-status" className="text-sm text-green-600 hover:text-green-700 font-bold bg-green-100 hover:bg-green-200 px-4 py-2 rounded-lg transition">
            Cek Status
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Tombol Kembali ke Beranda */}
        {step === 0 && (
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm group-hover:border-green-200 group-hover:bg-green-50 group-hover:-translate-x-1 transition-all duration-300">
                <ArrowLeft size={16} className="text-gray-700 group-hover:text-green-600 transition-colors" />
              </div>
              <span className="text-sm font-bold text-gray-700 group-hover:text-green-600 transition-colors">
                Kembali ke Beranda
              </span>
            </Link>
          </div>
        )}
        
        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {STEPS.map((s, i) => (
              <div key={i} className="flex flex-col items-center flex-1 relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                  i < step ? "bg-green-500 text-white ring-4 ring-gray-50" :
                  i === step ? "bg-green-600 text-white ring-4 ring-gray-50" :
                  "bg-white border border-gray-200 text-gray-400"
                }`}>
                  {i < step ? <Check size={14}/> : i + 1}
                </div>
                <p className={`text-[10px] uppercase tracking-wider font-bold mt-2 text-center hidden sm:block ${i === step ? "text-green-600" : "text-gray-400"}`}>
                  {s}
                </p>
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full mt-1 relative -z-0 -top-7.5 mx-4">
            <div className="h-1.5 bg-green-500 rounded-full transition-all duration-500" style={{ width: progressWidth }} />
          </div>
        </div>

        {errorMsg && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium text-center">
                {errorMsg}
            </div>
        )}

        {/* Step 0 */}
        {step === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Pilih Gelombang Pendaftaran</h2>
            <p className="text-sm text-gray-500 mb-6">Pilih gelombang akademik yang masih aktif.</p>
            {loadingGelombang ? (
              <div className="space-y-3">
                {[1, 2].map((i) => <div key={i} className="h-24 bg-gray-50 border border-gray-100 rounded-xl animate-pulse" />)}
              </div>
            ) : gelombangList.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">Belum ada gelombang pendaftaran yang dibuka</p>
              </div>
            ) : (
              <div className="space-y-3">
                {gelombangList.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGelombang(g)}
                    className={`w-full text-left p-5 border-2 rounded-xl transition-all ${
                      selectedGelombang?.id === g.id
                        ? "border-green-500 bg-green-50/50"
                        : "border-gray-100 hover:border-green-200 bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-800 text-lg">{g.nama_gelombang}</p>
                        <p className="text-sm font-medium text-gray-500 mt-1">Tahun Ajaran {g.tahun_ajaran}</p>
                        {g.kuota && <p className="text-sm font-medium text-gray-500 mt-1 md:hidden">Kuota: <span className="text-green-600">{g.sisa_kuota}</span></p>}
                        <p className="text-xs font-bold text-green-600 mt-2 bg-green-100 inline-block px-2.5 py-1 rounded-md">
                          {formatDate(g.tanggal_buka)} — {formatDate(g.tanggal_tutup)}
                        </p>
                      </div>
                      <div className="text-right">
                        {g.kuota && <p className="text-sm font-bold text-gray-700 hidden md:block">Kuota: <span className="text-green-600">{g.sisa_kuota}</span></p>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <div className="mt-8 flex justify-end">
              <button disabled={!selectedGelombang} onClick={() => setStep(1)} className="pl-6 pr-5 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition disabled:opacity-40 flex items-center gap-2">
                Lanjut <ChevronRight size={16}/>
              </button>
            </div>
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Data Diri Calon Santri</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Nama Lengkap <span className="text-red-500">*</span></label>
                <input name="nama_lengkap" value={dataDiri.nama_lengkap} onChange={handleDataDiriChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Jenis Kelamin</label>
                <select name="jenis_kelamin" value={dataDiri.jenis_kelamin} onChange={handleDataDiriChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="Laki_laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div><label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Tempat Lahir *</label><input name="tempat_lahir" value={dataDiri.tempat_lahir} onChange={handleDataDiriChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500"/></div>
              <div><label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Tanggal Lahir *</label><input type="date" name="tanggal_lahir" value={dataDiri.tanggal_lahir} onChange={handleDataDiriChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500"/></div>
              <div><label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Anak Ke</label><input type="number" name="anak_ke" value={dataDiri.anak_ke} onChange={handleDataDiriChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500"/></div>
              <div><label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Dari (Jumlah Saudara)</label><input type="number" name="jumlah_saudara" value={dataDiri.jumlah_saudara} onChange={handleDataDiriChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500"/></div>
              <div className="sm:col-span-2"><label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Alamat Lengkap *</label><textarea name="alamat" value={dataDiri.alamat} onChange={handleDataDiriChange} rows={2} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"/></div>
              <div><label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">No. HP / WA</label><input name="no_hp" value={dataDiri.no_hp} onChange={handleDataDiriChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500"/></div>
              
              <div className="sm:col-span-2 border-t border-gray-100 pt-5 mt-2"><p className="text-sm font-bold text-green-700 bg-green-50 inline-block px-4 py-2 rounded-lg">Riwayat Pendidikan</p></div>
              <div><label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Asal Sekolah</label><input name="asal_sekolah" value={dataDiri.asal_sekolah} onChange={handleDataDiriChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500"/></div>
              <div><label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Jurusan Asal</label><input name="jurusan_asal" value={dataDiri.jurusan_asal} onChange={handleDataDiriChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500"/></div>
              <div><label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Tahun Lulus</label><input name="tahun_lulus" value={dataDiri.tahun_lulus} onChange={handleDataDiriChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500"/></div>
              <div><label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Nilai Rata-rata Rapor</label><input type="number" step="0.01" name="nilai_rata_rapor" value={dataDiri.nilai_rata_rapor} onChange={handleDataDiriChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500"/></div>
              <div className="sm:col-span-2 border-t border-gray-100 pt-5 mt-2"><p className="text-sm font-bold text-green-700 bg-green-50 inline-block px-4 py-2 rounded-lg">Kemampuan Agama</p></div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Kemampuan Al-Quran</label>
                <select name="kemampuan_quran" value={dataDiri.kemampuan_quran} onChange={handleDataDiriChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Pilih</option>
                  <option value="Belum_Bisa">Belum Bisa</option>
                  <option value="Iqro">Iqro</option>
                  <option value="Juz_Amma">Juz Amma</option>
                  <option value="Al_Quran">Al Quran</option>
                  <option value="Hafidz">Hafidz</option>
                </select>
              </div>
              <div><label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Juz Hafalan</label><input type="number" name="juz_hafalan" value={dataDiri.juz_hafalan} onChange={handleDataDiriChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500"/></div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
              <button onClick={() => setStep(0)} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition">Kembali</button>
              <button disabled={!dataDiri.nama_lengkap || !dataDiri.tanggal_lahir || !dataDiri.alamat} onClick={() => setStep(2)} className="pl-6 pr-5 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition disabled:opacity-40 flex items-center gap-2">Lanjut <ChevronRight size={16}/></button>
            </div>
          </div>
        )}

        {/* Step 2 - Wali */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Data Wali Santri</h2>
            <div className="space-y-6">
              {orangtua.map((ortu, idx) => (
                <div key={idx} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 relative">
                  <div className="flex justify-between items-center mb-4">
                    <select value={ortu.hubungan} onChange={(e) => handleOrangtuaChange(idx, { target: { name: "hubungan", value: e.target.value } })} className="font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-lg text-sm border-none focus:outline-none">
                      <option>Ayah</option><option>Ibu</option><option>Wali</option>
                    </select>
                    {orangtua.length > 1 && <button onClick={() => removeOrangtua(idx)} className="text-red-500 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition"><X size={16}/></button>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nama Lengkap *</label><input name="nama" value={ortu.nama} onChange={(e) => handleOrangtuaChange(idx, e)} className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"/></div>
                    <div><label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">No HP / WA *</label><input name="no_hp" value={ortu.no_hp} onChange={(e) => handleOrangtuaChange(idx, e)} className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"/></div>
                    <div><label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Pekerjaan</label><input name="pekerjaan" value={ortu.pekerjaan} onChange={(e) => handleOrangtuaChange(idx, e)} className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"/></div>
                    <div><label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Penghasilan</label><input inputMode="numeric" value={ortu.penghasilan ? parseInt(String(ortu.penghasilan).replace(/\./g, ""), 10).toLocaleString("id-ID") : ""} onChange={(e) => { const raw = e.target.value.replace(/\./g, "").replace(/\D/g, ""); const updated = [...orangtua]; updated[idx]["penghasilan"] = raw; setOrangtua(updated); }} className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" placeholder="cth: 3.000.000"/></div>
                  </div>
                </div>
              ))}
            </div>
            {orangtua.length < 3 && (
              <button onClick={addOrangtua} className="mt-5 w-full py-3 border-2 border-dashed border-green-200 text-green-600 font-bold rounded-xl hover:bg-green-50 transition flex items-center justify-center gap-2">
                <Plus size={18}/> Tambah Wali Lainnya
              </button>
            )}
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
              <button onClick={() => setStep(1)} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition">Kembali</button>
              <button disabled={submitting || !orangtua[0].nama} onClick={handleSubmitPendaftaran} className="pl-6 pr-5 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition disabled:opacity-40 flex items-center gap-2">
                {submitting ? "Menyimpan..." : "Simpan & Lanjut"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3 - Upload */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-8 text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2"><CheckCircle size={24}/></div>
              <p className="text-sm font-bold text-green-800">Pendaftaran Tahap 1 Berhasil!</p>
              <p className="text-xs text-green-600 mt-1">Nomor Pendaftaran:</p>
              <p className="text-2xl font-black font-mono text-green-700 tracking-widest mt-1">{noPendaftaran}</p>
            </div>

            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-800">Pembayaran</h2>
              <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-md uppercase tracking-wider">● Wajib</span>
            </div>
            <p className="text-sm text-gray-500 mb-3">Silakan transfer ke rekening berikut, lalu upload bukti transfernya.</p>
            <div className="bg-white border border-green-200 rounded-xl p-4 mb-5 flex flex-col gap-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Rekening Tujuan Transfer</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500">Bank ABC</p>
                  <button
                    onClick={() => handleCopyRek("XXXXXXXXXXXX")}
                    className="flex items-center gap-2 group mt-0.5"
                    title="Klik untuk menyalin nomor rekening"
                  >
                    <p className="text-lg font-black text-gray-800 tracking-widest font-mono group-hover:text-green-600 transition">XXXX XXXX XXX</p>
                    {copiedRek
                      ? <Check size={15} className="text-green-500 shrink-0" />
                      : <Copy size={14} className="text-gray-400 group-hover:text-green-500 transition shrink-0" />}
                  </button>
                  {copiedRek && <p className="text-[10px] text-green-500 font-bold mt-0.5">Tersalin!</p>}
                  <p className="text-xs font-semibold text-gray-600 mt-0.5">a.n. Pondok Pesantren Darunna'im Yapia</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-green-600 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M2 10h20v2H2zm0 4h20v2H2zM12 2L2 7h20L12 2zm0 18l-4-3H6l6 3 6-3h-2l-4 3z"/></svg>
                </div>
              </div>
            </div>
            <div className="space-y-4 mb-8">
              {[{ key: "Bukti_Transfer_Pendaftaran", label: `Bukti Transfer (Rp ${selectedGelombang?.biaya_pendaftaran?.toLocaleString('id-ID') || 0})` }].map((doc) => (
                <div key={doc.key} className="border border-green-200 bg-green-50/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="font-bold text-sm text-gray-800">{doc.label}</p>
                  {uploadStatus[doc.key] === "success" ? (
                      <span className="text-green-600 bg-green-100 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 sm:shrink-0"><Check size={14}/> Sukses</span>
                  ) : (
                    <label className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold cursor-pointer transition shadow-sm sm:shrink-0">
                        <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={(e) => e.target.files[0] && handleUploadDokumen(doc.key, e.target.files[0])} />
                        <UploadCloud size={14}/> Upload Bukti
                    </label>
                  )}
                </div>
              ))}
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-1">Upload Dokumen (Opsional)</h2>
            <p className="text-sm text-gray-500 mb-4">Maks. 2MB. Bisa dilewati dan dilengkapi nanti.</p>
            <div className="space-y-4">
              {[{ key: "Foto_3x4", label: "Foto 3×4" }, { key: "Akta_Kelahiran", label: "KK / Akta" }, { key: "Ijazah", label: "Ijazah / SKL" }].map((doc) => (
                <div key={doc.key} className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="font-bold text-sm text-gray-700">{doc.label}</p>
                  {uploadStatus[doc.key] === "success" ? (
                      <span className="text-green-600 bg-green-50 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 sm:shrink-0"><Check size={14}/> Sukses</span>
                  ) : (
                    <label className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold cursor-pointer transition sm:shrink-0">
                        <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={(e) => e.target.files[0] && handleUploadDokumen(doc.key, e.target.files[0])} />
                        <UploadCloud size={14}/> Upload
                    </label>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col items-end gap-2">
              {uploadStatus["Bukti_Transfer_Pendaftaran"] !== "success" && (
                <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                  <span>⚠</span> Upload bukti transfer terlebih dahulu untuk melanjutkan
                </p>
              )}
              <button 
                disabled={uploadStatus["Bukti_Transfer_Pendaftaran"] !== "success"} 
                onClick={() => setStep(4)} 
                className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition disabled:opacity-40"
              >
                Selesai Berkas →
              </button>
            </div>
          </div>
        )}

        {/* Step 4 - Selesai & Panggil Fungsi Cetak */}
        {step === 4 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5"><CheckCircle size={40}/></div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">Selesai!</h2>
            <p className="text-gray-500 text-sm mb-8">Terima kasih, <strong>{result?.nama_lengkap}</strong>. Silakan simpan nomor pendaftaran Anda dan pantau terus statusnya.</p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={`/ppdb/cek-status?no=${noPendaftaran}`} className="inline-block px-6 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition shadow-lg shadow-green-100">
                Lihat Status Saya
              </a>
              <button 
                onClick={handleDownloadPdf} 
                disabled={isPdfLoading} 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition"
              >
                {isPdfLoading ? <Loader2 size={18} className="animate-spin"/> : <FileText size={18}/>} 
                Cetak Bukti Daftar (PDF)
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}