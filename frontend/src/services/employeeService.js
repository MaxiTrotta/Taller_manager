import { api } from "./api";

export const employeesService = {
  // Obtener todos los empleados
    getAllEmployees: () => api.get("/employees"),
    

  // Obtener un Empleado por ID
  getEmployedById: (id) => api.get("/employees/" + id),

  // Crear un nuevo Empleado
  createEmployed: (payload) => 
    api.post("/employees", payload, { 
      headers: { "Content-Type": "application/json" } 
    }),

  // Modifica un Empleado
  updateEmployed: (id, payload) => 
    api.put("/employees/" + id, payload, { 
      headers: { "Content-Type": "application/json" } 
    }),

  // Eliminar un Empleado
  deleteEmployed: (id) => api.delete("/employees/" + id),
};
