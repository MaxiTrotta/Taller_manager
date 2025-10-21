import { useState, useEffect } from "react";
import {
  Table,
  Text,
  Group,
  Button,
  Modal,
  Select,
  TextInput,
  ScrollArea,
  ActionIcon,
  Loader,
  Center,
  Overlay,
  Badge
} from "@mantine/core";
import { IconPlus, IconTrash, IconEye, IconPencil } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import TablePagination from "@mui/material/TablePagination";

import { WorkOrderCreatorService } from "../../services/WorkOrderCreatorService";
import { ClientCreatorService } from "../../services/ClientCreatorService";
import { VehicleCreatorService } from "../../services/VehicleCreatorService";
import { TaskService } from "../../services/TaskService";
import { OrderTaskService } from "../../services/OrderTaskService";
import { sectorsService } from "../../services/sectorsService"; // 👈 Import correcto

export default function WorkOrdersTable() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [workOrders, setWorkOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);


  // Modales
  const [addModalOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [viewModalOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [editModalOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);

  const [newOrder, setNewOrder] = useState({
    idClient: "",
    idVehicle: "",
    tasks: [{ idSector: "", idTask: "", note: "" }],
  });

  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState(null);
  const [selectedOrderForDelete, setSelectedOrderForDelete] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // =================== FETCH ===================
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await WorkOrderCreatorService.getAll();
      setWorkOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error al cargar órdenes:", err);
      setWorkOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await ClientCreatorService.getAll();
      setClients(res.data || []);
    } catch {
      setClients([]);
    }
  };

  const fetchVehiclesByClient = async (idClient) => {
    try {
      const res = await VehicleCreatorService.getAllByClient(idClient);
      setVehicles(res.data || []);
    } catch {
      setVehicles([]);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await TaskService.getAll();
      setTasks(res.data || []);
    } catch {
      setTasks([]);
    }
  };

  const fetchSectors = async () => {
    try {
      const res = await sectorsService.getAllSectors();
      setSectors(res.data || []);
    } catch {
      setSectors([]);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchClients();
    fetchTasks();
    fetchSectors();
  }, []);

  // =================== CREAR ORDEN ===================
  const handleAddOrder = async () => {
    setSaving(true);
    try {
      const payloadOrder = {
        idClient: parseInt(newOrder.idClient),
        idVehicle: parseInt(newOrder.idVehicle),
        idOrderTask: 0,
        deleted: 0,
      };

      await WorkOrderCreatorService.create(payloadOrder);

      // Obtener la última orden
      const allOrders = await WorkOrderCreatorService.getAll();
      const lastOrder = Array.isArray(allOrders.data) && allOrders.data.length > 0
        ? allOrders.data[allOrders.data.length - 1]
        : null;

      const newOrderId = lastOrder?.id;

      if (newOrderId) {
        for (const task of newOrder.tasks) {
          if (task.idTask && task.idSector) {
            const payloadTask = {
              idOrder: newOrderId,
              idTask: parseInt(task.idTask),
              idSector: parseInt(task.idSector),
              state: "Pendiente",
              note: task.note || "",
              deleted: 0,
            };
            await OrderTaskService.create(payloadTask);
          }
        }
      }

      await fetchOrders();
      closeAdd();
      setNewOrder({ idClient: "", idVehicle: "", tasks: [{ idSector: "", idTask: "", note: "" }] });
    } catch (err) {
      console.error("Error al crear orden:", err);
    } finally {
      setSaving(false);
    }
  };

  // =================== MODIFICAR ORDEN ===================
  const handleEditOrder = async () => {
    if (!selectedOrderForEdit) return;
    setSaving(true);
    try {
      const payload = {
        idClient: selectedOrderForEdit.idClient,
        idVehicle: selectedOrderForEdit.idVehicle,
      };
      await WorkOrderCreatorService.update(selectedOrderForEdit.id, payload);
      await fetchOrders();
      closeEdit();
    } catch (err) {
      console.error("Error al editar orden:", err);
    } finally {
      setSaving(false);
    }
  };

  // =================== ELIMINAR ORDEN ===================
  const handleDeleteOrder = async () => {
    if (!selectedOrderForDelete) return;
    setSaving(true);
    try {
      await WorkOrderCreatorService.delete(selectedOrderForDelete.id);
      await fetchOrders();
      closeDelete();
    } catch (err) {
      console.error("Error al eliminar orden:", err);
    } finally {
      setSaving(false);
    }
  };

  // =================== VER DETALLES ===================
  const handleViewOrder = async (id) => {
    setLoading(true);
    try {
      const res = await WorkOrderCreatorService.getById(id);
      setSelectedOrder(res.data);
      openView();
    } catch (err) {
      console.error("Error al traer orden:", err);
    } finally {
      setLoading(false);
    }
  };

  // =================== RENDER FILAS ===================
  const paginated = workOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const rows = paginated.map((order) => (
    <Table.Tr key={order.id}>
      <Table.Td>{order.id}</Table.Td>
      <Table.Td>{order.client}</Table.Td>
      <Table.Td>{order.vehicle}</Table.Td>
      <Table.Td>
        <Badge
          color={
            order.state === 1
              ? "red"
              : order.state === 2
                ? "yellow"
                : order.state === 3
                  ? "green"
                  : "gray"
          }
          variant="filled"
        >
          {order.state === 1
            ? "Pendiente"
            : order.state === 2
              ? "En proceso"
              : order.state === 3
                ? "Finalizado"
                : "Sin tareas"}
        </Badge>
      </Table.Td>

      <Table.Td>
        <Group gap={0} justify="flex-end">
          <ActionIcon color="gray" variant="subtle" onClick={() => handleViewOrder(order.id)}>
            <IconEye size={16} />
          </ActionIcon>
          <ActionIcon
            color="gray"
            variant="subtle"
            onClick={() => {
              setSelectedOrderForEdit(order);
              openEdit();
            }}
          >
            <IconPencil size={16} />
          </ActionIcon>
          <ActionIcon
            color="red"
            variant="subtle"
            onClick={() => {
              setSelectedOrderForDelete(order);
              openDelete();
            }}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  // =================== RENDER PRINCIPAL ===================
  return (
    <div style={{ position: "relative" }}>
      {(loading || saving) && (
        <>
          <Overlay opacity={0.6} color="#000" blur={2} zIndex={9998} />
          <Center style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
            <Loader size="xl" color="green" />
          </Center>
        </>
      )}

      <ScrollArea>
        <Group justify="space-between" mb="sm">
          <Text fz="xl" fw={600}>
            Órdenes de Trabajo
          </Text>
          <Button color="green" onClick={openAdd}>
            Nueva Orden
          </Button>
        </Group>

        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Cliente</Table.Th>
              <Table.Th>Vehículo</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>

        <TablePagination
          component="div"
          count={workOrders.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />

        {/* =================== MODAL CREAR =================== */}
        <Modal opened={addModalOpened} onClose={closeAdd} title="Crear nueva orden" centered size="lg">
          <Select
            label="Cliente"
            placeholder="Seleccione cliente"
            data={clients.map((c) => ({ value: c.id.toString(), label: c.name }))}
            value={newOrder.idClient}
            onChange={(val) => {
              setNewOrder((prev) => ({ ...prev, idClient: val, idVehicle: "" }));
              if (val) fetchVehiclesByClient(val);
            }}
          />
          <Select
            label="Vehículo"
            placeholder="Seleccione vehículo"
            data={vehicles.map((v) => ({
              value: v.id.toString(),
              label: `${v.licensePlate} - ${v.brand} ${v.model}`,
            }))}
            value={newOrder.idVehicle}
            onChange={(val) => setNewOrder((prev) => ({ ...prev, idVehicle: val }))}
            disabled={!newOrder.idClient}
          />
          <Text fw={600} mt="md">
            Tareas
          </Text>
          {newOrder.tasks.map((t, i) => (
            <Group key={i} grow>
              <Select
                label="Sector"
                placeholder="Seleccione sector"
                data={sectors.map((s) => ({ value: s.id.toString(), label: s.name }))}
                value={t.idSector}
                onChange={(val) => {
                  const updated = [...newOrder.tasks];
                  updated[i].idSector = val;
                  setNewOrder((prev) => ({ ...prev, tasks: updated }));
                }}
              />
              <Select
                label={`Tarea ${i + 1}`}
                data={tasks.map((task) => ({
                  value: task.id.toString(),
                  label: task.description,
                }))}
                value={t.idTask}
                onChange={(val) => {
                  const updated = [...newOrder.tasks];
                  updated[i].idTask = val;
                  setNewOrder((prev) => ({ ...prev, tasks: updated }));
                }}
              />
              <TextInput
                label="Nota"
                value={t.note}
                onChange={(e) => {
                  const updated = [...newOrder.tasks];
                  updated[i].note = e.currentTarget.value;
                  setNewOrder((prev) => ({ ...prev, tasks: updated }));
                }}
              />
              {i > 0 && (
                <ActionIcon
                  color="red"
                  onClick={() =>
                    setNewOrder((prev) => ({
                      ...prev,
                      tasks: prev.tasks.filter((_, idx) => idx !== i),
                    }))
                  }
                >
                  <IconTrash size={16} />
                </ActionIcon>
              )}
            </Group>
          ))}
          <Button
            leftSection={<IconPlus size={16} />}
            mt="sm"
            variant="light"
            onClick={() =>
              setNewOrder((prev) => ({
                ...prev,
                tasks: [...prev.tasks, { idSector: "", idTask: "", note: "" }],
              }))
            }
          >
            Agregar tarea
          </Button>

          <Button fullWidth mt="md" color="green" onClick={handleAddOrder}>
            Guardar Orden
          </Button>
        </Modal>

        {/* =================== MODAL VER =================== */}
        <Modal
          opened={viewModalOpened}
          onClose={closeView}
          title="Detalle de Orden"
          centered
          size="xl"
        >
          {selectedOrder ? (
            <>
              <Text>
                <b>Cliente:</b> {selectedOrder.client}
              </Text>
              <Text>
                <b>Vehículo:</b> {selectedOrder.vehicle}
              </Text>

              {/* === Estado general de la orden === */}
              <Text>
                <b>Estado:</b>{" "}
                <Badge
                  color={
                    selectedOrder.state === 1
                      ? "yellow"
                      : selectedOrder.state === 2
                        ? "blue"
                        : selectedOrder.state === 3
                          ? "green"
                          : "gray"
                  }
                  variant="filled"
                >
                  {selectedOrder.state === 1
                    ? "Pendiente"
                    : selectedOrder.state === 2
                      ? "En proceso"
                      : selectedOrder.state === 3
                        ? "Finalizado"
                        : "Sin tareas"}
                </Badge>
              </Text>

              {/* === Tabla de tareas === */}
              <Text mt="md" fw={600}>
                Tareas
              </Text>
              <Table highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Sector</Table.Th>
                    <Table.Th>Tarea</Table.Th>
                    <Table.Th>Estado</Table.Th>
                    <Table.Th>Nota</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {selectedOrder.tasks?.length > 0 ? (
                    selectedOrder.tasks.map((t, i) => (
                      <Table.Tr key={i}>
                        <Table.Td>{t.sectorName}</Table.Td>
                        <Table.Td>{t.taskDescription}</Table.Td>

                        {/* === Estado de cada tarea con colores === */}
                        <Table.Td>
                          <Badge
                            color={
                              t.state?.toLowerCase() === "pendiente"
                                ? "red"
                                : t.state?.toLowerCase() === "en proceso"
                                  ? "yellow"
                                  : t.state?.toLowerCase() === "finalizado"
                                    ? "green"
                                    : "gray"
                            }
                            variant="filled"
                          >
                            {t.state || "Sin estado"}
                          </Badge>
                        </Table.Td>

                        <Table.Td>{t.note || "-"}</Table.Td>
                      </Table.Tr>
                    ))
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={4} align="center">
                        Sin tareas
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </>
          ) : (
            <Text>Cargando orden...</Text>
          )}
        </Modal>


        {/* =================== MODAL EDITAR =================== */}
        <Modal opened={editModalOpened} onClose={closeEdit} title="Editar Orden" centered size="md">
          {selectedOrderForEdit && (
            <>
              <Select
                label="Cliente"
                data={clients.map((c) => ({ value: c.id.toString(), label: c.name }))}
                value={selectedOrderForEdit.idClient?.toString() || ""}
                onChange={(val) =>
                  setSelectedOrderForEdit((prev) => ({
                    ...prev,
                    idClient: parseInt(val),
                  }))
                }
              />
              <Select
                label="Vehículo"
                data={vehicles.map((v) => ({
                  value: v.id.toString(),
                  label: `${v.licensePlate} - ${v.brand} ${v.model}`,
                }))}
                value={selectedOrderForEdit.idVehicle?.toString() || ""}
                onChange={(val) =>
                  setSelectedOrderForEdit((prev) => ({
                    ...prev,
                    idVehicle: parseInt(val),
                  }))
                }
              />
              <Button fullWidth mt="md" color="blue" onClick={handleEditOrder}>
                Guardar Cambios
              </Button>
            </>
          )}
        </Modal>

        {/* =================== MODAL ELIMINAR =================== */}
        <Modal opened={deleteModalOpened} onClose={closeDelete} title="Eliminar Orden" centered size="sm">
          {selectedOrderForDelete && (
            <>
              <Text>¿Seguro que quieres eliminar la orden #{selectedOrderForDelete.id}?</Text>
              <Group justify="flex-end" mt="md">
                <Button variant="default" onClick={closeDelete}>
                  Cancelar
                </Button>
                <Button color="red" onClick={handleDeleteOrder}>
                  Eliminar
                </Button>
              </Group>
            </>
          )}
        </Modal>
      </ScrollArea>
    </div>
  );
}
