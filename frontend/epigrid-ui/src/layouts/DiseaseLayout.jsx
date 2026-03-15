import { Outlet } from "react-router-dom";
import DiseaseSidebar from "../components/sidebar/DiseaseSidebar";

const DiseaseLayout = () => {
    return (
        /* Đổi từ flex (mặc định là row) sang flex-col để đẩy sidebar lên đầu */
        <div className="flex flex-col h-full w-full bg-slate-50 overflow-hidden">

            {/* Thanh Sidebar (Nay đã là Navbar ngang) nằm ở trên cùng */}
            <DiseaseSidebar />

            {/* Phần nội dung chiếm toàn bộ không gian còn lại */}
            <main className="flex-1 overflow-hidden relative min-h-0">
                {/* Outlet sẽ render các trang: Diseases, Agents, Symptoms... 
                  Đảm bảo các trang con này có cấu trúc grid hoặc flex 
                  để giữ được style "Cột danh sách | Cột chi tiết" như file gốc.
                */}
                <Outlet />
            </main>

        </div>
    );
};

export default DiseaseLayout;