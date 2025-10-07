
import { useState, useEffect } from 'react';
import { clientService } from '../../services/clientService';
import { VehicleCreatorService } from '../../services/VehicleCreatorService';
import { IconChevronDown, IconChevronUp, IconSearch, IconSelector, IconPencil, IconTrash, IconEye } from '@tabler/icons-react';
import {
  Center,
  Group,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
  Modal,
  Button,
  ActionIcon
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './TableSort.module.css';
import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';

// =================== Helpers ===================
function Th({ children, reversed, sorted, onSort }) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">{children}</Text>
          <Center className={classes.icon}><Icon size={16} stroke={1.5} /></Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data, search) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(query)
    )
  );
}

function sortData(data, payload) {
  const { sortBy, reversed, search } = payload;
  if (!sortBy) return filterData(data, search);

  return filterData(
    [...data].sort((a, b) => {
      const aValue = a[sortBy] ?? '';
      const bValue = b[sortBy] ?? '';
      if (reversed) return bValue.toString().localeCompare(aValue.toString());
      return aValue.toString().localeCompare(bValue.toString());
    }),
    search
  );
}

export function CircularIndeterminate() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
      <CircularProgress color="inherit" />
    </Box>
  );
}

// =================== Componente principal ===================
export function TableSort() {
  // =================== Estados ===================
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [addModalOpened, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
  const [viewModalOpened, { open: openViewModal, close: closeViewModal }] = useDisclosure(false);
  const [addVehicleModalOpened, { open: openAddVehicleModal, close: closeAddVehicleModal }] = useDisclosure(false);

  const [clientToEdit, setClientToEdit] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  const [search, setSearch] = useState('');
  const [clients, setClients] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [newClient, setNewClient] = useState({
    name: '', email: '', cuitCuil: '', phone: '', address: '', city: '', province: ''
  });

  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    licensePlate: '', brand: '', model: '', year: ''
  });

  // =================== Fetch clientes ===================
  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await clientService.getAllClients();
      if (response.status === 200) {
        setClients(response.data);
        setSortedData(sortData(response.data, { sortBy, reversed: reverseSortDirection, search }));
      } else {
        setClients([]);
        setSortedData([]);
      }
    } catch (err) {
      console.error('Error al traer clientes:', err);
      setClients([]);
      setSortedData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClients(); }, []);

  // =================== Ordenamiento ===================
  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(clients, { sortBy: field, reversed, search }));
    setPage(0);
  };

  // =================== Búsqueda ===================
  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(clients, { sortBy, reversed: reverseSortDirection, search: value }));
    setPage(0);
  };

  // =================== Formulario agregar cliente ===================
  const handleNewClientChange = (event) => {
    const { name, value } = event.currentTarget;
    setNewClient((prev) => ({ ...prev, [name]: value }));
  };

  // =================== Formulario agregar vehículo ===================
  const handleNewVehicleChange = (event) => {
    const { name, value } = event.currentTarget;
    setNewVehicle(prev => ({ ...prev, [name]: value }));
  };

  const handleAddVehicle = async () => {
    if (!selectedClient) return;
    try {
      const payload = { ...newVehicle, clientId: selectedClient.id };
      const response = await VehicleCreatorService.create(payload);
      if (response.status === 201 || response.status === 200) {
        await fetchVehiclesByClient(selectedClient.id);
        setNewVehicle({ licensePlate: '', brand: '', model: '', year: '' });
        closeAddVehicleModal();
      }
    } catch (err) {
      console.error('Error al agregar vehículo:', err);
    }
  };

  // =================== Paginación ===================
  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // =================== Filas ===================
  const rows = paginatedData.map((row) => (
    <Table.Tr key={row.id}>
      <Table.Td>{row.name}</Table.Td>
      <Table.Td>{row.email}</Table.Td>
      <Table.Td>{row.cuitCuil}</Table.Td>
      <Table.Td>{row.phone}</Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end">
          <ActionIcon variant="subtle" color="gray" onClick={() => handleOpenViewClientModal(row)}>
            <IconEye size={16} stroke={1.5} />
          </ActionIcon>

          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => {
              setClientToEdit(row);
              openEditModal();
            }}
          >
            <IconPencil size={16} stroke={1.5} />
          </ActionIcon>

          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => {
              setClientToDelete(row);
              openDeleteModal();
            }}
          >
            <IconTrash size={16} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  // =================== Funciones de acciones ===================
  const handleAddClient = async () => {
    setIsSaving(true);
    try {
      const payload = { ...newClient };
      const response = await clientService.createClient(payload);
      if (response.status === 201 || response.status === 200) {
        await fetchClients();
        setNewClient({ name: '', email: '', cuitCuil: '', phone: '', address: '', city: '', province: '' });
        closeAddModal();
      }
    } catch (err) {
      console.error('Error al agregar cliente:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClient = async () => {
    if (!clientToEdit) return;
    setIsEditing(true);
    try {
      const payload = {
        name: clientToEdit.name,
        cuitCuil: clientToEdit.cuitCuil,
        address: clientToEdit.address,
        city: clientToEdit.city,
        province: clientToEdit.province,
        email: clientToEdit.email,
        phone: clientToEdit.phone
      };
      const response = await clientService.updateClient(clientToEdit.id, payload);
      if (response.status === 200) {
        await fetchClients();
        closeEditModal();
      }
    } catch (err) {
      console.error('Error al actualizar cliente:', err);
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;
    setIsDeleting(true);
    try {
      const response = await clientService.deleteClient(clientToDelete.id);
      if (response.status === 200 || response.status === 204) {
        await fetchClients();
        closeDeleteModal();
      }
    } catch (err) {
      console.error('Error al eliminar cliente:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // =================== VEHÍCULOS ===================
  const fetchVehiclesByClient = async (clientId) => {
    setLoadingVehicles(true);
    try {
      const response = await VehicleCreatorService.getAllByClient(clientId);
      if (response.status === 200) {
        setVehicles(response.data);
      } else {
        setVehicles([]);
      }
    } catch (err) {
      console.error("Error al cargar vehículos:", err);
      setVehicles([]);
    } finally {
      setLoadingVehicles(false);
    }
  };

  const handleOpenViewClientModal = (client) => {
    setSelectedClient(client);
    fetchVehiclesByClient(client.id);
    openViewModal();
  };

  // =================== Render ===================
  return (
    <ScrollArea>
      <Group justify="space-between" mb="sm">
        <TextInput
          placeholder="Buscar Cliente"
          leftSection={<IconSearch size={16} stroke={1.5} />}
          value={search}
          onChange={handleSearchChange}
          style={{ width: '300px' }}
        />
        <Group>
          <Button variant="filled" color="green" onClick={openAddModal}>Agregar Cliente</Button>
          <Button
            variant="filled"
            color="blue"
            onClick={() => {
              if (!selectedClient) {
                alert("Primero selecciona un cliente para agregar un vehículo.");
                return;
              }
              openAddVehicleModal();
            }}
          >
            Agregar Vehículo
          </Button>
        </Group>
      </Group>

      {/* Tabla de clientes */}
      <Table horizontalSpacing="lg" verticalSpacing="xs" miw={700} layout="fixed">
        <Table.Thead>
          <Table.Tr>
            <Th sorted={sortBy === 'name'} reversed={reverseSortDirection} onSort={() => setSorting('name')}>Nombre</Th>
            <Th sorted={sortBy === 'email'} reversed={reverseSortDirection} onSort={() => setSorting('email')}>Email</Th>
            <Th sorted={sortBy === 'cuitCuil'} reversed={reverseSortDirection} onSort={() => setSorting('cuitCuil')}>CUIT / CUIL</Th>
            <Th sorted={sortBy === 'phone'} reversed={reverseSortDirection} onSort={() => setSorting('phone')}>Teléfono</Th>
            <Table.Th>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.Tr><Table.Td colSpan={5}><CircularIndeterminate /></Table.Td></Table.Tr>
          ) : rows.length > 0 ? rows : (
            <Table.Tr><Table.Td colSpan={5}><Text fw={500} ta="center">No se encontraron clientes</Text></Table.Td></Table.Tr>
          )}
        </Table.Tbody>
      </Table>

      {/* Paginación */}
      <TablePagination
        component="div"
        count={sortedData.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        sx={{
          color: 'white',
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': { color: 'white' },
          '.MuiSvgIcon-root': { color: 'white' },
        }}
      />

      {/* Modal Ver Cliente */}
      <Modal opened={viewModalOpened} onClose={closeViewModal} title="Detalles del Cliente" centered size="xl">
        {selectedClient ? (
          <>
            <Text><b>Nombre:</b> {selectedClient.name}</Text>
            <Text><b>Email:</b> {selectedClient.email}</Text>
            <Text><b>CUIT/CUIL:</b> {selectedClient.cuitCuil}</Text>
            <Text><b>Teléfono:</b> {selectedClient.phone}</Text>
            <Text><b>Dirección:</b> {selectedClient.address}, {selectedClient.city}, {selectedClient.province}</Text>
            <Text><b>Creado:</b> {new Date(selectedClient.createdAt?.date).toLocaleDateString("es-AR")}</Text>

            <Text mt="md" fw={600}>Vehículos del cliente:</Text>
            {loadingVehicles ? (
              <CircularIndeterminate />
            ) : vehicles.length > 0 ? (
              <Table horizontalSpacing="lg" verticalSpacing="xs" miw={500} layout="fixed">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Patente</Table.Th>
                    <Table.Th>Marca</Table.Th>
                    <Table.Th>Modelo</Table.Th>
                    <Table.Th>Año</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {vehicles.map(v => (
                    <Table.Tr key={v.id}>
                      <Table.Td>{v.licensePlate}</Table.Td>
                      <Table.Td>{v.brand}</Table.Td>
                      <Table.Td>{v.model}</Table.Td>
                      <Table.Td>{v.year}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            ) : (
              <Text>No tiene vehículos registrados.</Text>
            )}
          </>
        ) : (
          <Text>No hay cliente seleccionado</Text>
        )}
      </Modal>

      {/* Modal Agregar Vehículo */}
      <Modal opened={addVehicleModalOpened} onClose={closeAddVehicleModal} title={`Agregar Vehículo a ${selectedClient?.name}`} centered size="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextInput label="Patente" name="licensePlate" value={newVehicle.licensePlate} onChange={handleNewVehicleChange} />
          <TextInput label="Marca" name="brand" value={newVehicle.brand} onChange={handleNewVehicleChange} />
          <TextInput label="Modelo" name="model" value={newVehicle.model} onChange={handleNewVehicleChange} />
          <TextInput label="Año" name="year" type="number" value={newVehicle.year} onChange={handleNewVehicleChange} />
          <Button color="blue" onClick={handleAddVehicle}>Guardar Vehículo</Button>
        </div>
      </Modal>

      {/* Los modales de agregar, editar y eliminar cliente se mantienen iguales */}
      {/* Agregar Cliente */}
      <Modal opened={addModalOpened} onClose={closeAddModal} title="Agregar Cliente" centered size="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextInput label="Nombre" name="name" value={newClient.name} onChange={handleNewClientChange} />
          <TextInput label="Email" name="email" value={newClient.email} onChange={handleNewClientChange} />
          <TextInput label="CUIT/CUIL" name="cuitCuil" value={newClient.cuitCuil} onChange={handleNewClientChange} />
          <TextInput label="Teléfono" name="phone" value={newClient.phone} onChange={handleNewClientChange} />
          <TextInput label="Dirección" name="address" value={newClient.address} onChange={handleNewClientChange} />
          <TextInput label="Ciudad" name="city" value={newClient.city} onChange={handleNewClientChange} />
          <TextInput label="Provincia" name="province" value={newClient.province} onChange={handleNewClientChange} />
          <Button color="green" onClick={handleAddClient} loading={isSaving}>Guardar Cliente</Button>
        </div>
      </Modal>

      {/* Editar Cliente */}
      <Modal opened={editModalOpened} onClose={closeEditModal} title="Editar Cliente" centered size="md">
        {clientToEdit && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <TextInput label="Nombre" name="name" value={clientToEdit.name} onChange={(e) => setClientToEdit({...clientToEdit, name: e.currentTarget.value})} />
            <TextInput label="Email" name="email" value={clientToEdit.email} onChange={(e) => setClientToEdit({...clientToEdit, email: e.currentTarget.value})} />
            <TextInput label="CUIT/CUIL" name="cuitCuil" value={clientToEdit.cuitCuil} onChange={(e) => setClientToEdit({...clientToEdit, cuitCuil: e.currentTarget.value})} />
            <TextInput label="Teléfono" name="phone" value={clientToEdit.phone} onChange={(e) => setClientToEdit({...clientToEdit, phone: e.currentTarget.value})} />
            <TextInput label="Dirección" name="address" value={clientToEdit.address} onChange={(e) => setClientToEdit({...clientToEdit, address: e.currentTarget.value})} />
            <TextInput label="Ciudad" name="city" value={clientToEdit.city} onChange={(e) => setClientToEdit({...clientToEdit, city: e.currentTarget.value})} />
            <TextInput label="Provincia" name="province" value={clientToEdit.province} onChange={(e) => setClientToEdit({...clientToEdit, province: e.currentTarget.value})} />
            <Button color="blue" onClick={handleEditClient} loading={isEditing}>Actualizar Cliente</Button>
          </div>
        )}
      </Modal>

      {/* Eliminar Cliente */}
      <Modal opened={deleteModalOpened} onClose={closeDeleteModal} title="Eliminar Cliente" centered size="sm">
        <Text>¿Estás seguro que deseas eliminar a {clientToDelete?.name}?</Text>
        <Group position="apart" mt="md">
          <Button color="red" onClick={handleDeleteClient} loading={isDeleting}>Eliminar</Button>
          <Button variant="outline" onClick={closeDeleteModal}>Cancelar</Button>
        </Group>
      </Modal>
    </ScrollArea>
  );
}

