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
} from "@mantine/core";

import TablePagination from "@mui/material/TablePagination";
import { IconTrash, IconShield, IconSearch } from "@tabler/icons-react";

import { usersService } from "../../services/usersService";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("todos");

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalRole, setModalRole] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  async function loadUsers() {
    const response = await usersService.getAll();
    setUsers(response.data);
    setFiltered(response.data);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  // FILTRAR
  useEffect(() => {
    let temp = [...users];

    // Busqueda
    if (search.trim() !== "") {
      temp = temp.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filtro por rol
    if (filterRole === "admin") temp = temp.filter((u) => Number(u.admin) === 1);
    if (filterRole === "mecanico") temp = temp.filter((u) => Number(u.admin) === 0);


    setFiltered(temp);
  }, [search, filterRole, users]);

  // Cambiar rol
  async function toggleRole() {
    const updated = {
      name: selectedUser.name,
      email: selectedUser.email,
      password: selectedUser.password,
      admin: Number(selectedUser.admin) === 1 ? 0 : 1,
    };


    await usersService.update(selectedUser.email, updated);
    setModalRole(false);
    loadUsers();
  }

  async function deleteUser() {
    await usersService.delete(selectedUser.email);
    setModalDelete(false);
    loadUsers();
  }

  return (
    <>
      <Group mb="md">
        <TextInput
          placeholder="Buscar usuario..."
          icon={<IconSearch size={18} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "300px" }}
        />

        <Select
          placeholder="Filtrar rol"
          data={[
            { value: "todos", label: "Todos" },
            { value: "admin", label: "Administradores" },
            { value: "mecanico", label: "Mecánicos" },
          ]}
          value={filterRole}
          onChange={setFilterRole}
          style={{ width: "200px" }}
        />
      </Group>

      <ScrollArea>
        <Table striped highlightOnHover withColumnBorders>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filtered
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {Number(user.admin) === 1 ? (
                      <Badge color="red" size="lg">
                        ADMINISTRACION
                      </Badge>
                    ) : (
                      <Badge color="blue" size="lg">
                        MECÁNICO
                      </Badge>
                    )}
                  </td>

                  <td>
                    <Group>
                      <ActionIcon
                        variant="light"
                        color={user.admin === 1 ? "blue" : "red"}
                        onClick={() => {
                          setSelectedUser(user);
                          setModalRole(true);
                        }}
                      >
                        <IconShield size={20} />
                      </ActionIcon>

                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => {
                          setSelectedUser(user);
                          setModalDelete(true);
                        }}
                      >
                        <IconTrash size={20} />
                      </ActionIcon>
                    </Group>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </ScrollArea>

      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      <Modal opened={modalRole} onClose={() => setModalRole(false)} centered title="Cambiar rol">
        <Text>
          ¿Cambiar rol de <strong>{selectedUser?.name}</strong>?
        </Text>

        <Group mt="md" justify="flex-end">
          <Button variant="outline" onClick={() => setModalRole(false)}>
            Cancelar
          </Button>
          <Button color="red" onClick={toggleRole}>
            Confirmar
          </Button>
        </Group>
      </Modal>

      <Modal opened={modalDelete} onClose={() => setModalDelete(false)} centered title="Eliminar usuario">
        <Text>
          ¿Eliminar a <strong>{selectedUser?.name}</strong>?
        </Text>

        <Group mt="md" justify="flex-end">
          <Button variant="outline" onClick={() => setModalDelete(false)}>
            Cancelar
          </Button>
          <Button color="red" onClick={deleteUser}>
            Eliminar
          </Button>
        </Group>
      </Modal>
    </>
  );
}
