// import { useState, useEffect } from 'react';
// import {
//   Table, Text, Group, Button, Modal, Select, TextInput, ScrollArea, ActionIcon
// } from '@mantine/core';
// import { IconPlus, IconTrash, IconSearch, IconEye } from '@tabler/icons-react';
// import { useDisclosure } from '@mantine/hooks';
// import Box from '@mui/material/Box';
// import CircularProgress from '@mui/material/CircularProgress';
// import TablePagination from '@mui/material/TablePagination';

// // Servicios
// import { WorkOrderCreatorService } from '../../services/WorkOrderCreatorService';
// import { ClientCreatorService } from '../../services/ClientCreatorService';
// import { VehicleCreatorService } from '../../services/VehicleCreatorService';
// import { TaskService } from '../../services/TaskService';

// export function WorkOrdersTable() {
//   const [loading, setLoading] = useState(false);
//   const [workOrders, setWorkOrders] = useState([]);
//   const [clients, setClients] = useState([]);
//   const [vehicles, setVehicles] = useState([]);
//   const [tasks, setTasks] = useState([]);

//   const [addModalOpened, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
//   const [viewModalOpened, { open: openViewModal, close: closeViewModal }] = useDisclosure(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   const [newOrder, setNewOrder] = useState({
//     clientId: '',
//     vehicleId: '',
//     tasks: [{ taskId: '', notes: '' }]
//   });

//   const [isSaving, setIsSaving] = useState(false);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   // =================== Helpers ===================
//   const CircularIndeterminate = () => (
//     <Box sx={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
//       <CircularProgress color="inherit" />
//     </Box>
//   );

//   // =================== Fetch ===================
//   const fetchWorkOrders = async () => {
//     setLoading(true);
//     try {
//       const response = await WorkOrderCreatorService.getAll();
//       console.log("💡 Respuesta raw WorkOrders:", response.data);

//       if (response.status === 200 && Array.isArray(response.data)) {
//         setWorkOrders(response.data);
//       } else {
//         console.error("💥 Respuesta inesperada de WorkOrders:", response.data);
//         setWorkOrders([]);
//       }
//     } catch (err) {
//       console.error('Error al traer órdenes de trabajo:', err);
//       setWorkOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchClients = async () => {
//     try {
//       const res = await ClientCreatorService.getAll();
//       console.log("💡 Clientes raw:", res.data);
//       if (res.status === 200 && Array.isArray(res.data)) setClients(res.data);
//       else setClients([]);
//     } catch (err) {
//       console.error('Error al traer clientes:', err);
//       setClients([]);
//     }
//   };

//   const fetchVehiclesByClient = async (clientId) => {
//     try {
//       const res = await VehicleCreatorService.getAllByClient(clientId);
//       console.log(`💡 Vehículos raw cliente ${clientId}:`, res.data);
//       if (res.status === 200 && Array.isArray(res.data)) setVehicles(res.data);
//       else setVehicles([]);
//     } catch (err) {
//       console.error('Error al traer vehículos:', err);
//       setVehicles([]);
//     }
//   };

//   const fetchTasks = async () => {
//     try {
//       const res = await TaskService.getAll();
//       console.log("💡 Tareas raw:", res.data);
//       if (res.status === 200 && Array.isArray(res.data)) setTasks(res.data);
//       else setTasks([]);
//     } catch (err) {
//       console.error('Error al traer tareas:', err);
//       setTasks([]);
//     }
//   };

//   useEffect(() => {
//     fetchWorkOrders();
//     fetchClients();
//     fetchTasks();
//   }, []);

//   // =================== Manejo del modal ===================
//   const handleClientChange = (value) => {
//     setNewOrder(prev => ({ ...prev, clientId: value, vehicleId: '' }));
//     fetchVehiclesByClient(value);
//   };

//   const handleVehicleChange = (value) => {
//     setNewOrder(prev => ({ ...prev, vehicleId: value }));
//   };

//   const handleTaskChange = (index, field, value) => {
//     const updatedTasks = [...newOrder.tasks];
//     updatedTasks[index][field] = value;
//     setNewOrder(prev => ({ ...prev, tasks: updatedTasks }));
//   };

//   const addTaskRow = () => {
//     setNewOrder(prev => ({ ...prev, tasks: [...prev.tasks, { taskId: '', notes: '' }] }));
//   };

//   const removeTaskRow = (index) => {
//     setNewOrder(prev => ({
//       ...prev,
//       tasks: prev.tasks.filter((_, i) => i !== index)
//     }));
//   };

//   const handleAddOrder = async () => {
//     setIsSaving(true);
//     try {
//       const response = await WorkOrderCreatorService.create(newOrder);
//       if (response.status === 201 || response.status === 200) {
//         await fetchWorkOrders();
//         closeAddModal();
//         setNewOrder({ clientId: '', vehicleId: '', tasks: [{ taskId: '', notes: '' }] });
//       }
//     } catch (err) {
//       console.error('Error al crear orden de trabajo:', err);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleViewOrder = (order) => {
//     setSelectedOrder(order);
//     openViewModal();
//   };

//   // =================== Render filas ===================
//   const paginatedData = Array.isArray(workOrders)
//     ? workOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//     : [];

//   console.log("💡 paginatedData:", paginatedData);

//   const rows = Array.isArray(paginatedData) && paginatedData.length > 0
//     ? paginatedData.map((row) => (
//         <Table.Tr key={row.id}>
//           <Table.Td>{row.id}</Table.Td>
//           <Table.Td>{row.client?.name}</Table.Td>
//           <Table.Td>{row.vehicle?.licensePlate}</Table.Td>
//           <Table.Td>{row.createdAt ? new Date(row.createdAt.date || row.createdAt).toLocaleDateString('es-AR') : ''}</Table.Td>
//           <Table.Td>{row.status}</Table.Td>
//           <Table.Td>
//             <ActionIcon color="blue" onClick={() => handleViewOrder(row)}>
//               <IconEye size={16} />
//             </ActionIcon>
//           </Table.Td>
//         </Table.Tr>
//       ))
//     : [];

//   // =================== Render principal ===================
//   return (
//     <ScrollArea>
//       <Group justify="space-between" mb="sm">
//         <Text fz="xl" fw={600}>Órdenes de Trabajo</Text>
//         <Button onClick={openAddModal} color="green">Agregar Orden</Button>
//       </Group>

//       <Table horizontalSpacing="lg" verticalSpacing="xs" miw={700} layout="fixed">
//         <Table.Thead>
//           <Table.Tr>
//             <Table.Th>ID</Table.Th>
//             <Table.Th>Cliente</Table.Th>
//             <Table.Th>Vehículo</Table.Th>
//             <Table.Th>Fecha</Table.Th>
//             <Table.Th>Estado</Table.Th>
//             <Table.Th>Acciones</Table.Th>
//           </Table.Tr>
//         </Table.Thead>
//         <Table.Tbody>
//           {loading ? (
//             <Table.Tr><Table.Td colSpan={6}><CircularIndeterminate /></Table.Td></Table.Tr>
//           ) : rows.length > 0 ? rows : (
//             <Table.Tr><Table.Td colSpan={6} style={{ textAlign: "center" }}>
//               No hay órdenes registradas.
//             </Table.Td></Table.Tr>
//           )}
//         </Table.Tbody>
//       </Table>

//       <TablePagination
//         component="div"
//         count={Array.isArray(workOrders) ? workOrders.length : 0}
//         page={page}
//         onPageChange={(e, newPage) => setPage(newPage)}
//         rowsPerPage={rowsPerPage}
//         onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
//         sx={{
//           color: 'white',
//           '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': { color: 'white' },
//           '.MuiSvgIcon-root': { color: 'white' },
//         }}
//       />

//       {/* Modal Agregar Orden */}
//       <Modal opened={addModalOpened} onClose={closeAddModal} title="Agregar Orden de Trabajo" centered size="lg">
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//           <Select
//             label="Cliente"
//             placeholder="Seleccionar cliente"
//             searchable
//             data={clients.map(c => ({ value: c.id.toString(), label: c.name }))}
//             value={newOrder.clientId}
//             onChange={handleClientChange}
//           />

//           <Select
//             label="Vehículo"
//             placeholder="Seleccionar vehículo"
//             searchable
//             disabled={!newOrder.clientId}
//             data={vehicles.map(v => ({ value: v.id.toString(), label: `${v.licensePlate} - ${v.brand} ${v.model}` }))}
//             value={newOrder.vehicleId}
//             onChange={handleVehicleChange}
//           />

//           <Text fw={600} mt="md">Tareas</Text>
//           {newOrder.tasks.map((task, index) => (
//             <Group key={index} grow>
//               <Select
//                 label={`Tarea ${index + 1}`}
//                 placeholder="Seleccionar tarea"
//                 data={tasks.map(t => ({ value: t.id.toString(), label: t.name }))}
//                 value={task.taskId}
//                 onChange={(value) => handleTaskChange(index, 'taskId', value)}
//               />
//               <TextInput
//                 label="Notas"
//                 value={task.notes}
//                 onChange={(e) => handleTaskChange(index, 'notes', e.currentTarget.value)}
//               />
//               {index > 0 && (
//                 <ActionIcon color="red" variant="light" onClick={() => removeTaskRow(index)}>
//                   <IconTrash size={16} />
//                 </ActionIcon>
//               )}
//             </Group>
//           ))}
//           <Button
//             leftSection={<IconPlus size={16} />}
//             variant="light"
//             color="blue"
//             onClick={addTaskRow}
//           >
//             Agregar tarea
//           </Button>

//           <Button color="green" onClick={handleAddOrder} loading={isSaving}>
//             Guardar Orden
//           </Button>
//         </div>
//       </Modal>

//       {/* Modal Ver Orden */}
//       <Modal opened={viewModalOpened} onClose={closeViewModal} title="Detalles de la Orden" centered size="xl">
//         {selectedOrder ? (
//           <>
//             <Text><b>ID:</b> {selectedOrder.id}</Text>
//             <Text><b>Cliente:</b> {selectedOrder.client?.name}</Text>
//             <Text><b>Vehículo:</b> {selectedOrder.vehicle?.licensePlate}</Text>
//             <Text><b>Fecha:</b> {selectedOrder.createdAt ? new Date(selectedOrder.createdAt.date || selectedOrder.createdAt).toLocaleDateString('es-AR') : ''}</Text>
//             <Text><b>Estado:</b> {selectedOrder.status}</Text>

//             <Text mt="md" fw={600}>Tareas:</Text>
//             <Table>
//               <Table.Thead>
//                 <Table.Tr>
//                   <Table.Th>Tarea</Table.Th>
//                   <Table.Th>Notas</Table.Th>
//                 </Table.Tr>
//               </Table.Thead>
//               <Table.Tbody>
//                 {Array.isArray(selectedOrder.tasks) && selectedOrder.tasks.length > 0 ? selectedOrder.tasks.map((t, i) => (
//                   <Table.Tr key={i}>
//                     <Table.Td>{t.task?.name}</Table.Td>
//                     <Table.Td>{t.notes}</Table.Td>
//                   </Table.Tr>
//                 )) : (
//                   <Table.Tr><Table.Td colSpan={2} style={{ textAlign: "center" }}>No hay tareas asignadas.</Table.Td></Table.Tr>
//                 )}
//               </Table.Tbody>
//             </Table>
//           </>
//         ) : (
//           <Text>No hay orden seleccionada.</Text>
//         )}
//       </Modal>
//     </ScrollArea>
//   );
// }

// export default WorkOrdersTable;
import { useState, useEffect } from 'react';
import {
  Table, Text, Group, Button, Modal, Select, TextInput, ScrollArea, ActionIcon
} from '@mantine/core';
import { IconPlus, IconTrash, IconEye } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import TablePagination from '@mui/material/TablePagination';

import { WorkOrderCreatorService } from '../../services/WorkOrderCreatorService';
import { ClientCreatorService } from '../../services/ClientCreatorService';
import { VehicleCreatorService } from '../../services/VehicleCreatorService';
import { TaskService } from '../../services/TaskService';
import { OrderTaskService } from '../../services/OrderTaskService';

export function WorkOrdersTable() {
  const [loading, setLoading] = useState(false);
  const [workOrders, setWorkOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [orderTasks, setOrderTasks] = useState([]);

  const [addModalOpened, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
  const [viewModalOpened, { open: openViewModal, close: closeViewModal }] = useDisclosure(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [newOrder, setNewOrder] = useState({
    clientId: '',
    vehicleId: '',
    tasks: [{ taskId: '', notes: '' }]
  });

  const [isSaving, setIsSaving] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const CircularIndeterminate = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
      <CircularProgress color="inherit" />
    </Box>
  );

  // =================== Fetch ===================
  const fetchClients = async () => {
    try {
      const res = await ClientCreatorService.getAll();
      setClients(res.data || []);
    } catch { setClients([]); }
  };

  const fetchVehiclesByClient = async (clientId) => {
    try {
      const res = await VehicleCreatorService.getAllByClient(clientId);
      setVehicles(res.data || []);
    } catch { setVehicles([]); }
  };

  const fetchTasks = async () => {
    try {
      const res = await TaskService.getAll();
      setTasks(res.data || []);
    } catch { setTasks([]); }
  };

  const fetchOrderTasks = async () => {
    try {
      const res = await OrderTaskService.getAll();
      setOrderTasks(res.data || []);
    } catch { setOrderTasks([]); }
  };

  const fetchWorkOrders = async () => {
    setLoading(true);
    try {
      const res = await WorkOrderCreatorService.getAll();
      const ordersRaw = res.data || [];

      const ordersMapped = ordersRaw.map(order => {
        const client = clients.find(c => c.id === order.idClient) || { name: 'Desconocido' };
        const vehicle = vehicles.find(v => v.id === order.idVehicle) || { licensePlate: 'Desconocido' };

        const orderTaskItems = orderTasks
          .filter(ot => ot.idOrder === order.id)
          .map(ot => {
            const task = tasks.find(t => t.id === ot.idTask) || { description: 'Desconocida' };
            return { ...ot, taskName: task.description };
          });

        return {
          ...order,
          client,
          vehicle,
          tasks: orderTaskItems
        };
      });

      setWorkOrders(ordersMapped);
    } catch (err) {
      console.error('Error al traer órdenes de trabajo:', err);
      setWorkOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchClients();
      await fetchTasks();
      await fetchOrderTasks();
      await fetchWorkOrders();
    };
    loadData();
  }, []);

  // =================== Modal Ver Orden ===================
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    openViewModal();
  };

  // =================== Modal Agregar Orden ===================
  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...newOrder.tasks];
    updatedTasks[index][field] = value;
    setNewOrder(prev => ({ ...prev, tasks: updatedTasks }));
  };

  const addTaskRow = () => {
    setNewOrder(prev => ({ ...prev, tasks: [...prev.tasks, { taskId: '', notes: '' }] }));
  };

  const removeTaskRow = (index) => {
    setNewOrder(prev => ({ ...prev, tasks: prev.tasks.filter((_, i) => i !== index) }));
  };

  const handleAddOrder = async () => {
    setIsSaving(true);
    try {
      const payload = {
        idClient: newOrder.clientId,
        idVehicle: newOrder.vehicleId,
        tasks: newOrder.tasks.map(t => ({ idTask: t.taskId, notes: t.notes }))
      };
      await WorkOrderCreatorService.create(payload);
      await fetchWorkOrders();
      closeAddModal();
      setNewOrder({ clientId: '', vehicleId: '', tasks: [{ taskId: '', notes: '' }] });
    } catch (err) {
      console.error('Error al crear orden de trabajo:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // =================== Render filas ===================
  const paginatedData = workOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const rows = paginatedData.length > 0
    ? paginatedData.map(row => (
        <Table.Tr key={row.id}>
          <Table.Td>{row.id}</Table.Td>
          <Table.Td>{row.client.name}</Table.Td>
          <Table.Td>{row.vehicle.licensePlate}</Table.Td>
          <Table.Td>{row.tasks.map(t => t.taskName).join(', ')}</Table.Td>
          <Table.Td>
            <ActionIcon color="blue" onClick={() => handleViewOrder(row)}>
              <IconEye size={16} />
            </ActionIcon>
          </Table.Td>
        </Table.Tr>
      ))
    : [];

  // =================== Render principal ===================
  return (
    <ScrollArea>
      <Group justify="space-between" mb="sm">
        <Text fz="xl" fw={600}>Órdenes de Trabajo</Text>
        <Button onClick={openAddModal} color="green">Agregar Orden</Button>
      </Group>

      <Table horizontalSpacing="lg" verticalSpacing="xs" miw={700} layout="fixed">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Cliente</Table.Th>
            <Table.Th>Vehículo</Table.Th>
            <Table.Th>Tareas</Table.Th>
            <Table.Th>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.Tr><Table.Td colSpan={5}><CircularIndeterminate /></Table.Td></Table.Tr>
          ) : rows.length > 0 ? rows : (
            <Table.Tr><Table.Td colSpan={5} style={{ textAlign: 'center' }}>No hay órdenes registradas.</Table.Td></Table.Tr>
          )}
        </Table.Tbody>
      </Table>

      <TablePagination
        component="div"
        count={workOrders.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        sx={{ color: 'white', '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': { color: 'white' }, '.MuiSvgIcon-root': { color: 'white' } }}
      />

      {/* =================== Modal Agregar Orden =================== */}
      <Modal opened={addModalOpened} onClose={closeAddModal} title="Agregar Orden de Trabajo" centered size="lg">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Select
            label="Cliente"
            placeholder="Seleccionar cliente"
            searchable
            data={clients.map(c => ({ value: c.id.toString(), label: c.name }))}
            value={newOrder.clientId}
            onChange={(value) => {
              setNewOrder(prev => ({ ...prev, clientId: value, vehicleId: '' }));
              if (value) fetchVehiclesByClient(value);
            }}
          />

          <Select
            label="Vehículo"
            placeholder="Seleccionar vehículo"
            searchable
            disabled={!newOrder.clientId}
            data={vehicles.map(v => ({ value: v.id.toString(), label: `${v.licensePlate} - ${v.brand} ${v.model}` }))}
            value={newOrder.vehicleId}
            onChange={(value) => setNewOrder(prev => ({ ...prev, vehicleId: value }))}
          />

          <Text fw={600} mt="md">Tareas</Text>
          {newOrder.tasks.map((task, index) => (
            <Group key={index} grow>
              <Select
                label={`Tarea ${index + 1}`}
                placeholder="Seleccionar tarea"
                data={tasks.map(t => ({ value: t.id.toString(), label: t.description }))}
                value={task.taskId}
                onChange={(value) => handleTaskChange(index, 'taskId', value)}
              />
              <TextInput
                label="Notas"
                value={task.notes}
                onChange={(e) => handleTaskChange(index, 'notes', e.currentTarget.value)}
              />
              {index > 0 && (
                <ActionIcon color="red" variant="light" onClick={() => removeTaskRow(index)}>
                  <IconTrash size={16} />
                </ActionIcon>
              )}
            </Group>
          ))}

          <Button leftSection={<IconPlus size={16} />} variant="light" color="blue" onClick={addTaskRow}>
            Agregar tarea
          </Button>

          <Button color="green" onClick={handleAddOrder} loading={isSaving}>
            Guardar Orden
          </Button>
        </div>
      </Modal>

      {/* =================== Modal Ver Orden =================== */}
      <Modal opened={viewModalOpened} onClose={closeViewModal} title="Detalles de la Orden" centered size="xl">
        {selectedOrder ? (
          <>
            <Text><b>ID:</b> {selectedOrder.id}</Text>
            <Text><b>Cliente:</b> {selectedOrder.client.name}</Text>
            <Text><b>Vehículo:</b> {selectedOrder.vehicle.licensePlate}</Text>

            <Text mt="md" fw={600}>Tareas:</Text>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Tarea</Table.Th>
                  <Table.Th>Notas</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {selectedOrder.tasks.length > 0 ? selectedOrder.tasks.map((t, i) => (
                  <Table.Tr key={i}>
                    <Table.Td>{t.taskName}</Table.Td>
                    <Table.Td>{t.notes}</Table.Td>
                  </Table.Tr>
                )) : (
                  <Table.Tr><Table.Td colSpan={2} style={{ textAlign: 'center' }}>No hay tareas asignadas.</Table.Td></Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </>
        ) : (
          <Text>No hay orden seleccionada.</Text>
        )}
      </Modal>
    </ScrollArea>
  );
}

export default WorkOrdersTable;
