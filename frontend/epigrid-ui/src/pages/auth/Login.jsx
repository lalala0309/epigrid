import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import map_background from '../../assets/map_background.png';
import { useState } from "react";


const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const handleLogin = async (e) => {
        setError("");

        e.preventDefault();

        try {
            const res = await fetch("http://localhost:8081/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    password: password.trim()
                })

            });

            if (!res.ok) {
                if (res.status === 401) {
                    setError("Sai email hoặc mật khẩu");
                } else if (res.status === 403) {
                    setError("Bạn không có quyền truy cập hệ thống");
                } else {
                    setError("Lỗi server: " + res.status);
                }
                return;
            }


            const data = await res.json();

            // lưu JWT
            localStorage.setItem("token", data.token);

            // redirect theo role
            switch (data.role) {
                case "ADMIN":
                    navigate("/admin");
                    break;
                case "MANAGER":
                    navigate("/manager");
                    break;
                default:
                    navigate("/user");
            }

        } catch (err) {
            console.error(err);
            alert("Server lỗi: " + err.message);

        }
    };

    return (
        /* Thêm h-screen để cố định chiều cao và overflow-hidden để chặn thanh trượt */
        <div className="h-screen w-full flex font-sans bg-white overflow-hidden">

            {/* PHẦN BÊN TRÁI: Welcome Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#F8FAFF] to-[#E0E7FF] items-center justify-center p-12 relative overflow-hidden">
                {/* NÚT QUAY LẠI TRANG CHỦ */}
                <Link
                    to="/"
                    className="
        absolute top-6 left-6 z-50

        flex items-center justify-center
        w-12 h-12

        text-blue text-2xl
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

                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[100px]"></div>

                <div className="relative z-10 max-w-lg text-center lg:text-left flex flex-col items-center justify-center">
                    <h2 className="text-[40px] font-black text-[#1E3A8A] leading-[1.1] mb-6">
                        Chào mừng tới <span className="text-blue-600">EpiGrid</span> <br />
                        {/* <span className="text-2xl font-bold text-slate-500 opacity-80">(Hệ thống quản trị dịch tễ)</span> */}
                    </h2>
                    <p className="text-slate-600 text-center leading-relaxed mb-8 font-medium">
                        Công cụ phân tích dữ liệu hỗ trợ bản đồ số hóa giúp cộng đồng an toàn hơn thông qua cảnh báo thông tin thời gian thực
                    </p>

                    <div className="relative inline-block group">
                        <div className="absolute inset-0 bg-blue-600 rounded-3xl blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                        <img
                            src={map_background}
                            alt="Illustration"
                            className="relative w-full max-w-[320px] h-auto rounded-[2rem] shadow-sm transform transition-transform hover:-translate-y-2 duration-500"
                        />
                    </div>
                </div>
            </div>

            {/* PHẦN BÊN PHẢI: Login Form (giống Register style) */}
            <div className="relative w-full lg:w-1/2 flex flex-col items-center justify-center bg-white">

                <div className="max-w-[520px] w-full bg-white px-6 py-4">

                    {/* Header */}
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-4">
                            <img src={logo} alt="Logo" className="w-7 h-7 object-contain" />
                            <span className="text-xl font-black text-[#1E3A8A] tracking-tighter">EpiGrid</span>
                        </div>

                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                            Đăng nhập
                        </h3>

                        <p className="text-slate-500 text-sm font-medium mt-1">
                            Tiếp tục phiên làm việc của bạn
                        </p>
                    </div>


                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">


                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                }}

                                placeholder="name@agency.gov.vn"
                                className="w-full px-5 py-4 bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 rounded-2xl outline-none transition-all text-sm font-medium"
                            />

                        </div>


                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                                    Mật khẩu
                                </label>
                                {/* <button
                                    type="button"
                                    className="text-[10px] font-bold text-blue-600 hover:underline"
                                >
                                    Quên?
                                </button> */}
                            </div>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError("");
                                }}

                                placeholder="••••••••"
                                className="w-full px-5 py-4 bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 rounded-2xl outline-none transition-all text-sm font-medium"
                            />

                        </div>

                        {error && (
                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                <p className="text-red-700 text-sm font-medium leading-relaxed">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Button */}
                        <div className="pt-6">
                            <button type="submit"
                                className="w-full py-3.5 text-sm bg-[#1E3A8A] text-white rounded-2xl font-bold shadow-xl shadow-blue-900/10 hover:bg-blue-800 active:scale-[0.98] transition-all">
                                Đăng nhập
                            </button>
                        </div>

                    </form>


                    <p className="mt-12 text-center text-sm text-slate-500 font-medium">
                        Chưa có tài khoản?{' '}
                        <Link to="/register" className="text-blue-600 font-bold hover:underline">
                            Đăng ký
                        </Link>
                    </p>

                </div>
            </div>

        </div>
    );
};

export default Login;