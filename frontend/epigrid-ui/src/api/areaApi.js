import axios from "axios";

const API_URL = "http://localhost:8082/api/areas";

const areaApi = {
    getAll: () => axios.get(API_URL),
    getById: (id) => axios.get(`${API_URL}/${id}`),
    create: (data) => axios.post(API_URL, data),
    update: (id, data) => axios.put(`${API_URL}/${id}`, data),
    delete: (id) => axios.delete(`${API_URL}/${id}`),

    // lấy nhân viên của khu vực
    getStaff: (areaId) => axios.get(`${API_URL}/${areaId}/staff`),

    // lấy nhân viên chưa phân công
    getAvailableStaff: (areaId) => axios.get(`${API_URL}/${areaId}/staff-available`),

    // phân công nhân viên vào khu vực
    assignStaff: (areaId, staffIds) =>
        axios.post(`${API_URL}/${areaId}/assign-staff`, staffIds),
    // gỡ nhân viên khỏi khu vực
    removeStaff: (areaId, userId) =>
        axios.delete(`${API_URL}/${areaId}/remove/${userId}`)
};

export default areaApi;