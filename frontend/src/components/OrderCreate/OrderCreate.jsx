import { useState, useEffect } from "react";
import {
  Button,
  Select,
  Modal,
  TextInput,
  Group
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";

import { OrderCreatorService } from "../../services/OrderCreatorService";
import { OrderTaskCreatorService } from "../../services/OrderTaskCreatorService";
import { VehicleCreatorService } from "../../services/VehicleCreatorService";
import { ClientCreatorService } from "../../services/ClientCreatorService";

export default function OrderCreate() {
  const [clients, setClients] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);

  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newVehiclePlate, setNewVehiclePlate] = useState("");
  const [newVehicleBrand, setNewVehicleBrand] = useState("");
  const [newVehicleModel, setNewVehicleModel] = useState("");
  const [newVehicleYear, setNewVehicleYear] = useState("");

  // Cargar clientes y tareas al iniciar
  useEffect(() => {
    ClientCreatorService.getAll()
      .then(res => setClients(Array.isArray(res.data) ? res.data : res.data.clients || []))
      .catch(() => setClients([]));

    OrderTaskCreatorService.getAll()
      .then(res => setTasks(Array.isArray(res.data) ? res.data : res.data.tasks || []))
      .catch(() => setTasks([]));
  }, []);

  // Cargar vehículos cuando se selecciona cliente
  useEffect(() => {
    if (selectedClient) {
      // ---------------------------
      // Si backend de vehicles estuviera listo:
      // VehicleCreatorService.getAllByClient(selectedClient.id)
      //   .then(res => setVehicles(res.data))
      //   .catch(err => console.error(err));
      // ---------------------------
      setVehicles([]); // temporal
      setSelectedVehicle(null);
    } else {
      setVehicles([]);
      setSelectedVehicle(null);
    }
  }, [selectedClient]);

  const handleCreateClient = async () => {
    if (!newClientName) return;
    try {
      const created = await ClientCreatorService.create({ name: newClientName, email: newClientEmail });
      setClients([...clients, created]);
      setSelectedClient(created);
      setClientModalOpen(false);
      setNewClientName("");
      setNewClientEmail("");
      showNotification({ title: "Éxito", message: "Cliente creado correctamente", color: "green" });
    } catch {
      showNotification({ title: "Error", message: "No se pudo crear el cliente", color: "red" });
    }
  };

  const handleCreateVehicle = async () => {
    if (!newVehiclePlate || !selectedClient) return;
    try {
      const created = await VehicleCreatorService.create({
        license_plate: newVehiclePlate,
        brand: newVehicleBrand,
        model: newVehicleModel,
        year: newVehicleYear,
        id_cliente: selectedClient.id
      });
      setVehicles([...vehicles, created]);
      setSelectedVehicle(created);
      setVehicleModalOpen(false);
      setNewVehiclePlate("");
      setNewVehicleBrand("");
      setNewVehicleModel("");
      setNewVehicleYear("");
      showNotification({ title: "Éxito", message: "Vehículo creado correctamente", color: "green" });
    } catch {
      showNotification({ title: "Error", message: "No se pudo crear el vehículo", color: "red" });
    }
  };

  const handleCreateOrder = async () => {
    if (!selectedClient || !selectedVehicle || !selectedTask) {
      showNotification({ title: "Error", message: "Seleccione cliente, vehículo y tarea", color: "red" });
      return;
    }
    try {
      await OrderCreatorService.create({
        id_cliente: selectedClient.id,
        id_vehicle: selectedVehicle.id,
        id_task: selectedTask.id,
        user_id: 1,
        created_at: new Date().toISOString()
      });
      showNotification({ title: "Éxito", message: "Orden creada correctamente", color: "green" });
      setSelectedClient(null);
      setSelectedVehicle(null);
      setSelectedTask(null);
    } catch {
      showNotification({ title: "Error", message: "No se pudo crear la orden", color: "red" });
    }
  };

  return (
    <div>
      <Select
        label="Seleccionar Cliente"
        placeholder="Seleccione un cliente"
        data={clients.map(c => ({ value: String(c.id), label: c.name }))}
        value={selectedClient?.id ? String(selectedClient.id) : ""}
        onChange={val => setSelectedClient(clients.find(c => String(c.id) === val))}
        nothingfound="No hay clientes"
        searchable
        rightSection={<Button size="xs" onClick={() => setClientModalOpen(true)}>Nuevo</Button>}
      />


      <Select
        label="Seleccionar Vehículo"
        placeholder="Seleccione un vehículo"
        data={vehicles.map(v => ({ value: v, label: `${v.license_plate} - ${v.brand} ${v.model}` }))}
        value={selectedVehicle}
        onChange={setSelectedVehicle}
        nothingfound="No hay vehículos"
        disabled={!selectedClient || vehicles.length === 0}
        searchable
        rightSection={<Button size="xs" onClick={() => setVehicleModalOpen(true)} disabled={!selectedClient}>Nuevo</Button>}
      />

      <Select
        label="Seleccionar Tarea"
        placeholder="Seleccione una tarea"
        data={tasks.map(t => ({ value: t, label: t.name }))}
        value={selectedTask}
        onChange={setSelectedTask}
        nothingfound="No hay tareas"
        searchable
      />

      <Group mt="md">
        <Button onClick={handleCreateOrder}>Crear Orden</Button>
      </Group>

      <Modal opened={clientModalOpen} onClose={() => setClientModalOpen(false)} title="Crear Cliente">
        <TextInput label="Nombre" value={newClientName} onChange={e => setNewClientName(e.currentTarget.value)} />
        <TextInput label="Email" value={newClientEmail} onChange={e => setNewClientEmail(e.currentTarget.value)} mt="sm" />
        <Button mt="md" fullWidth onClick={handleCreateClient}>Crear Cliente</Button>
      </Modal>

      <Modal opened={vehicleModalOpen} onClose={() => setVehicleModalOpen(false)} title="Crear Vehículo">
        <TextInput label="Patente" value={newVehiclePlate} onChange={e => setNewVehiclePlate(e.currentTarget.value)} />
        <TextInput label="Marca" value={newVehicleBrand} onChange={e => setNewVehicleBrand(e.currentTarget.value)} mt="sm" />
        <TextInput label="Modelo" value={newVehicleModel} onChange={e => setNewVehicleModel(e.currentTarget.value)} mt="sm" />
        <TextInput label="Año" value={newVehicleYear} onChange={e => setNewVehicleYear(e.currentTarget.value)} mt="sm" />
        <Button mt="md" fullWidth onClick={handleCreateVehicle}>Crear Vehículo</Button>
      </Modal>
    </div>
  );
}
