export default function RegisterModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}/>

      {/* modal box */}
      <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-xl p-12 animate-fadeIn">
        <h2 className="text-2xl font-semibold text-center mb-6">Buat Akun</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">NIS</label>
            <input type="text" placeholder="Masukkan NIS" className="w-full pl-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
            <input type="text" placeholder="Masukkan Nama Lengkap" className="w-full pl-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kata Sandi</label>
            <input type="password" placeholder="Masukkan Kata Sandi" className="w-full pl-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Kata Sandi</label>
            <input type="password" placeholder="Konfirmasi Kata Sandi" className="w-full pl-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
          </div>
        </div>

        <button className="w-full mt-12 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
            Register
        </button>

        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer">
          ✕
        </button>
      </div>
    </div>
  );
}
