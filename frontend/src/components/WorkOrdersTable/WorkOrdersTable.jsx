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
  Badge,
} from "@mantine/core";
import { IconPlus, IconTrash, IconEye, IconPencil } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import TablePagination from "@mui/material/TablePagination";

import { WorkOrderCreatorService } from "../../services/WorkOrderCreatorService";
import { ClientCreatorService } from "../../services/ClientCreatorService";
import { VehicleCreatorService } from "../../services/VehicleCreatorService";
import { TaskService } from "../../services/TaskService";
import { OrderTaskService } from "../../services/OrderTaskService";
import { sectorsService } from "../../services/sectorsService";

export default function WorkOrdersTable() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [workOrders, setWorkOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState(null);
  const [selectedOrderForDelete, setSelectedOrderForDelete] = useState(null);

  const [addModalOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [viewModalOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [editModalOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);

  const [newOrder, setNewOrder] = useState({
    idClient: "",
    idVehicle: "",
    tasks: [{ idSector: "", idTask: "", note: "" }],
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // =================== HELPERS ===================
  const stateTextToNumber = (s) => {
    const t = (s || "").toString().toLowerCase();
    if (t === "pendiente" || t === "1") return 1;
    if (t.includes("proceso") || t === "2") return 2;
    if (t === "finalizado" || t === "3") return 3;
    return 1;
  };
  const stateNumberToText = (n) => (n === 1 ? "Pendiente" : n === 2 ? "En proceso" : "Finalizado");

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

      const allOrders = await WorkOrderCreatorService.getAll();
      const lastOrder =
        Array.isArray(allOrders.data) && allOrders.data.length > 0
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

  // =================== EDITAR ORDEN (TRAER CON TAREAS) ===================
  const handleEditClick = async (id) => {
    setLoading(true);
    try {
      const resOrder = await WorkOrderCreatorService.getById(id);
      const order = resOrder.data;

      // Traigo las ordertasks reales (con id) y los catálogos de tareas y sectores
      const [resTasksAll, resTasksCatalog, resSectors] = await Promise.all([
        OrderTaskService.getAll(),
        TaskService.getAll(),
        sectorsService.getAllSectors(),
      ]);

      const allOrderTasks = Array.isArray(resTasksAll.data)
        ? resTasksAll.data
        : Array.isArray(resTasksAll.data?.data)
          ? resTasksAll.data.data
          : [];

      const allTasks = resTasksCatalog.data || [];
      const allSectors = resSectors.data || [];

      // Reconstruir idTask e idSector en cada tarea de la proyección (si vienen solo con descripción)
      const rebuiltProjection = (order.tasks || []).map((t) => {
        const foundTask = allTasks.find(
          (tk) => tk.description && t.taskDescription && tk.description.trim().toLowerCase() === t.taskDescription.trim().toLowerCase()
        );
        const foundSector = allSectors.find(
          (s) => s.name && t.sectorName && s.name.trim().toLowerCase() === t.sectorName.trim().toLowerCase()
        );
        return {
          ...t,
          idTask: foundTask ? foundTask.id : t.idTask || null,
          idSector: foundSector ? foundSector.id : t.idSector || null,
        };
      });

      // Emparejar proyección reconstruida con tareas reales (para obtener el id de ordertask)
      // Evitar asignar el mismo orderTask id a múltiples proyecciones iguales: marcamos los ids usados
      const usedIds = new Set();
      const mergedTasks = rebuiltProjection.map((pt) => {
        const candidates = allOrderTasks.filter(
          (rt) =>
            Number(rt.idOrder) === Number(order.id) &&
            Number(rt.idTask) === Number(pt.idTask) &&
            Number(rt.idSector) === Number(pt.idSector)
        );

        if (candidates.length === 0) return pt;

        // intentar afinar por nota y que no esté usado
        let match = candidates.find((rt) => {
          return !usedIds.has(rt.id) && (rt.note || "").trim() === (pt.note || "").trim();
        });

        // si no hay match por nota, tomar el primer candidato no usado
        if (!match) {
          match = candidates.find((rt) => !usedIds.has(rt.id));
        }

        if (match) {
          usedIds.add(match.id);
          return { ...pt, id: match.id };
        }

        return pt;
      });

      setSelectedOrderForEdit({ ...order, tasks: mergedTasks });
      openEdit();
    } catch (err) {
      console.error("Error al traer orden para editar:", err);
    } finally {
      setLoading(false);
    }
  };


  // =================== GUARDAR TAREAS ===================
  const handleSaveEditedTasks = async () => {
    if (!selectedOrderForEdit || !selectedOrderForEdit.tasks) return;
    setSaving(true);
    try {
      // 1️⃣ Traer tareas originales para detectar borradas
      const resOriginal = await WorkOrderCreatorService.getById(selectedOrderForEdit.id);
      const originalTasks = resOriginal.data.tasks || [];

      // 2️⃣ Detectar eliminadas (estaban antes y ya no están)
      const deletedTasks = originalTasks.filter(
        (orig) => !selectedOrderForEdit.tasks.some((curr) => curr.id === orig.id)
      );

      // 3️⃣ Actualizar y crear
      for (const t of selectedOrderForEdit.tasks) {
        const stateNumber =
          typeof t.state === "number"
            ? t.state
            : (t.state || "").toLowerCase() === "pendiente"
              ? 1
              : (t.state || "").toLowerCase().includes("proceso")
                ? 2
                : 3;

        // Actualizar
        if (t.id) {
          await OrderTaskService.update(t.id, {
            idOrder: selectedOrderForEdit.id,
            idTask: t.idTask,
            idSector: t.idSector,
            state: stateNumber,
            note: t.note || "",
          });
        }
        // Crear nueva tarea
        else if (t.idTask && t.idSector) {
          await OrderTaskService.create({
            idOrder: selectedOrderForEdit.id,
            idTask: parseInt(t.idTask),
            idSector: parseInt(t.idSector),
            state: 1, // siempre arranca Pendiente
            note: t.note || "",
            deleted: 0,
          });
        }
      }

      // 4️⃣ Eliminar las que se quitaron
      for (const t of deletedTasks) {
        if (t.id) await OrderTaskService.delete(t.id);
      }

      // 5️⃣ Refrescar
      const resUpdated = await WorkOrderCreatorService.getById(selectedOrderForEdit.id);
      const updatedOrder = resUpdated.data;
      setWorkOrders((prev) =>
        prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
      );

      closeEdit();
    } catch (err) {
      console.error("Error al guardar tareas:", err);
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

  // =================== FILAS ===================
  const paginated = workOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const rows = paginated.map((order) => (
    <Table.Tr key={order.id}>
      <Table.Td>{order.id}</Table.Td>
      <Table.Td>{order.client}</Table.Td>
      <Table.Td>{order.vehicle}</Table.Td>
      <Table.Td>
        <Badge
          color={order.state === 1 ? "red" : order.state === 2 ? "yellow" : order.state === 3 ? "green" : "gray"}
          variant="filled"
        >
          {order.state === 1 ? "Pendiente" : order.state === 2 ? "En proceso" : order.state === 3 ? "Finalizado" : "Sin tareas"}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end">
          <ActionIcon color="gray" variant="subtle" onClick={() => handleViewOrder(order.id)}>
            <IconEye size={16} />
          </ActionIcon>
          <ActionIcon color="gray" variant="subtle" onClick={() => handleEditClick(order.id)}>
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

  // =================== UI ===================
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

        {/* =================== MODALES =================== */}

        {/* CREAR */}
        <Modal opened={addModalOpened} onClose={closeAdd} title="Crear nueva orden" centered size="lg">
          <Select
            label="Cliente"
            data={clients.map((c) => ({ value: c.id.toString(), label: c.name }))}
            value={newOrder.idClient}
            onChange={(val) => {
              setNewOrder((prev) => ({ ...prev, idClient: val, idVehicle: "" }));
              if (val) fetchVehiclesByClient(val);
            }}
          />
          <Select
            label="Vehículo"
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
                data={tasks.map((task) => ({ value: task.id.toString(), label: task.description }))}
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

        {/* VER */}
        <Modal opened={viewModalOpened} onClose={closeView} title="Detalle de Orden" centered size="xl">
          {selectedOrder ? (
            <>
              <Text>
                <b>Cliente:</b> {selectedOrder.client}
              </Text>
              <Text>
                <b>Vehículo:</b> {selectedOrder.vehicle}
              </Text>

              <Group gap="xs" align="center" mt="sm">
                <Text fw={500}>Estado:</Text>
                <Badge
                  color={
                    selectedOrder.state === 1
                      ? "red"
                      : selectedOrder.state === 2
                        ? "yellow"
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
              </Group>

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
                        <Table.Td>
                          <Badge
                            color={
                              (t.state || "").toLowerCase() === "pendiente"
                                ? "red"
                                : (t.state || "").toLowerCase() === "en proceso"
                                  ? "yellow"
                                  : (t.state || "").toLowerCase() === "finalizado"
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

        {/* EDITAR */}
        {/* =================== MODAL EDITAR =================== */}
        <Modal opened={editModalOpened} onClose={closeEdit} title="Editar Orden" centered size="xl">
          {selectedOrderForEdit ? (
            <>
              <Text fw={600} mb="sm">
                Editar tareas de la orden #{selectedOrderForEdit.id}
              </Text>

              <Table highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Sector</Table.Th>
                    <Table.Th>Tarea</Table.Th>
                    <Table.Th>Estado</Table.Th>
                    <Table.Th>Nota</Table.Th>
                    <Table.Th>Acciones</Table.Th>
                  </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                  {selectedOrderForEdit.tasks?.length > 0 ? (
                    selectedOrderForEdit.tasks.map((t, i) => (
                      <Table.Tr key={i}>
                        <Table.Td>
                          <Select
                            data={sectors.map((s) => ({ value: s.id.toString(), label: s.name }))}
                            value={t.idSector?.toString() || ""}
                            onChange={(val) => {
                              const updated = [...selectedOrderForEdit.tasks];
                              updated[i].idSector = val;
                              setSelectedOrderForEdit((prev) => ({ ...prev, tasks: updated }));
                            }}
                          />
                        </Table.Td>

                        <Table.Td>
                          <Select
                            data={tasks.map((task) => ({ value: task.id.toString(), label: task.description }))}
                            value={t.idTask?.toString() || ""}
                            onChange={(val) => {
                              const updated = [...selectedOrderForEdit.tasks];
                              updated[i].idTask = val;
                              setSelectedOrderForEdit((prev) => ({ ...prev, tasks: updated }));
                            }}
                          />
                        </Table.Td>

                        <Table.Td>
                          <Select
                            data={[
                              { value: "1", label: "Pendiente" },
                              { value: "2", label: "En proceso" },
                              { value: "3", label: "Finalizado" },
                            ]}
                            value={
                              typeof t.state === "number"
                                ? t.state.toString()
                                : (t.state || "").toLowerCase() === "pendiente"
                                  ? "1"
                                  : (t.state || "").toLowerCase().includes("proceso")
                                    ? "2"
                                    : "3"
                            }
                            onChange={(val) => {
                              const updated = [...selectedOrderForEdit.tasks];
                              updated[i].state = parseInt(val);
                              setSelectedOrderForEdit((prev) => ({ ...prev, tasks: updated }));
                            }}
                          />
                        </Table.Td>

                        <Table.Td>
                          <TextInput
                            value={t.note || ""}
                            onChange={(e) => {
                              const updated = [...selectedOrderForEdit.tasks];
                              updated[i].note = e.currentTarget.value;
                              setSelectedOrderForEdit((prev) => ({ ...prev, tasks: updated }));
                            }}
                          />
                        </Table.Td>

                        <Table.Td>
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            onClick={() => {
                              setSelectedOrderForEdit((prev) => ({
                                ...prev,
                                tasks: prev.tasks.filter((_, idx) => idx !== i),
                              }));
                            }}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={5} align="center">
                        Sin tareas
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>

              {/* ✅ Botón fuera de la tabla */}
              <Group justify="space-between" mt="md">
                <Button
                  variant="light"
                  leftSection={<IconPlus size={16} />}
                  onClick={() =>
                    setSelectedOrderForEdit((prev) => ({
                      ...prev,
                      tasks: [
                        ...(prev.tasks || []),
                        { idSector: "", idTask: "", state: 1, note: "" },
                      ],
                    }))
                  }
                >
                  Agregar tarea
                </Button>

                {selectedOrderForEdit.tasks?.length > 0 && (
                  <Button fullWidth mt="md" color="blue" onClick={handleSaveEditedTasks}>
                    Guardar todos los cambios
                  </Button>
                )}
              </Group>
            </>
          ) : (
            <Text>Cargando orden...</Text>
          )}
        </Modal>


        {/* ELIMINAR */}
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
