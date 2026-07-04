import React, { useState, useEffect } from 'react';
import api from '../config/api';
import { X, Save, Loader2, Calendar, FileText, MapPin, Phone, Wrench } from 'lucide-react';
import AlertToast from "../components/AlertToast";
import { useAlert } from "../hooks/useAlert";

const getFieldIcon = (field) => {
  const name = (field.name || '').toLowerCase();
  const type = (field.type || '').toLowerCase();
  
  if (type === 'datetime-local' || name.includes('waktu') || name.includes('tanggal')) return Calendar;
  if (name.includes('tujuan') || name.includes('lokasi')) return MapPin;
  if (name.includes('kontak') || name.includes('telepon') || name.includes('hp')) return Phone;
  if (name.includes('fasilitas') || name.includes('alat') || name.includes('barang')) return Wrench;
  return FileText;
};

const FIELDS_UMUM = [
  { name: 'deskripsi', label: 'Keterangan / Keperluan', type: 'textarea', placeholder: 'Jelaskan keperluan Anda...', icon: FileText, required: true },
];

export default function FormLayananModal({ isOpen, onClose, layanan, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const { message, showAlert, clearAlert } = useAlert();

  const fields = (layanan && layanan.formulir_layanan && layanan.formulir_layanan.length > 0)
    ? layanan.formulir_layanan.map(f => ({
        name: f.name,
        label: f.label,
        type: f.type,
        placeholder: f.placeholder || '',
        required: !!f.required,
        icon: getFieldIcon(f)
      }))
    : FIELDS_UMUM;

  useEffect(() => {
    if (isOpen) {
      setFormData({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Validasi field required
    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        return showAlert('error', `${field.label} wajib diisi`);
      }
    }

    setLoading(true);
    try {
      // Konversi ke format array [{label, value}] sesuai yang diharapkan backend
      const form_data = fields.map(f => ({
        label: f.label,
        value: formData[f.name] || '-',
      }));

      const res = await api.post('/santri/layanan/ajukan', {
        id_layanan: layanan.id,
        form_data,
      });
      if (res.data.success) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
      showAlert('error', 'Gagal mengirim pengajuan');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !layanan) return null;

  return (
    <div onClick={onClose} className="fixed cursor-pointer inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div onClick={(e) => e.stopPropagation()} className="cursor-default bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <AlertToast message={message} onClose={clearAlert} />
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Formulir Permintaan</h3>
            <p className="text-xs text-green-600 font-medium">Layanan: {layanan.nama_layanan}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh] [scrollbar-width:none]">
          {fields.map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.name}>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Icon size={14} /> {field.label} {field.required && <span className="text-red-400">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    rows="3"
                    placeholder={field.placeholder}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm resize-none"
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                  />
                ) : field.type === 'datetime-local' ? (
                  <div className="relative">
                    <input
                      type="datetime-local"
                      name={field.name}
                      className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm"
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                    />
                    <Calendar className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                  </div>
                ) : (
                  <input
                    type="text"
                    name={field.name}
                    placeholder={field.placeholder}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm"
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Ajukan Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
