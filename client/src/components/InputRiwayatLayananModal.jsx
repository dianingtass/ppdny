import { useState, useEffect } from "react";
import { X, Loader2, Search } from "lucide-react";
import api from "../config/api";

export default function InputRiwayatLayananModal({ isOpen, onClose, onSubmit, isSaving, rolePrefix }) {
  const [santriList, setSantriList] = useState([]);
  const [layananList, setLayananList] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const [selectedSantri, setSelectedSantri] = useState("");
  const [selectedLayananId, setSelectedLayananId] = useState("");
  const [statusSesudah, setStatusSesudah] = useState("Menunggu");
  const [catatan, setCatatan] = useState("");
  const [dynamicInputs, setDynamicInputs] = useState({});

  // Hybrid search input states
  const [santriSearch, setSantriSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedSantri("");
      setSantriSearch("");
      setSelectedLayananId("");
      setStatusSesudah("Menunggu");
      setCatatan("");
      setDynamicInputs({});
      setShowDropdown(false);

      const fetchOptions = async () => {
        setLoadingOptions(true);
        try {
          const res = await api.get(`/${rolePrefix}/riwayat-layanan/options`);
          if (res.data.success) {
            setSantriList(res.data.data.santri || []);
            setLayananList(res.data.data.layanan || []);
          }
        } catch (err) {
          console.error("Gagal memuat opsi:", err);
        } finally {
          setLoadingOptions(false);
        }
      };
      fetchOptions();
    }
  }, [isOpen, rolePrefix]);

  const selectedLayanan = layananList.find(l => l.id === parseInt(selectedLayananId));
  const questions = selectedLayanan?.formulir_layanan || [];

  useEffect(() => {
    const initialInputs = {};
    questions.forEach(q => {
      initialInputs[q.label] = "";
    });
    setDynamicInputs(initialInputs);
  }, [selectedLayananId]);

  const handleInputChange = (label, val) => {
    setDynamicInputs(prev => ({
      ...prev,
      [label]: val
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSantri || !selectedLayananId) return;

    const form_data = questions.map(q => ({
      label: q.label,
      value: dynamicInputs[q.label] || ""
    }));

    onSubmit({
      id_santri: parseInt(selectedSantri),
      id_layanan: parseInt(selectedLayananId),
      status_sesudah: statusSesudah,
      catatan,
      form_data
    });
  };

  // Filter santri based on search term
  const filteredSantri = santriList.filter(s =>
    s.nama.toLowerCase().includes(santriSearch.toLowerCase()) ||
    s.nip.includes(santriSearch)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">

        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Input Layanan Baru</h2>
            <p className="text-xs text-gray-500 mt-1">Input pengajuan layanan manual secara langsung</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {loadingOptions ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="animate-spin text-green-500 mb-2" size={32} />
              <p className="text-sm text-gray-500">Memuat opsi data...</p>
            </div>
          ) : (
            <>
              {/* Santri Select (Hybrid Searchable Dropdown) */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Pilih Santri <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Ketik nama atau NIS santri..."
                    value={santriSearch}
                    onChange={(e) => {
                      setSantriSearch(e.target.value);
                      setShowDropdown(true);
                      if (!e.target.value) {
                        setSelectedSantri("");
                      }
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 0)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                  />
                  <Search className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                  {selectedSantri && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSantri("");
                        setSantriSearch("");
                      }}
                      className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Dropdown Options */}
                {showDropdown && (
                  <div className="absolute z-10 w-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {filteredSantri.length > 0 ? (
                      filteredSantri.map(s => (
                        <div
                          key={s.id}
                          onClick={() => {
                            setSelectedSantri(s.id);
                            setSantriSearch(`${s.nama} (${s.nip})`);
                            setShowDropdown(false);
                          }}
                          className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-green-50 transition flex items-center justify-between ${selectedSantri === s.id ? "bg-green-50 text-green-700 font-semibold" : "text-gray-700"
                            }`}
                        >
                          <span>{s.nama}</span>
                          <span className="text-xs text-gray-400">NIS: {s.nip}</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-400 text-center">Santri tidak ditemukan</div>
                    )}
                  </div>
                )}
              </div>

              {/* Layanan Select */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pilih Layanan <span className="text-red-500">*</span></label>
                <select
                  required
                  value={selectedLayananId}
                  onChange={(e) => setSelectedLayananId(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none bg-white cursor-pointer"
                >
                  <option value="">-- Pilih Layanan --</option>
                  {layananList.map(l => (
                    <option key={l.id} value={l.id}>{l.nama_layanan}</option>
                  ))}
                </select>
              </div>

              {/* Dynamic Questions Form */}
              {selectedLayananId && questions.length > 0 && (
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Formulir Layanan</h3>
                  {questions.map((q) => {
                    const isRequired = q.is_required;
                    return (
                      <div key={q.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          {q.label} {isRequired && <span className="text-red-500">*</span>}
                        </label>

                        {q.tipe_input === "Teks_Panjang" ? (
                          <textarea
                            required={isRequired}
                            placeholder={q.placeholder || ""}
                            value={dynamicInputs[q.label] || ""}
                            onChange={(e) => handleInputChange(q.label, e.target.value)}
                            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none bg-white min-h-[80px]"
                          />
                        ) : q.tipe_input === "Pilihan_Ganda" ? (
                          <select
                            required={isRequired}
                            value={dynamicInputs[q.label] || ""}
                            onChange={(e) => handleInputChange(q.label, e.target.value)}
                            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none bg-white cursor-pointer"
                          >
                            <option value="">-- Pilih Opsi --</option>
                            {(q.options ? JSON.parse(q.options) : []).map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={q.tipe_input === "Angka" ? "number" : q.tipe_input === "Tanggal" ? "date" : "text"}
                            required={isRequired}
                            placeholder={q.placeholder || ""}
                            value={dynamicInputs[q.label] || ""}
                            onChange={(e) => handleInputChange(q.label, e.target.value)}
                            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Status Select */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status Awal</label>
                <select
                  value={statusSesudah}
                  onChange={(e) => setStatusSesudah(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none bg-white cursor-pointer"
                >
                  <option value="Menunggu">Menunggu</option>
                  <option value="Proses">Proses</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>

              {/* Catatan / Keterangan tambahan */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Catatan Petugas <span className="text-gray-400 text-xs font-normal">(opsional)</span></label>
                <textarea
                  placeholder="Tambahkan catatan atau respon awal..."
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none bg-white min-h-[85px]"
                />
              </div>
            </>
          )}
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 active:scale-95 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSaving || !selectedSantri || !selectedLayananId}
            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold active:scale-95 transition flex items-center gap-2 shadow-lg hover:shadow-green-100 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin" size={16} /> Menyimpan...
              </>
            ) : (
              "Simpan Pengajuan"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
