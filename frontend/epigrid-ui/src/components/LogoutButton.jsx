import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="p-3 mt-auto">
            <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-3 w-full text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
            >
                <LogOut size={18} className="flex-shrink-0" />
                <span className="text-[13px]">Đăng xuất</span>
            </button>
        </div>
    );
}