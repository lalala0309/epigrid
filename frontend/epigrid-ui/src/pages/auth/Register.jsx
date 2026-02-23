import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


import logo from '../../assets/logo.png';

const Register = () => {

    const navigate = useNavigate();

    // STATE
    const [form, setForm] = useState({
        hoTen: "",
        email: "",
        password: "",
        confirm: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // HANDLE INPUT CHANGE
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /* ================= SUBMIT ================= */
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (form.password !== form.confirm) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("http://localhost:8081/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    hoTen: form.hoTen,
                    email: form.email,
                    password: form.password
                })
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Đăng ký thất bại");
            }

            alert("Đăng ký thành công");
            navigate("/login");

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        /* h-screen cố định cao và overflow-hidden để chặn thanh trượt */
        <div className="h-screen w-full flex font-sans bg-white overflow-hidden">
            {/* NÚT QUAY LẠI TRANG CHỦ */}
            <Link
                to="/"
                className="
        absolute top-6 left-6 z-50

        flex items-center justify-center
        w-12 h-12

        text-white text-2xl
        rounded-2xl

        transition-all duration-150

        /* HOVER */
        hover:bg-white
        hover:text-[#1E3A8A]
        hover:ring-4 hover:ring-white/90

        /* ACTIVE (click) */
        active:bg-blue-100
        active:text-[#1E3A8A]
        active:ring-4 active:ring-white
    "
            >
                <i className="bi bi-chevron-left"></i>
            </Link>




            {/* PHẦN BÊN TRÁI: Branding Section (Giữ nguyên phong cách Deep Blue) */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]"></div>

                <div className="relative z-10 max-w-md text-center">
                    <div className="mb-10 inline-flex p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] shadow-2xl">
                        <img src={logo} alt="Logo" className="w-16 h-16 object-contain brightness-0 invert" />
                    </div>

                    <h2 className="text-[42px] font-black text-white leading-tight mb-6 tracking-tight">
                        Gia nhập hệ thống <br />
                        <span className="text-blue-400">EpiGrid Global</span>
                    </h2>

                    <p className="text-slate-400 text-lg leading-relaxed font-medium opacity-80">
                        Đăng ký tài khoản cá nhân của bạn để sử dụng các tiện ích của hệ thống
                    </p>

                    <div className="mt-12 flex justify-center gap-3">
                        <div className="w-12 h-1.5 rounded-full bg-blue-500"></div>
                        <div className="w-3 h-1.5 rounded-full bg-slate-700"></div>
                        <div className="w-3 h-1.5 rounded-full bg-slate-700"></div>
                    </div>
                </div>

                {/* <div className="absolute bottom-10 left-12 text-slate-500 text-[10px] tracking-[0.3em] uppercase font-bold">
                    © 2026 Epidemiology Data Grid
                </div> */}
            </div>

            {/* PHẦN BÊN PHẢI: Register Form - Đã chuyển hoàn toàn sang nền trắng */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center -translate-y-7 md:-translate-y-6 bg-white">

                {/* Container Form - Không viền, không đổ bóng, nền trắng trùng với cha */}
                <div className="max-w-[520px] w-full bg-white px-6 py-4">

                    {/* Brand Logo & Header */}
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-4">
                            <img src={logo} alt="Logo" className="w-7 h-7 object-contain" />
                            <span className="text-xl font-black text-[#1E3A8A] tracking-tighter">EpiGrid</span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                            Tạo tài khoản mới
                        </h3>
                        <p className="text-slate-500 text-sm font-medium mt-1">
                            Điền thông tin của bạn để bắt đầu đăng ký
                        </p>
                    </div>

                    {/* Social Login */}
                    {/* <div className="grid grid-cols-2 gap-4 mb-8">
                        <button className="flex items-center justify-center gap-2 py-3.5 border border-slate-100 rounded-2xl hover:bg-slate-50 font-bold text-xs transition-colors">
                            <i className="bi bi-google text-red-500"></i> Google
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3.5 border border-slate-100 rounded-2xl hover:bg-slate-50 font-bold text-xs transition-colors">
                            <i className="bi bi-microsoft text-blue-500"></i> Microsoft
                        </button>
                    </div> */}

                    <div className="relative flex items-center justify-center mb-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                        <span className="relative bg-white px-4 text-[9px] font-black uppercase tracking-[0.1em] text-slate-500">Thông tin đăng ký</span>
                    </div>
                    {/* ERROR */}
                    {error && (
                        <div className="mb-4 text-red-500 text-sm font-medium">
                            {error}
                        </div>
                    )}
                    {/* Form chính */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Họ và tên</label>
                            <input
                                name="hoTen"
                                type="text"
                                className="w-full px-5 py-4 bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 rounded-2xl outline-none transition-all text-sm font-medium"
                                placeholder="Nguyễn Văn A"
                                value={form.hoTen}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full px-5 py-4 bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 rounded-2xl outline-none transition-all text-sm font-medium"
                                placeholder="name@agency.gov.vn"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Mật khẩu</label>
                                <input
                                    name="password"
                                    type="password"
                                    className="w-full px-5 py-4 bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 rounded-2xl outline-none transition-all text-sm font-medium"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Xác nhận</label>
                                <input
                                    name="confirm"
                                    type="password"
                                    className="w-full px-5 py-4 bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 rounded-2xl outline-none transition-all text-sm font-medium"
                                    placeholder="••••••••"
                                    value={form.confirm}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                disabled={loading}
                                className="w-full py-3.5 text-sm bg-[#1E3A8A] text-white rounded-2xl font-bold shadow-xl shadow-blue-900/10 hover:bg-blue-800 active:scale-[0.98] transition-all">
                                {loading ? "Đang đăng ký..." : "Đăng ký"}
                            </button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500 font-medium">
                        Đã có tài khoản?{' '}
                        <Link to="/login" className="text-blue-600 font-bold hover:underline">
                            Đăng nhập
                        </Link>
                    </p>

                </div>
            </div>

        </div>
    );
};

export default Register;