import { useState, useEffect } from "react";
import api from "../../config/api";
import { X, Loader2 } from "lucide-react";

export default function PendaftarManualModal({ isOpen, tahunList, onClose, onSuccess }) {
  const [step, setStep] = useState(0); 
  const [idTahun, setIdTahun] = useState("");
  const [dataDiri, setDataDiri] = useState({
    nama_lengkap: "", nama_panggilan: "", jenis_kelamin: "Laki-laki",
    tempat_lahir: "", tanggal_lahir: "", anak_ke: "", jumlah_saudara: "",
    alamat: "", no_hp: "", email: "",
    asal_sekolah: "", jurusan_asal: "", tahun_lulus: "", nilai_rata_rapor: "",
    kemampuan_quran: "", juz_hafalan: "0",
  });
  const [orangtua, setOrangtua] = useState([{ hubungan: "Ayah", nama: "", pekerjaan: "", penghasilan: "", no_hp: "", pendidikan: "", alamat: "" }]);
  const [loading, setLoading] = useState(false);

  // Sync idTahun ke gelombang aktif/terbaru setiap kali modal dibuka atau list berubah
  useEffect(() => {
    if (isOpen && tahunList.length > 0) {
      // Prioritaskan gelombang yang sedang aktif (dalam rentang buka-tutup), fallback ke tahunList[0]
      const now = new Date();
      const aktif = tahunList.find(t => {
        const buka = t.tanggal_buka ? new Date(t.tanggal_buka) : null;
        const tutup = t.tanggal_tutup ? new Date(t.tanggal_tutup) : null;
        return buka && tutup && now >= buka && now <= tutup;
      });
      setIdTahun(aktif?.id || tahunList[0]?.id || "");
    }
  }, [isOpen, tahunList]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await api.post("/ppdb/admin/pendaftar", { id_tahun: idTahun, ...dataDiri, orangtua });
      onSuccess("Pendaftar berhasil ditambahkan manual");
    } catch (err) {
      alert("Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition";
  const labelCls = "block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <div onClick={onClose} className="fixed cursor-pointer inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div onClick={(e) => e.stopPropagation()} className="cursor-default bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto [scrollbar-width:none]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="font-bold text-gray-800 text-lg">Input Manual Pendaftar</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition"><X size={20} /></button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className={labelCls}>Gelombang / Tahun Ajaran *</label>
            <select value={idTahun} onChange={(e) => setIdTahun(e.target.value)} className={`${inputCls} font-bold text-green-700 bg-green-50 border-green-200`}>
              {tahunList.map((t) => <option key={t.id} value={t.id}>{t.nama_gelombang}</option>)}
            </select>
          </div>

          <div className="flex gap-2 mb-6 border-b border-gray-100 pb-4">
            {["Data Calon Santri", "Data Wali"].map((tab, i) => (
              <button key={i} onClick={() => setStep(i)} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${step === i ? "bg-green-600 text-white shadow-md shadow-green-100" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                {tab}
              </button>
            ))}
          </div>

          {step === 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><label className={labelCls}>Nama Lengkap *</label><input value={dataDiri.nama_lengkap} onChange={e => setDataDiri({...dataDiri, nama_lengkap: e.target.value})} className={inputCls} /></div>
              <div><label className={labelCls}>L/P</label><select value={dataDiri.jenis_kelamin} onChange={e => setDataDiri({...dataDiri, jenis_kelamin: e.target.value})} className={inputCls}><option>Laki-laki</option><option>Perempuan</option></select></div>
              <div><label className={labelCls}>Tanggal Lahir *</label><input type="date" value={dataDiri.tanggal_lahir} onChange={e => setDataDiri({...dataDiri, tanggal_lahir: e.target.value})} className={inputCls} /></div>
              <div className="col-span-2"><label className={labelCls}>Tempat Lahir</label><input value={dataDiri.tempat_lahir} onChange={e => setDataDiri({...dataDiri, tempat_lahir: e.target.value})} className={inputCls} /></div>
              <div><label className={labelCls}>Anak Ke</label><input type="number" value={dataDiri.anak_ke} onChange={e => setDataDiri({...dataDiri, anak_ke: e.target.value})} className={inputCls} /></div>
              <div><label className={labelCls}>Dari (Jumlah Saudara)</label><input type="number" value={dataDiri.jumlah_saudara} onChange={e => setDataDiri({...dataDiri, jumlah_saudara: e.target.value})} className={inputCls} /></div>
              <div className="col-span-2"><label className={labelCls}>Alamat</label><textarea value={dataDiri.alamat} onChange={e => setDataDiri({...dataDiri, alamat: e.target.value})} rows={2} className={`${inputCls} resize-none`} /></div>
              <div><label className={labelCls}>No. HP / WA</label><input value={dataDiri.no_hp} onChange={e => setDataDiri({...dataDiri, no_hp: e.target.value})} className={inputCls} /></div>
              <div><label className={labelCls}>Asal Sekolah</label><input value={dataDiri.asal_sekolah} onChange={e => setDataDiri({...dataDiri, asal_sekolah: e.target.value})} className={inputCls} /></div>
              <div><label className={labelCls}>Jurusan Asal</label><input value={dataDiri.jurusan_asal} onChange={e => setDataDiri({...dataDiri, jurusan_asal: e.target.value})} className={inputCls} /></div>
              <div><label className={labelCls}>Tahun Lulus</label><input value={dataDiri.tahun_lulus} onChange={e => setDataDiri({...dataDiri, tahun_lulus: e.target.value})} className={inputCls} /></div>
              <div className="col-span-2"><label className={labelCls}>Nilai Rata-rata Rapor</label><input type="number" step="0.01" value={dataDiri.nilai_rata_rapor} onChange={e => setDataDiri({...dataDiri, nilai_rata_rapor: e.target.value})} className={inputCls} /></div>
              <div>
                <label className={labelCls}>Kemampuan Al-Quran</label>
                <select value={dataDiri.kemampuan_quran} onChange={e => setDataDiri({...dataDiri, kemampuan_quran: e.target.value})} className={inputCls}>
                  <option value="">Pilih</option>
                  <option value="Belum_Bisa">Belum Bisa</option>
                  <option value="Iqro">Iqro</option>
                  <option value="Juz_Amma">Juz Amma</option>
                  <option value="Al_Quran">Al Quran</option>
                  <option value="Hafidz">Hafidz</option>
                </select>
              </div>
              <div><label className={labelCls}>Juz Hafalan</label><input type="number" value={dataDiri.juz_hafalan} onChange={e => setDataDiri({...dataDiri, juz_hafalan: e.target.value})} className={inputCls} /></div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              {orangtua.map((ortu, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                  <div className="flex items-center justify-between mb-4">
                    <select
                      value={ortu.hubungan}
                      onChange={(e) => { const u = [...orangtua]; u[idx].hubungan = e.target.value; setOrangtua(u); }}
                      className="font-bold text-sm text-green-700 bg-green-100 border-none px-3 py-1.5 rounded-lg outline-none"
                    >
                      <option>Ayah</option><option>Ibu</option><option>Wali</option>
                    </select>
                    {orangtua.length > 1 && (
                      <button
                        onClick={() => setOrangtua(orangtua.filter((_, i) => i !== idx))}
                        className="text-xs text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg font-bold transition"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className={labelCls}>Nama Lengkap *</label>
                      <input value={ortu.nama} onChange={e => {const u=[...orangtua]; u[idx].nama=e.target.value; setOrangtua(u)}} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Tempat Lahir</label>
                      <input value={ortu.tempat_lahir || ""} onChange={e => {const u=[...orangtua]; u[idx].tempat_lahir=e.target.value; setOrangtua(u)}} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Tanggal Lahir</label>
                      <input type="date" value={ortu.tanggal_lahir || ""} onChange={e => {const u=[...orangtua]; u[idx].tanggal_lahir=e.target.value; setOrangtua(u)}} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>No. HP / WA</label>
                      <input value={ortu.no_hp} onChange={e => {const u=[...orangtua]; u[idx].no_hp=e.target.value; setOrangtua(u)}} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Pendidikan</label>
                      <input value={ortu.pendidikan || ""} onChange={e => {const u=[...orangtua]; u[idx].pendidikan=e.target.value; setOrangtua(u)}} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Pekerjaan</label>
                      <input value={ortu.pekerjaan || ""} onChange={e => {const u=[...orangtua]; u[idx].pekerjaan=e.target.value; setOrangtua(u)}} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Penghasilan</label>
                      <input
                        inputMode="numeric"
                        value={ortu.penghasilan ? parseInt(String(ortu.penghasilan).replace(/\./g, ""), 10).toLocaleString("id-ID") : ""}
                        onChange={e => {
                          const raw = e.target.value.replace(/\./g, "").replace(/\D/g, "");
                          const u = [...orangtua]; u[idx].penghasilan = raw; setOrangtua(u);
                        }}
                        className={inputCls}
                        placeholder="cth: 3.000.000"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className={labelCls}>Alamat</label>
                      <textarea value={ortu.alamat || ""} onChange={e => {const u=[...orangtua]; u[idx].alamat=e.target.value; setOrangtua(u)}} rows={2} className={`${inputCls} resize-none`} />
                    </div>
                  </div>
                </div>
              ))}
              {orangtua.length < 3 && (
                <button
                  onClick={() => setOrangtua([...orangtua, { hubungan: "Ibu", nama: "", tempat_lahir: "", tanggal_lahir: "", no_hp: "", pendidikan: "", pekerjaan: "", penghasilan: "", alamat: "" }])}
                  className="w-full py-2.5 border-2 border-dashed border-green-200 text-green-600 font-bold text-sm rounded-xl hover:bg-green-50 transition"
                >
                  + Tambah Wali Lainnya
                </button>
              )}
            </div>
          )}

        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 sticky bottom-0">
          <button onClick={onClose} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-100 transition">Batal</button>
          {step === 0 ? (
            <button disabled={!dataDiri.nama_lengkap || !dataDiri.tanggal_lahir} onClick={() => setStep(1)} className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition disabled:opacity-50">Lanjut</button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition flex items-center gap-2">
              {loading && <Loader2 size={16} className="animate-spin"/>} Simpan Data
            </button>
          )}
        </div>
      </div>
    </div>
  );
}