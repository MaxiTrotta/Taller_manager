import { useState, useEffect } from 'react';
import {
  Table, Text, Group, Button, Modal, Select, TextInput, ScrollArea,
  ActionIcon, Loader, Center, Overlay
} from '@mantine/core';
import { IconPlus, IconTrash, IconEye } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import TablePagination from '@mui/material/TablePagination';

import { WorkOrderCreatorService } from '../../services/WorkOrderCreatorService';
import { ClientCreatorService } from '../../services/ClientCreatorService';
import { VehicleCreatorService } from '../../services/VehicleCreatorService';
import { TaskService } from '../../services/TaskService';

export default function WorkOrdersTable() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [workOrders, setWorkOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [addModalOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [viewModalOpened, { open: openView, close: closeView }] = useDisclosure(false);

  const [newOrder, setNewOrder] = useState({
    idClient: '',
    idVehicle: '',
    tasks: [{ idTask: '', note: '' }]
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // =================== FETCH ===================
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await WorkOrderCreatorService.getAll();
      setWorkOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error al cargar órdenes:', err);
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

  useEffect(() => {
    fetchOrders();
    fetchClients();
    fetchTasks();
  }, []);

  // =================== CREAR ORDEN ===================
 const handleAddOrder = async () => {
  setSaving(true);
  try {
    const payload = {
      idClient: parseInt(newOrder.idClient),
      idVehicle: parseInt(newOrder.idVehicle),
      idOrderTask: 1, // 👈 agregado para satisfacer el backend
      tasks: newOrder.tasks.map(t => ({
        idTask: parseInt(t.idTask),
        note: t.note
      }))
    };

    await WorkOrderCreatorService.create(payload);
    await fetchOrders();
    closeAdd();
    setNewOrder({ idClient: '', idVehicle: '', tasks: [{ idTask: '', note: '' }] });
  } catch (err) {
    console.error('Error al crear orden:', err);
  } finally {
    setSaving(false);
  }
};


  // =================== VER ORDEN DETALLADA ===================
  const handleViewOrder = async (id) => {
    setLoading(true);
    try {
      const res = await WorkOrderCreatorService.getById(id);
      setSelectedOrder(res.data);
      openView();
    } catch (err) {
      console.error('Error al traer orden:', err);
    } finally {
      setLoading(false);
    }
  };

  // =================== RENDER FILAS ===================
  const paginated = workOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const rows = paginated.map(order => (
    <Table.Tr key={order.id}>
      <Table.Td>{order.id}</Table.Td>
      <Table.Td>{order.client}</Table.Td>
      <Table.Td>{order.vehicle}</Table.Td>
      <Table.Td>
        {order.state === 1 ? 'Pendiente' :
         order.state === 2 ? 'En proceso' :
         order.state === 3 ? 'Finalizado' : 'Sin tareas'}
      </Table.Td>
      <Table.Td>
        <ActionIcon color="blue" onClick={() => handleViewOrder(order.id)}>
          <IconEye size={16} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  // =================== RENDER PRINCIPAL ===================
  return (
    <div style={{ position: 'relative' }}>
      {/* === Overlay Global === */}
      {(loading || saving) && (
        <>
          <Overlay opacity={0.6} color="#000" blur={2} zIndex={9998} />
          <Center style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
            <Loader size="xl" color="green" />
          </Center>
        </>
      )}

      <ScrollArea>
        <Group justify="space-between" mb="sm">
          <Text fz="xl" fw={600}>Órdenes de Trabajo</Text>
          <Button color="green" onClick={openAdd}>Nueva Orden</Button>
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
          <Table.Tbody>
            {loading ? (
              <Table.Tr><Table.Td colSpan={5} align="center"><Loader /></Table.Td></Table.Tr>
            ) : rows.length > 0 ? rows : (
              <Table.Tr><Table.Td colSpan={5} align="center">No hay órdenes registradas</Table.Td></Table.Tr>
            )}
          </Table.Tbody>
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
          sx={{
            color: 'white',
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': { color: 'white' },
            '.MuiSvgIcon-root': { color: 'white' },
          }}
        />

        {/* MODAL CREAR ORDEN */}
        <Modal opened={addModalOpened} onClose={closeAdd} title="Crear nueva orden" centered size="lg">
          <Select
            label="Cliente"
            placeholder="Seleccione cliente"
            data={clients.map(c => ({ value: c.id.toString(), label: c.name }))}
            value={newOrder.idClient}
            onChange={(val) => {
              setNewOrder(prev => ({ ...prev, idClient: val, idVehicle: '' }));
              if (val) fetchVehiclesByClient(val);
            }}
          />
          <Select
            label="Vehículo"
            placeholder="Seleccione vehículo"
            data={vehicles.map(v => ({ value: v.id.toString(), label: `${v.licensePlate} - ${v.brand} ${v.model}` }))}
            value={newOrder.idVehicle}
            onChange={(val) => setNewOrder(prev => ({ ...prev, idVehicle: val }))}
            disabled={!newOrder.idClient}
          />
          <Text fw={600} mt="md">Tareas</Text>
          {newOrder.tasks.map((t, i) => (
            <Group key={i} grow>
              <Select
                label={`Tarea ${i + 1}`}
                data={tasks.map(task => ({ value: task.id.toString(), label: task.description }))}
                value={t.idTask}
                onChange={(val) => {
                  const updated = [...newOrder.tasks];
                  updated[i].idTask = val;
                  setNewOrder(prev => ({ ...prev, tasks: updated }));
                }}
              />
              <TextInput
                label="Nota"
                value={t.note}
                onChange={(e) => {
                  const updated = [...newOrder.tasks];
                  updated[i].note = e.currentTarget.value;
                  setNewOrder(prev => ({ ...prev, tasks: updated }));
                }}
              />
              {i > 0 && (
                <ActionIcon color="red" onClick={() => {
                  setNewOrder(prev => ({
                    ...prev,
                    tasks: prev.tasks.filter((_, idx) => idx !== i)
                  }));
                }}>
                  <IconTrash size={16} />
                </ActionIcon>
              )}
            </Group>
          ))}
          <Button
            leftSection={<IconPlus size={16} />}
            mt="sm"
            variant="light"
            onClick={() => setNewOrder(prev => ({ ...prev, tasks: [...prev.tasks, { idTask: '', note: '' }] }))}
          >
            Agregar tarea
          </Button>

          <Button fullWidth mt="md" color="green" onClick={handleAddOrder}>
            Guardar Orden
          </Button>
        </Modal>

        {/* MODAL VER ORDEN */}
        <Modal opened={viewModalOpened} onClose={closeView} title="Detalle de Orden" centered size="xl">
          {selectedOrder ? (
            <>
              <Text><b>Cliente:</b> {selectedOrder.client}</Text>
              <Text><b>Vehículo:</b> {selectedOrder.vehicle}</Text>
              <Text><b>Estado:</b> {selectedOrder.state}</Text>

              <Text mt="md" fw={600}>Tareas</Text>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Sector</Table.Th>
                    <Table.Th>Tarea</Table.Th>
                    <Table.Th>Estado</Table.Th>
                    <Table.Th>Nota</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {selectedOrder.tasks?.length > 0 ? selectedOrder.tasks.map((t, i) => (
                    <Table.Tr key={i}>
                      <Table.Td>{t.sectorName}</Table.Td>
                      <Table.Td>{t.taskDescription}</Table.Td>
                      <Table.Td>{t.state}</Table.Td>
                      <Table.Td>{t.note}</Table.Td>
                    </Table.Tr>
                  )) : (
                    <Table.Tr><Table.Td colSpan={4} align="center">Sin tareas</Table.Td></Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </>
          ) : (
            <Text>Cargando orden...</Text>
          )}
        </Modal>
      </ScrollArea>
    </div>
  );
}
