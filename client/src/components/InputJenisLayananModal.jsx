import React, { useState } from "react";
import { X, Save, Loader2, List, FileText, CreditCard, Plus, Trash2 } from "lucide-react";
import AlertToast from "../components/AlertToast";
import { useAlert } from "../hooks/useAlert";

export default function InputJenisLayananModal({ isOpen, onClose, isEditing, editData, onSubmit, saving }) {
  const { message, showAlert, clearAlert } = useAlert();

  const [formData, setFormData] = useState(() => ({
    nama_layanan: (isEditing && editData?.nama_layanan) || "",
    estimasi: (isEditing && editData?.estimasi) || "",
    deskripsi: (isEditing && editData?.deskripsi) || ""
  }));

  const [fields, setFields] = useState(() => (
    (isEditing && editData?.formulir_layanan) || [
      { name: "deskripsi", label: "Keterangan / Keperluan", type: "textarea", placeholder: "Jelaskan keperluan Anda...", required: true }
    ]
  ));

  if (!isOpen) return null;

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddField = () => {
    setFields(prev => [...prev, { name: "", label: "", type: "text", placeholder: "", required: true }]);
  };

  const handleFieldChange = (index, key, value) => {
    setFields(prev => prev.map((f, idx) => idx === index ? { ...f, [key]: value } : f));
  };

  const handleRemoveField = (index) => {
    setFields(prev => prev.filter((_, idx) => idx !== index));
  };

  const slugify = (text, index) => {
    const slug = (text || "").toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "");
    return slug || `field_${index}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama_layanan || !formData.estimasi) {
      return showAlert("error", "Nama layanan dan estimasi wajib diisi");
    }

    // Validasi input fields dinamis
    for (let i = 0; i < fields.length; i++) {
      if (!fields[i].label.trim()) {
        return showAlert("error", `Nama pertanyaan ke-${i + 1} wajib diisi`);
      }
    }

    // Map fields and generate clean unique names
    const mappedFields = fields.map((f, idx) => ({
      name: f.name || slugify(f.label, idx),
      label: f.label.trim(),
      type: f.type,
      placeholder: f.placeholder || "",
      required: !!f.required
    }));

    onSubmit({
      ...formData,
      formulir: mappedFields
    });
  };

  return (
    <div onClick={onClose} className="fixed cursor-pointer inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div onClick={(e) => e.stopPropagation()} className="cursor-default bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <AlertToast message={message} onClose={clearAlert} />
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
          <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            <List className="text-green-600" size={20} />
            {isEditing ? "Edit Jenis Layanan" : "Tambah Layanan Baru"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh] [scrollbar-width:none]">
          <form id="layananForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Layanan</label>
                  <div className="relative">
                      <input 
                          type="text" name="nama_layanan" required
                          className="w-full pl-9 p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm"
                          value={formData.nama_layanan} onChange={handleChange}
                          placeholder="Contoh: Izin Bermalam"
                      />
                      <List className="absolute left-3 top-3.5 text-gray-400" size={16} />
                  </div>
              </div>

              <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Estimasi Waktu Pengerjaan (Hari)</label>
                  <div className="relative">
                      <input 
                          type="text"
                          name="estimasi" 
                          required
                          className="w-full pl-9 pr-12 p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm"
                          value={formData.estimasi} 
                          onChange={handleChange}
                          placeholder="Contoh: 1"
                      />
                      <CreditCard className="absolute left-3 top-3.5 text-gray-400" size={16} />
                      <span className="absolute right-4 top-2.5 text-gray-500 text-sm font-medium pointer-events-none">
                          Hari
                      </span>
                  </div>
              </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi</label>
                <div className="relative">
                    <textarea 
                        name="deskripsi" rows="3"
                        className="w-full pl-9 p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-none text-sm"
                        value={formData.deskripsi} onChange={handleChange}
                        placeholder="Keterangan tambahan..."
                    />
                    <FileText className="absolute left-3 top-3 text-gray-400" size={16} />
                </div>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700">Formulir Pertanyaan</label>
                  <p className="text-xs text-gray-400">Susun input isian yang harus diisi santri saat mengajukan layanan ini</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddField}
                  className="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                >
                  <Plus size={14} /> Tambah Pertanyaan
                </button>
              </div>

              <div className="space-y-3">
                {fields.length > 0 && (
                  <div className="hidden sm:grid sm:grid-cols-2 text-xs font-bold text-gray-400 uppercase tracking-wider pr-28">
                    <div className="pl-4">Pertanyaan</div>
                    <div>Jenis Jawaban</div>
                  </div>
                )}

                {fields.length > 0 ? (
                  <div className="space-y-3 sm:space-y-0 sm:bg-gray-50 sm:rounded-2xl sm:border sm:border-gray-200 sm:divide-y sm:divide-gray-100 overflow-hidden">
                    {fields.map((field, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row gap-3 bg-gray-50 sm:bg-transparent p-4 sm:p-3.5 rounded-xl sm:rounded-none border border-gray-200 sm:border-0 relative group sm:items-center">
                        {/* Header bar for Mobile Card view */}
                        <div className="flex justify-between items-center sm:hidden border-b border-gray-300 pb-2 mb-1">
                          <span className="text-xs font-bold text-green-600">Pertanyaan #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveField(idx)}
                            className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-2">
                          <div>
                            <label className="block sm:hidden text-[10px] font-bold text-gray-400 uppercase mb-1">Pertanyaan</label>
                            <input
                              type="text"
                              placeholder="Pertanyaan (misal: Rencana Pergi)"
                              className="w-full p-2 text-xs border border-gray-200 rounded-lg outline-none bg-white focus:ring-1 focus:ring-green-500"
                              value={field.label}
                              onChange={(e) => handleFieldChange(idx, "label", e.target.value)}
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block sm:hidden text-[10px] font-bold text-gray-400 uppercase mb-1">Jenis Jawaban</label>
                            <select
                              className="w-full p-2 text-xs border border-gray-200 rounded-lg outline-none bg-white focus:ring-1 focus:ring-green-500 cursor-pointer"
                              value={field.type}
                              onChange={(e) => handleFieldChange(idx, "type", e.target.value)}
                            >
                              <option value="text">Teks Singkat</option>
                              <option value="textarea">Teks Panjang</option>
                              <option value="datetime-local">Tanggal & Waktu</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-gray-100 sm:border-0 pt-2 sm:pt-0 mt-1 sm:mt-0 flex-shrink-0">
                          <label className="flex items-center gap-1.5 text-xs sm:text-[10px] font-bold text-gray-500 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              className="rounded text-green-600 focus:ring-0 focus:ring-offset-0 w-4 h-4 sm:w-3.5 sm:h-3.5"
                              checked={field.required}
                              onChange={(e) => handleFieldChange(idx, "required", e.target.checked)}
                            />
                            Wajib Diisi
                          </label>

                          <button
                            type="button"
                            onClick={() => handleRemoveField(idx)}
                            className="hidden sm:inline-flex text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400 text-xs italic bg-gray-50 rounded-xl border border-dashed border-gray-255">
                    Belum ada pertanyaan kustom. Tekan "Tambah Pertanyaan" untuk membuat input baru.
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
            <button onClick={onClose} type="button" className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition">
                Batal
            </button>
            <button form="layananForm" type="submit" disabled={saving} className="px-5 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition flex items-center disabled:opacity-70">
                {saving ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
                {saving ? "Menyimpan..." : "Simpan Data"}
            </button>
        </div>
      </div>
    </div>
  );
}