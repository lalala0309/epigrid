import { NavLink } from "react-router-dom";
import {
    Activity,
    Bug,
    Thermometer,
    Share2,
    ShieldAlert
} from "lucide-react";

const DiseaseNavbar = () => {
    const menus = [
        { name: "Dịch bệnh", path: "/admin/diseases", icon: Activity },
        { name: "Tác nhân", path: "/admin/diseases/agents", icon: Bug },
        { name: "Triệu chứng", path: "/admin/diseases/symptoms", icon: Thermometer },
        { name: "Đường lây", path: "/admin/diseases/transmissions", icon: Share2 },
        { name: "Nhóm nguy hiểm", path: "/admin/diseases/danger-groups", icon: ShieldAlert },
    ];

    return (
        <nav className="h-11 border-b border-slate-200 bg-white flex items-center sticky top-0 z-10">
            {menus.map((m) => {
                const Icon = m.icon;

                return (
                    <NavLink
                        key={m.path}
                        to={m.path}
                        end={m.path === "/admin/diseases"}
                        className={({ isActive }) =>
                            `relative w-[130px] flex items-center justify-center gap-2 h-full text-xs transition-all duration-300 group
                            ${isActive
                                ? "text-[#1E3A8A] font-bold"
                                : "text-black font-medium hover:text-[#1E3A8A]/80"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon
                                    size={15}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className={`transition-all duration-300 ${isActive ? "scale-110" : "group-hover:scale-105"}`}
                                />
                                <span>{m.name}</span>

                                <span
                                    className={`absolute bottom-0 left-6 right-5 h-[3px] bg-[#1E3A8A] transition-all duration-300 origin-center
                                    ${isActive
                                            ? "opacity-100 scale-x-60"
                                            : "opacity-0 scale-x-0 left-3 group-hover:opacity-40 group-hover:scale-x-75"
                                        }`}
                                />
                            </>
                        )}
                    </NavLink>
                );
            })}
        </nav>
    );
};

export default DiseaseNavbar;