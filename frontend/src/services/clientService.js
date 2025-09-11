import { api } from "./api";

export const clientService = {
  getAllClients: () => api.get("/clients"),
  getClientById: (id) => api.get("/clients/" + id),
  // Puedes agregar más métodos según lo necesites
};