import axios from "axios";

const API_URL = "http://localhost:8080/api/cases";

const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" }
});

const caseApi = {

    cases: {
        getAll: () => api.get(""),
        getById: (id) => api.get(`/${id}`),
        create: (data) => api.post("", data),
        update: (id, data) => api.put(`/${id}`, data),
        delete: (id) => api.delete(`/${id}`),
    },

    contacts: {
        getAll: (caseId) => api.get(`/${caseId}/contacts`),
        add: (caseId, data) => api.post(`/${caseId}/contacts`, data),
        update: (contactId, data) => api.put(`/contacts/${contactId}`, data),
        delete: (contactId) => api.delete(`/contacts/${contactId}`),
    }
};

export default caseApi;