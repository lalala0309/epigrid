import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/public/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserDashboard from "../pages/user/UserDashboard";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import UserManagement from "../pages/admin/UserManagement";
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";
import ManagerLayout from "../layouts/ManagerLayout";
import AreaManagement from '../pages/admin/AreaManagement';
import DiseaseManagement from "../pages/admin/DiseaseManagement";

import CaseManagement from "../pages/manager/CaseManagement";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="areas" element={<AreaManagement />} />
                    <Route path="diseases" element={<DiseaseManagement />} />
                </Route>

                <Route path="/user" element={<UserLayout />}>
                    <Route index element={<UserDashboard />} />
                </Route>

                <Route path="/manager" element={<ManagerLayout />}>
                    <Route index element={<ManagerDashboard />} />
                    <Route path="cases" element={<CaseManagement />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
