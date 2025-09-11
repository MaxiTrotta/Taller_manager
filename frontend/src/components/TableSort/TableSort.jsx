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
} from '@mantine/core';
import classes from './TableSort.module.css';

// Elimina las interfaces TypeScript y los tipos en props

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
    Object.keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
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

const data = [
  {
    name: '',
    company: '',
    email: '',
    cuit :'',
    address :'',
    city :'',
    province :'',
    phone :'',
    createAt :'',
    createBy :'',
    modifiedBy :''
  },

];

export function TableSort() {
  const [search, setSearch] = useState('');
  const [clients, setClients] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await clientService.getAllClients();
        if (response.status === 200) {
          setClients(response.data);
          setSortedData(response.data);
        }
      } catch (error) {
        // Manejo de error
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
  };

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(clients, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const rows = sortedData.map((row) => (
    <Table.Tr key={row.id}>
      <Table.Td>{row.name}</Table.Td>
      <Table.Td>{row.email}</Table.Td>
      <Table.Td>{row.address}</Table.Td>
      <Table.Td>{row.cuitCuil}</Table.Td>
      <Table.Td>{row.city}</Table.Td>
      <Table.Td>{row.province}</Table.Td>
      <Table.Td>{row.phone}</Table.Td>
      <Table.Td>{row.createAt}</Table.Td>
      <Table.Td>{row.createBy}</Table.Td>
      <Table.Td>{row.modifiedBy}</Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table horizontalSpacing="lg" verticalSpacing="xs" miw={700} layout="fixed">
        <Table.Tbody>
          <Table.Tr>
            <Th
              sorted={sortBy === 'name'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('name')}
            >
              Name
            </Th>
            <Th
              sorted={sortBy === 'email'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('email')}
            >
              Email
            </Th>
            <Th
              sorted={sortBy === 'company'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('company')}
            >
              Company
            </Th>
            <Th
              sorted={sortBy === 'Cuit'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('Cuit')}
            >
              Cuit
            </Th>
            <Th
              sorted={sortBy === 'address'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('adress')}
            >
              Direccion
            </Th>
            <Th
              sorted={sortBy === 'address'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('adress')}
            >
              Direccion
            </Th>
            <Th
              sorted={sortBy === 'address'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('adress')}
            >
              Direccion
            </Th>
            <Th
              sorted={sortBy === 'address'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('adress')}
            >
              Direccion
            </Th>
            
          </Table.Tr>
        </Table.Tbody>
        <Table.Tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={Object.keys(data[0]).length}>
                <Text fw={500} ta="center">
                  Cargando ....
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}