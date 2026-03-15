import axios from "axios";

const API_URL = "http://localhost:8083/api/diseases";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

const diseaseApi = {

    dangerGroups: {

        getAll: () => api.get("/danger-groups"),

        getById: (id) => api.get(`/danger-groups/${id}`),

        create: (data) => api.post("/danger-groups", data),

        update: (id, data) => api.put(`/danger-groups/${id}`, data),

        delete: (id) => api.delete(`/danger-groups/${id}`)
    },

    /* ===============================
      AGENT TYPES (loai_tac_nhan)
   =============================== */
    agentTypes: {

        getAll: () => api.get("/agent-types"),

        create: (data) => api.post("/agent-types", data),

        update: (id, data) => api.put(`/agent-types/${id}`, data),

        delete: (id) => api.delete(`/agent-types/${id}`)
    },

    /* ===============================
       AGENTS (tac_nhan)
    =============================== */
    agents: {

        getByType: (typeId) =>
            api.get(`/agents/type/${typeId}`),

        create: (data) =>
            api.post("/agents", data),

        update: (id, data) =>
            api.put(`/agents/${id}`, data),

        delete: (id) =>
            api.delete(`/agents/${id}`)
    },
    /* ===============================
       TRANSMISSIONS (duong_lay)
    ================================ */

    transmissions: {

        getAll: () => api.get("/transmissions"),

        getById: (id) => api.get(`/transmissions/${id}`),

        create: (data) => api.post("/transmissions", data),

        update: (id, data) => api.put(`/transmissions/${id}`, data),

        delete: (id) => api.delete(`/transmissions/${id}`)

    },

    /* ===============================
   SYMPTOMS (trieu_chung)
================================ */

    symptoms: {

        getAll: () => api.get("/symptoms"),

        getById: (id) => api.get(`/symptoms/${id}`),

        create: (data) => api.post("/symptoms", data),

        update: (id, data) => api.put(`/symptoms/${id}`, data),

        delete: (id) => api.delete(`/symptoms/${id}`)
    }

};

export default diseaseApi;