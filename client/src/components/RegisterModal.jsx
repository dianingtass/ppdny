import { useState } from 'react';
import axios from 'axios';

export default function RegisterModal({ open, onClose }) {
  const [formData, setFormData] = useState({
    nip: '',
    nama: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validasi sederhana
    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak sama');
      setLoading(false);
      return;
    }

    if (!formData.nip || !formData.nama || !formData.password) {
      setError('Semua field harus diisi');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        nip: formData.nip,
        nama: formData.nama,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setSuccess('Registrasi berhasil! Silakan login.');
      console.log('Registration successful:', response.data);
      
      // Reset form setelah 2 detik
      setTimeout(() => {
        setFormData({
          nip: '',
          nama: '',
          password: '',
          confirmPassword: ''
        });
        onClose(); // Tutup modal
      }, 2000);

    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response) {
        // Server responded with error
        setError(err.response.data.message || 'Terjadi kesalahan saat registrasi');
      } else if (err.request) {
        // No response received
        setError('Tidak dapat terhubung ke server. Periksa koneksi Anda.');
      } else {
        // Something else
        setError('Terjadi kesalahan: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal box */}
      <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-xl p-12 animate-fadeIn">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl cursor-pointer" disabled={loading}>
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6">Buat Akun</h2>

        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">NIS</label>
              <input type="text" name="nip" placeholder="Masukkan NIS" className="w-full pl-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                value={formData.nip}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
              <input type="text" name="nama" placeholder="Masukkan Nama Lengkap"  className="w-full pl-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.nama}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kata Sandi</label>
              <input type="password" name="password" placeholder="Masukkan Kata Sandi" className="w-full pl-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Kata Sandi</label>
              <input type="password" name="confirmPassword" placeholder="Konfirmasi Kata Sandi" className="w-full pl-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          <button type="submit" className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center" disabled={loading}>
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </>
            ) : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}