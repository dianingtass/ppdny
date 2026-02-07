import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RegisterModal from "../components/RegisterModal";

export default function Login() {
    const [openRegister, setOpenRegister] = useState(false);
    const [nip, setNip] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        if (!nip.trim()) {
            setError("NIS harus diisi");
            setLoading(false);
            return;
        }
        
        if (!password.trim()) {
            setError("Kata sandi harus diisi");
            setLoading(false);
            return;
        }
        
        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                nip,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const { token, user } = response.data;
            
            // Simpan token dan user data
            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user || {}));
            }
            
            // Redirect berdasarkan role
            if (user?.role === 'santri') {
                navigate('/santri');
            } else if (user?.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (user?.role === 'wali') {
                navigate('/wali/dashboard');
            } else {
                navigate('/santri');
            }
            
        } catch (err) {
            console.error('Login error:', err);
            
            if (err.response) {
                setError(err.response.data.message || 'Login gagal');
            } else if (err.request) {
                setError('Tidak dapat terhubung ke server');
            } else {
                setError('Terjadi kesalahan: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-blue-500 text-white flex-col justify-center items-center px-12">
                <div className="flex flex-col items-center text-center max-w-md">
                    <div className="w-28 h-28 rounded-2xl bg-white/20 flex items-center justify-center mb-8">
                        <svg width="52" height="52" viewBox="0 0 24 24" fill="white">
                            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold mb-3">SIM-Tren</h1>
                    <p className="text-lg font-medium mb-6">Sistem Informasi Manajemen Pesantren</p>
                </div>
            </div>

            <div className="flex w-full lg:w-1/2 justify-center items-center px-6">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Selamat Datang</h2>
                    
                    {error && (
                        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}
                    
                    <br />
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                NIS (Nomor Induk Santri)
                            </label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Masukkan NIS Anda" 
                                    className="w-full pl-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={nip}
                                    onChange={(e) => setNip(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Kata Sandi
                                </label>
                                <button 
                                    type="button"
                                    className="text-blue-600 hover:underline text-sm"
                                    onClick={() => alert("Fitur lupa password akan datang!")}
                                >
                                    Lupa kata sandi?
                                </button>
                            </div>
                            <div className="relative">
                                <input 
                                    type="password" 
                                    placeholder="Masukkan Kata Sandi" 
                                    className="w-full pl-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Memproses...
                                </span>
                            ) : "Masuk"}
                        </button>
                    </form>

                    <p className="text-sm text-center mt-4">
                        Belum punya akun?{" "}
                        <button 
                            onClick={() => setOpenRegister(true)} 
                            className="text-blue-600 hover:underline font-medium"
                            disabled={loading}
                        >
                            Daftar
                        </button>
                    </p>
                </div>

                <RegisterModal
                    open={openRegister}
                    onClose={() => setOpenRegister(false)}
                />
            </div>
        </div>
    );
}