import { useState, useEffect } from 'react';
import { clientService } from '../../services/clientService';
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
  Badge,
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

  // =================== Estados nuevos ===================


  const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

  const [clientToEdit, setClientToEdit] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);


  const [search, setSearch] = useState('');
  const [clients, setClients] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [opened, { open, close }] = useDisclosure(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [addModalOpened, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
  const [newClient, setNewClient] = useState({
    name: '', email: '', cuitCuil: '', phone: '', address: '', city: '', province: ''
  });

  const [loading, setLoading] = useState(false);

  // =================== Fetch clientes ===================
  useEffect(() => {
    async function fetchClients() {
      setLoading(true);
      try {
        const response = await clientService.getAllClients();
        if (response.status === 200) {
          setClients(response.data);
          setSortedData(response.data);
        } else {
          setClients([]);
          setSortedData([]);
        }
      } catch (error) {
        console.error('Error al traer clientes:', error);
        setClients([]);
        setSortedData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchClients();
  }, []);

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
          <ActionIcon variant="subtle" color="gray" onClick={() => { setSelectedClient(row); open(); }}>
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



  // =================== Formulario agregar cliente ===================
  const handleNewClientChange = (event) => {
    const { name, value } = event.currentTarget;
    setNewClient((prev) => ({ ...prev, [name]: value }));
  };


  const handleAddClient = async () => {
    try {
      const payload = {
        name: newClient.name,
        email: newClient.email,
        cuitCuil: newClient.cuitCuil,
        phone: newClient.phone,
        address: newClient.address,
        city: newClient.city,
        province: newClient.province,
        createdBy: "frontend-user",
        modifiedBy: "frontend-user"
      };
      console.log("Payload:", payload)
      const response = await clientService.createClient(payload);

      console.log("Response agregar cliente:", response);

      if (response.status === 201) {
        const updatedClients = [...clients, response.data];
        setClients(updatedClients);
        setSortedData(sortData(updatedClients, { sortBy, reversed: reverseSortDirection, search }));
        closeAddModal();
        setNewClient({ name: '', email: '', cuitCuil: '', phone: '', address: '', city: '', province: '' });
      }
    } catch (error) {
      console.error('Error al agregar cliente:', error);
    }
  };




  return (
    <ScrollArea>



      <Group justify="space-between" mb="sm">
        <TextInput
          placeholder="Buscar Cliente"
          leftSection={<IconSearch size={16} stroke={1.5} />}
          value={search}
          onChange={handleSearchChange}
          style={{ width: '300px' }} // Puedes ajustar este valor
        />

        <Button variant="filled" color="green" onClick={openAddModal}>
          Agregar Cliente
        </Button>
      </Group>
      {/* Tabla */}
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
            <Table.Tr>
              <Table.Td colSpan={5}><CircularIndeterminate /></Table.Td>
            </Table.Tr>
          ) : rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={5}><Text fw={500} ta="center">No se encontraron clientes</Text></Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>

      {/* Paginación */}
      <TablePagination
        component="div"
        count={sortedData.length}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        sx={{
          color: 'white',
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': { color: 'white' },
          '.MuiSvgIcon-root': { color: 'white' },
        }}
      />

      {/* Modal Ver Más */}
      <Modal opened={opened} onClose={close} title="Detalles del Cliente" centered size="xxl" withinPortal
        styles={{

          content: { width: '50%', height: '50%', overflowY: 'scroll' },
          header: { justifyContent: 'center' },
        }}
      >
        {selectedClient ? (
          <>
            <Text><b>Nombre:</b> {selectedClient.name}</Text>
            <Text><b>Email:</b> {selectedClient.email}</Text>
            <Text><b>CUIT/CUIL:</b> {selectedClient.cuitCuil}</Text>
            <Text><b>Teléfono:</b> {selectedClient.phone}</Text>
            <Text><b>Creado Por:</b> {selectedClient.createdBy}</Text>
            <Text>
              <b>Creado:</b> {new Date(selectedClient.createdAt?.date).toLocaleDateString("es-AR", {
                day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
              })}
            </Text>
            <Text><b>Dirección:</b> {selectedClient.address}, {selectedClient.city}, {selectedClient.province}</Text>
          </>
        ) : <Text>No hay cliente seleccionado</Text>}
      </Modal>


      {/* Modal Agregar Cliente */}
      <Modal
        opened={addModalOpened}
        onClose={closeAddModal}
        title="Agregar Nuevo Cliente"
        size="xl"
        centered
        withinPortal
        overflow="inside"
        styles={{
          header: { justifyContent: 'center' },
          content: { maxHeight: '80vh' } // scroll si es muy alto
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Primera fila: Nombre y Email */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <TextInput
              label="Nombre"
              name="name"
              value={newClient.name}
              onChange={handleNewClientChange}
              style={{ flex: 1 }}
            />
            <TextInput
              label="Email"
              name="email"
              value={newClient.email}
              onChange={handleNewClientChange}
              style={{ flex: 1 }}
            />
          </div>

          {/* Segunda fila: CUIT/CUIL y Teléfono */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <TextInput
              label="CUIT/CUIL"
              name="cuitCuil"
              value={newClient.cuitCuil}
              onChange={handleNewClientChange}
              style={{ flex: 1 }}
            />
            <TextInput
              label="Teléfono"
              name="phone"
              value={newClient.phone}
              onChange={handleNewClientChange}
              style={{ flex: 1 }}
            />
          </div>

          {/* Tercera fila: Dirección y Ciudad */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <TextInput
              label="Dirección"
              name="address"
              value={newClient.address}
              onChange={handleNewClientChange}
              style={{ flex: 1 }}
            />
            <TextInput
              label="Ciudad"
              name="city"
              value={newClient.city}
              onChange={handleNewClientChange}
              style={{ flex: 1 }}
            />
          </div>

          {/* Cuarta fila: Provincia */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <TextInput
              label="Provincia"
              name="province"
              value={newClient.province}
              onChange={handleNewClientChange}
              style={{ flex: 1 }}
            />
          </div>

          {/* Botón Guardar */}
          <Button
            color="green"
            onClick={async () => {
              try {
                const payload = {
                  ...newClient,
                  createdBy: "frontend-user",   // forzado
                  modifiedBy: "frontend-user"   // forzado
                };

                console.log("Payload agregar cliente:", payload);

                const response = await clientService.createClient(payload);

                if (response.status === 201 || response.status === 200) {
                  // Si el backend devuelve el cliente, usarlo; si no, usar payload
                  const createdClient = response.data ?? { id: Math.random(), ...payload };

                  const updatedClients = [...clients, createdClient];
                  setClients(updatedClients);
                  setSortedData(sortData(updatedClients, { sortBy, reversed: reverseSortDirection, search }));

                  // Limpiar formulario
                  setNewClient({
                    name: '', email: '', cuitCuil: '', phone: '', address: '', city: '', province: ''
                  });

                  // Cerrar modal
                  closeAddModal();
                } else {
                  console.error("Error al agregar cliente, status:", response.status);
                }
              } catch (error) {
                console.error("Error al agregar cliente:", error);
              }
            }}
          >
            Guardar
          </Button>
        </div>
      </Modal>



      <Modal
        opened={editModalOpened}
        onClose={closeEditModal}
        title="Editar Cliente"
        size="xl"
        centered
      >
        {clientToEdit && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <TextInput
              label="Nombre"
              value={clientToEdit.name}
              onChange={(e) => setClientToEdit({ ...clientToEdit, name: e.target.value })}
            />
            <TextInput
              label="CUIT/CUIL"
              value={clientToEdit.cuitCuil}
              onChange={(e) => setClientToEdit({ ...clientToEdit, cuitCuil: e.target.value })}
            />
            <TextInput
              label="Dirección"
              value={clientToEdit.address}
              onChange={(e) => setClientToEdit({ ...clientToEdit, address: e.target.value })}
            />
            <TextInput
              label="Ciudad"
              value={clientToEdit.city}
              onChange={(e) => setClientToEdit({ ...clientToEdit, city: e.target.value })}
            />
            <TextInput
              label="Provincia"
              value={clientToEdit.province}
              onChange={(e) => setClientToEdit({ ...clientToEdit, province: e.target.value })}
            />
            <TextInput
              label="Email"
              value={clientToEdit.email}
              onChange={(e) => setClientToEdit({ ...clientToEdit, email: e.target.value })}
            />
            <TextInput
              label="Teléfono"
              value={clientToEdit.phone}
              onChange={(e) => setClientToEdit({ ...clientToEdit, phone: e.target.value })}
            />

            {/* Campo oculto o solo lectura: createdBy */}
            <TextInput
              label="Creado por"
              value={clientToEdit.createdBy || "system"}
              readOnly
            />

            <Button
              color="blue"
              onClick={async () => {
                try {
                  // Armar payload con TODOS los campos obligatorios
                  const payload = {
                    name: clientToEdit.name,
                    cuitCuil: clientToEdit.cuitCuil,
                    address: clientToEdit.address,
                    city: clientToEdit.city,
                    province: clientToEdit.province,
                    email: clientToEdit.email,
                    phone: clientToEdit.phone,
                    createdBy: clientToEdit.createdBy || "system",
                    modifiedBy: "frontend-user", // <- acá podés poner el usuario logueado
                  };

                  const response = await clientService.updateClient(clientToEdit.id, payload);

                  if (response.status === 200) {
                    const updated = clients.map(c =>
                      c.id === clientToEdit.id ? { ...clientToEdit, ...payload } : c
                    );
                    setClients(updated);
                    setSortedData(sortData(updated, { sortBy, reversed: reverseSortDirection, search }));
                    closeEditModal();
                  }
                } catch (err) {
                  console.error("Error al actualizar cliente:", err);
                }
              }}
            >
              Guardar Cambios
            </Button>
          </div>
        )}
      </Modal>


      {/* Modal Eliminar Cliente */}
      <Modal opened={deleteModalOpened} onClose={closeDeleteModal} title="Eliminar Cliente" centered>
        {clientToDelete && (
          <>
            <Text>¿Seguro que quieres eliminar al cliente <b>{clientToDelete.name}</b>?</Text>
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={closeDeleteModal}>Cancelar</Button>
              <Button
                color="red"
                onClick={async () => {
                  try {
                    const response = await clientService.deleteClient(clientToDelete.id);
                    if (response.status === 200 || response.status === 204) {
                      const updated = clients.filter(c => c.id !== clientToDelete.id);
                      setClients(updated);
                      setSortedData(sortData(updated, { sortBy, reversed: reverseSortDirection, search }));
                      closeDeleteModal();
                    }
                  } catch (err) {
                    console.error("Error al eliminar cliente:", err);
                  }
                }}
              >
                Eliminar
              </Button>
            </Group>
          </>
        )}
      </Modal>


    </ScrollArea>
  );
}
