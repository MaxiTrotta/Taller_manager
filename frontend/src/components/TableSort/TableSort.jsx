
import { useState, useEffect } from 'react';
import { clientService } from '../../services/clientService';
import { IconChevronDown, IconChevronUp, IconSearch, IconSelector } from '@tabler/icons-react';
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
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './TableSort.module.css';
import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';

function Th({ children, reversed, sorted, onSort }) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={16} stroke={1.5} />
          </Center>
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

  if (!sortBy) {
    return filterData(data, search);
  }

  return filterData(
    [...data].sort((a, b) => {
      const aValue = a[sortBy] ?? '';
      const bValue = b[sortBy] ?? '';
      if (reversed) {
        return bValue.toString().localeCompare(aValue.toString());
      }
      return aValue.toString().localeCompare(bValue.toString());
    }),
    search
  );
}

export function TableSort() {
  const [search, setSearch] = useState('');
  const [clients, setClients] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  // 🔹 Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 🔹 Modal con Mantine
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await clientService.getAllClients();
        if (response.status === 200) {
          setClients(response.data);
          setSortedData(response.data);
        }
      } catch (error) {
        setClients([]);
        setSortedData([]);
      }
    }
    fetchClients();
  }, []);

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(clients, { sortBy: field, reversed, search }));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(clients, { sortBy, reversed: reverseSortDirection, search: value }));
    setPage(0);
  };

  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const rows = paginatedData.map((row) => (
    <Table.Tr key={row.id}>
      <Table.Td>{row.name}</Table.Td>
      <Table.Td>{row.email}</Table.Td>
      <Table.Td>{row.cuitCuil}</Table.Td>
      <Table.Td>{row.phone}</Table.Td>
      <Table.Td>
        <Button
          variant="light"
          size="xs"
          onClick={() => {
            setSelectedClient(row);
            open();
          }}
        >
          Ver más
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      <TextInput
        placeholder="Buscar Cliente"
        mb="md"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table horizontalSpacing="lg" verticalSpacing="xs" miw={700} layout="fixed">
        <Table.Thead>
          <Table.Tr>
            <Th
              sorted={sortBy === 'name'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('name')}
            >
              Nombre
            </Th>
            <Th
              sorted={sortBy === 'email'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('email')}
            >
              Email
            </Th>
            <Th
              sorted={sortBy === 'cuitCuil'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('cuitCuil')}
            >
              CUIT / CUIL
            </Th>
            <Th
              sorted={sortBy === 'phone'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('phone')}
            >
              Teléfono
            </Th>
            <Table.Th>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={5}>
                <Text fw={500} ta="center">
                  <CircularIndeterminate />
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>

      <TablePagination
        component="div"
        count={sortedData.length}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />

      <Modal
        opened={opened}
        onClose={close}
        title="Detalles del Cliente"
        centered
        size="xxl"
        withinPortal // 🔹 fuerza a salir de tu layout y renderizar en el body
        styles={{
          content: {
            margin: "auto",       // centra el modal
            maxWidth: "500px",    // límite de ancho
            width: "90%",         // responsivo
            left: "50%",          // lo movemos al centro
            top: "50%",
            transform: "translate(-50%, -50%)", // 🔹 lo centra en pantalla
            position: "fixed",    // se asegura que flote
          },
          header: {
            justifyContent: "center",
          },
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
              <b>Creado:</b>{" "}
              {new Date(selectedClient.createdAt?.date).toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "long", // nombre del mes en palabras
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <Text> <b>Dirección:</b> {selectedClient.address}, {selectedClient.city}, {selectedClient.province}
            </Text>
          </>
        ) : (
          <Text>No hay cliente seleccionado</Text>
        )}
      </Modal>

    </ScrollArea>
  );
}

export function CircularIndeterminate() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  );
}
