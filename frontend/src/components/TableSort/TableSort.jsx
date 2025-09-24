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
       
          <ActionIcon variant="subtle" color="gray">
            <IconEye size={16} stroke={1.5} onClick={() => { setSelectedClient(row); open(); }}/>
          </ActionIcon>
          <ActionIcon variant="subtle" color="gray">
            <IconPencil size={16} stroke={1.5} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red">
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
      const response = await clientService.createClient(newClient);
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
          style={{ width: '250px' }} // Puedes ajustar este valor
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
          //content: { color:'white', margin:'auto', maxWidth:'500px', width:'90%', left:'50%', top:'50%', transform:'translate(-50%, -50%)', position:'fixed' },
          content: { width: '100%', height: '50%', overflowY: 'scroll' },
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
        withinPortal
        overflow="inside"   // activa scroll interno si el contenido es muy grande
        centered={false}    // ❌ no centramos verticalmente
        styles={{
          /*
          content: {
            color: 'white',
            maxHeight: '100vh', // máximo 90% de la pantalla
            width: '30%',
            maxWidth: '700px',
            position: 'fixed',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            paddingBottom: '1rem',
          },*/
          header: { justifyContent: 'center' },
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextInput label="Nombre" name="name" value={newClient.name} onChange={handleNewClientChange} />
          <TextInput label="Email" name="email" value={newClient.email} onChange={handleNewClientChange} />
          <TextInput label="CUIT/CUIL" name="cuitCuil" value={newClient.cuitCuil} onChange={handleNewClientChange} />
          <TextInput label="Teléfono" name="phone" value={newClient.phone} onChange={handleNewClientChange} />
          <TextInput label="Dirección" name="address" value={newClient.address} onChange={handleNewClientChange} />
          <TextInput label="Ciudad" name="city" value={newClient.city} onChange={handleNewClientChange} />
          <TextInput label="Provincia" name="province" value={newClient.province} onChange={handleNewClientChange} />
          <Button onClick={handleAddClient} color="green">Guardar</Button>
        </div>
      </Modal>



    </ScrollArea>
  );
}
