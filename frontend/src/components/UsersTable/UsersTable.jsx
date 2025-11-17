import { useEffect, useState } from "react";
import {
  Table,
  Text,
  Group,
  Button,
  Modal,
  Badge,
  ActionIcon,
  ScrollArea,
  TextInput,
  Select,
  Center,
  Overlay,
  UnstyledButton,
} from "@mantine/core";

import {
  IconTrash,
  IconShield,
  IconSearch,
  IconChevronDown,
  IconChevronUp,
  IconSelector,
} from "@tabler/icons-react";

import CircularProgress from "@mui/material/CircularProgress";
import TablePagination from "@mui/material/TablePagination";

import { usersService } from "../../services/usersService";
import classes from "../TableSort/TableSort.module.css";

// =============== Helpers Visuales (Th ordenable) ===============
function Th({ children, sorted, reversed, onSort }) {
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

// =================== Filtro ===================
function filterData(data, search, filterRole) {
  let result = Array.isArray(data) ? data : [];

  const q = search.toLowerCase().trim();
  if (q !== "") {
    result = result.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }

  if (filterRole === "admin") result = result.filter((u) => Number(u.admin) === 1);
  if (filterRole === "mecanico") result = result.filter((u) => Number(u.admin) === 0);

  return result;
}

// =================== Ordenamiento ===================
function sortData(data, { sortBy, reversed, search, filterRole }) {
  let result = [...filterData(data, search, filterRole)];

  if (!sortBy) return result;

  return result.sort((a, b) => {
    const aVal = a[sortBy]?.toString().toLowerCase() ?? "";
    const bVal = b[sortBy]?.toString().toLowerCase() ?? "";

    return reversed ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
  });
}

// =====================================================
//                    COMPONENTE
// =====================================================
export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [sortedUsers, setSortedUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("todos");

  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalRole, setModalRole] = useState(false);

  const [blocking, setBlocking] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // =================== TRAER USUARIOS ===================
  async function loadUsers() {
    setBlocking(true);
    try {
      const response = await usersService.getAll();
      const arr = Array.isArray(response.data) ? response.data : [];
      setUsers(arr);
      setSortedUsers(
        sortData(arr, {
          sortBy,
          reversed: reverseSortDirection,
          search,
          filterRole,
        })
      );
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setUsers([]);
      setSortedUsers([]);
    } finally {
      setBlocking(false);
    }
  }

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =================== Sorting ===================
  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedUsers(
      sortData(users, {
        sortBy: field,
        reversed,
        search,
        filterRole,
      })
    );
    setPage(0);
  };

  // =================== Filtros dinámicos ===================
  useEffect(() => {
    setSortedUsers(
      sortData(users, {
        sortBy,
        reversed: reverseSortDirection,
        search,
        filterRole,
      })
    );
    setPage(0);
  }, [users, search, filterRole, sortBy, reverseSortDirection]);

  const paginated = sortedUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // =================== Acciones ===================
  async function toggleRole() {
    if (!selectedUser) return;
    setBlocking(true);
    try {
      await usersService.update(selectedUser.email, {
        name: selectedUser.name,
        email: selectedUser.email,
        password: selectedUser.password,
        admin: Number(selectedUser.admin) === 1 ? 0 : 1,
      });

      setModalRole(false);
      await loadUsers();
    } catch (e) {
      console.error("Error al cambiar rol:", e);
    } finally {
      setBlocking(false);
    }
  }

  async function deleteUser() {
    if (!selectedUser) return;
    setBlocking(true);
    try {
      await usersService.delete(selectedUser.email);
      setModalDelete(false);
      await loadUsers();
    } catch (e) {
      console.error("Error al eliminar usuario:", e);
    } finally {
      setBlocking(false);
    }
  }

  // =====================================================
  //                      RENDER
  // =====================================================
  return (
    <div style={{ position: "relative" }}>
      {/* ================= BLOQUEO SOLO DEL CONTENEDOR ================= */}
      {blocking && (
        <>
          <Overlay
            opacity={0.5}
            color="#000"
            blur={2}
            zIndex={5}
            style={{ position: "absolute", inset: 0, borderRadius: "8px" }}
          />
          <Center
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
              flexDirection: "column",
            }}
          >
            <CircularProgress color="success" size={70} />
          </Center>
        </>
      )}

      {/* ================= HEADERS ================= */}
      <Group justify="space-between" mb="sm">
        <TextInput
          placeholder="Buscar usuario..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          style={{ width: "300px" }}
        />

        <Select
          placeholder="Filtrar rol"
          value={filterRole}
          onChange={setFilterRole}
          data={[
            { value: "todos", label: "Todos" },
            { value: "admin", label: "Administradores" },
            { value: "mecanico", label: "Mecánicos" },
          ]}
          style={{ width: 220 }}
        />
      </Group>

      {/* ================= TABLA ================= */}
      <ScrollArea>
        <Table
          horizontalSpacing="lg"
          verticalSpacing="xs"
          highlightOnHover
          layout="fixed"
        >
          <Table.Thead>
            <Table.Tr>
              <Th
                sorted={sortBy === "id"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("id")}
              >
                ID
              </Th>

              <Th
                sorted={sortBy === "name"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("name")}
              >
                Nombre
              </Th>

              <Th
                sorted={sortBy === "email"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("email")}
              >
                Email
              </Th>

              <Th
                sorted={sortBy === "admin"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("admin")}
              >
                Rol
              </Th>

              <Table.Th>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {paginated.length > 0 ? (
              paginated.map((u) => (
                <Table.Tr key={u.id}>
                  <Table.Td>{u.id}</Table.Td>
                  <Table.Td>{u.name}</Table.Td>
                  <Table.Td>{u.email}</Table.Td>

                  <Table.Td>
                    <Badge
                      color={Number(u.admin) === 1 ? "red" : "blue"}
                      variant="filled"
                    >
                      {Number(u.admin) === 1
                        ? "ADMINISTRACIÓN"
                        : "MECÁNICO"}
                    </Badge>
                  </Table.Td>

                  <Table.Td>
                    <Group gap={0} justify="flex-end">
                      <ActionIcon
                        variant="subtle"
                        color={Number(u.admin) === 1 ? "blue" : "red"}
                        onClick={() => {
                          setSelectedUser(u);
                          setModalRole(true);
                        }}
                      >
                        <IconShield size={18} />
                      </ActionIcon>

                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => {
                          setSelectedUser(u);
                          setModalDelete(true);
                        }}
                      >
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Text ta="center" fw={500}>
                    No se encontraron usuarios
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      {/* ================= PAGINACIÓN ================= */}
      <TablePagination
        component="div"
        count={sortedUsers.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        sx={{
          color: "#1976d2",
          ".MuiSvgIcon-root, .MuiIconButton-root": { color: "#1976d2" },
          ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows, .MuiSelect-select":
            { color: "#1976d2" },
        }}
      />

      {/* ================= MODAL CAMBIAR ROL ================= */}
      <Modal
        opened={modalRole}
        onClose={() => setModalRole(false)}
        centered
        title="Cambiar rol"
      >
        <Text>
          ¿Cambiar rol de <b>{selectedUser?.name}</b>?
        </Text>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setModalRole(false)}>
            Cancelar
          </Button>

          <Button color="blue" onClick={toggleRole}>
            Confirmar
          </Button>
        </Group>
      </Modal>

      {/* ================= MODAL ELIMINAR ================= */}
      <Modal
        opened={modalDelete}
        onClose={() => setModalDelete(false)}
        centered
        title="Eliminar usuario"
      >
        <Text>
          ¿Eliminar a <b>{selectedUser?.name}</b>?
        </Text>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setModalDelete(false)}>
            Cancelar
          </Button>

          <Button color="red" onClick={deleteUser}>
            Eliminar
          </Button>
        </Group>
      </Modal>
    </div>
  );
}
