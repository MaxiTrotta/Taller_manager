import { api } from "./api";

export const clientService = {
  // Obtener todos los clientes
  getAllClients: () => api.get("/clients"),

  // Obtener un cliente por ID
  getClientById: (id) => api.get("/clients/" + id),

  // Crear un nuevo cliente
  createClient: (clientData) => api.post("/clients", clientData),
};
