import { useState } from "react";
import RegisterModal from "../components/RegisterModal";

export default function Login() {
    const [openRegister, setOpenRegister] = useState(false);
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
                    <br /><br />
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">NIS (Nomor Induk Santri)</label>
                            <div className="relative">
                                <input type="text" placeholder="Masukkan NIS Anda" className="w-full pl-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-gray-700">Kata Sandi</label>
                            </div>

                            <div className="relative">
                                <input type="password" placeholder="Masukkan Kata Sandi" className="w-full pl-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
                            Masuk
                        </button>
                    </form>

                    <p className="text-sm text-center mt-4">
                        Belum punya akun?{" "}
                        <button onClick={() => setOpenRegister(true)} className="text-blue-600 hover:underline">
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
    )
}
