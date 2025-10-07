import { useState, useEffect } from "react";
import { employeesService } from "../../services/employeeService";
import { sectorsService } from "../../services/sectorsService";

import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Group,
  Modal,
  ScrollArea,
  Table,
  Text,
  TextInput,
  Select,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil, IconTrash, IconEye, IconSearch } from "@tabler/icons-react";
import { CircularIndeterminate } from "../TableSort/TableSort"; // Loader reutilizado

const jobColors = {
  reparacion: "blue",
  alineacion: "red",
  cardan: "gray",
  suspension: "green",
  administracion: "orange",
};

export function EmployeesTable() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sectors, setSectors] = useState([]);

  const [addModalOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [editModalOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [viewModalOpened, { open: openView, close: closeView }] = useDisclosure(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    idSector: "",
    name: "",
    cuilCuit: "",
    phone: "",
    email: "",
    address: "",
    avatar: "",
  });

  // =================== FETCH ===================
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await employeesService.getAllEmployees();
      setEmployees(response.data ?? []);
    } catch (err) {
      console.error("Error al cargar empleados:", err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSectors = async () => {
    try {
      const response = await sectorsService.getAllSectors();
      setSectors(response.data ?? []);
    } catch (err) {
      console.error("Error al cargar sectores:", err);
      setSectors([]);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchSectors();
  }, []);

  // =================== FILTRO ===================
  const filtered = employees.filter((emp) =>
    Object.values(emp).some((val) =>
      val?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  // =================== HANDLERS ===================
  const handleAddEmployee = async () => {
    try {
      const response = await employeesService.createEmployed(newEmployee);
      if (response.status === 201 || response.status === 200) {
        const created = response.data ?? { id: Math.random(), ...newEmployee };
        setEmployees([...employees, created]);
        closeAdd();np
        setNewEmployee({ idSector: "", name: "", cuilCuit: "", phone: "", email: "", address: "", avatar: "" });
      }
    } catch (err) {
      console.error("Error al crear empleado:", err);
    }
  };

  const handleUpdateEmployee = async () => {
    try {
      const response = await employeesService.updateEmployed(selectedEmployee.id, selectedEmployee);
      if (response.status === 200) {
        // Actualiza tabla sin recargar
        setEmployees(employees.map(emp => (emp.id === selectedEmployee.id ? selectedEmployee : emp)));
        closeEdit();
      }
    } catch (err) {
      console.error("Error al actualizar empleado:", err);
    }
  };

  const handleDeleteEmployee = async () => {
    try {
      const response = await employeesService.deleteEmployed(selectedEmployee.id);
      if (response.status === 200 || response.status === 204) {
        setEmployees(employees.filter(emp => emp.id !== selectedEmployee.id));
        closeDelete();
      }
    } catch (err) {
      console.error("Error al eliminar empleado:", err);
    }
  };

  // =================== RENDER ROWS ===================
  const rows = filtered.map((emp) => {
    const sector = sectors.find((s) => s.id === emp.idSector)?.name ?? "Desconocido";
    return (
      <Table.Tr key={emp.id}>
        <Table.Td>
          <Group gap="sm">
            <Avatar size={30} src={emp.avatar} radius={30} />
            <Text fz="sm" fw={500}>{emp.name}</Text>
          </Group>
        </Table.Td>
        <Table.Td>
          <Badge color={jobColors[sector.toLowerCase()] ?? "gray"} variant="light">
            {sector}
          </Badge>
        </Table.Td>
        <Table.Td>{emp.email}</Table.Td>
        <Table.Td>{emp.phone}</Table.Td>
        <Table.Td>
          <Group gap={0} justify="flex-end">
            <ActionIcon variant="subtle" color="gray" onClick={() => { setSelectedEmployee(emp); openView(); }}>
              <IconEye size={16} />
            </ActionIcon>
            <ActionIcon variant="subtle" color="gray" onClick={() => { setSelectedEmployee(emp); openEdit(); }}>
              <IconPencil size={16} />
            </ActionIcon>
            <ActionIcon variant="subtle" color="red" onClick={() => { setSelectedEmployee(emp); openDelete(); }}>
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  // =================== RENDER ===================
  return (
    <ScrollArea>
      <Group justify="space-between" mb="sm">
        <TextInput
          placeholder="Buscar empleado"
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          style={{ width: "300px" }}
        />
        <Button color="green" onClick={openAdd}>Agregar Empleado</Button>
      </Group>

      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Empleado</Table.Th>
            <Table.Th>Sector</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Teléfono</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.Tr>
              <Table.Td colSpan={5}><CircularIndeterminate /></Table.Td>
            </Table.Tr>
          ) : rows.length > 0 ? rows : (
            <Table.Tr>
              <Table.Td colSpan={5} style={{ textAlign: "center" }}>No se encontraron empleados</Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>

      {/* =================== MODALES =================== */}
      {/* Ver */}
      <Modal opened={viewModalOpened} onClose={closeView} title="Detalles del empleado" centered>
        {selectedEmployee && (
          <>
            <Text><b>Nombre:</b> {selectedEmployee.name}</Text>
            <Text><b>CUIL/CUIT:</b> {selectedEmployee.cuilCuit}</Text>
            <Text><b>Email:</b> {selectedEmployee.email}</Text>
            <Text><b>Teléfono:</b> {selectedEmployee.phone}</Text>
            <Text><b>Dirección:</b> {selectedEmployee.address}</Text>
            <Text><b>Sector:</b> {sectors.find((s) => s.id === selectedEmployee.idSector)?.name}</Text>
          </>
        )}
      </Modal>

      {/* Agregar */}
      <Modal opened={addModalOpened} onClose={closeAdd} title="Agregar empleado" centered>
        <TextInput label="Nombre" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.currentTarget.value })} />
        <TextInput label="CUIL/CUIT" value={newEmployee.cuilCuit} onChange={(e) => setNewEmployee({ ...newEmployee, cuilCuit: e.currentTarget.value })} />
        <TextInput label="Teléfono" value={newEmployee.phone} onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.currentTarget.value })} />
        <TextInput label="Email" value={newEmployee.email} onChange={(e) => setNewEmployee({ ...newEmployee, email: e.currentTarget.value })} />
        <TextInput label="Dirección" value={newEmployee.address} onChange={(e) => setNewEmployee({ ...newEmployee, address: e.currentTarget.value })} />
        <Select
          label="Sector"
          placeholder="Seleccionar sector"
          data={sectors.map((s) => ({ value: s.id.toString(), label: s.name }))}
          value={newEmployee.idSector.toString()}
          onChange={(val) => setNewEmployee({ ...newEmployee, idSector: parseInt(val) })}
        />
        <TextInput label="Avatar (URL)" value={newEmployee.avatar} onChange={(e) => setNewEmployee({ ...newEmployee, avatar: e.currentTarget.value })} />
        <Button mt="md" color="green" onClick={handleAddEmployee}>Guardar</Button>
      </Modal>

      {/* Editar */}
      <Modal opened={editModalOpened} onClose={closeEdit} title="Editar empleado" centered>
        {selectedEmployee && (
          <>
            <TextInput label="Nombre" value={selectedEmployee.name} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, name: e.currentTarget.value })} />
            <TextInput label="CUIL/CUIT" value={selectedEmployee.cuilCuit} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, cuilCuit: e.currentTarget.value })} />
            <TextInput label="Teléfono" value={selectedEmployee.phone} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, phone: e.currentTarget.value })} />
            <TextInput label="Email" value={selectedEmployee.email} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, email: e.currentTarget.value })} />
            <TextInput label="Dirección" value={selectedEmployee.address} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, address: e.currentTarget.value })} />
            <Select
              label="Sector"
              placeholder="Seleccionar sector"
              data={sectors.map((s) => ({ value: s.id.toString(), label: s.name }))}
              value={selectedEmployee.idSector.toString()}
              onChange={(val) => setSelectedEmployee({ ...selectedEmployee, idSector: parseInt(val) })}
            />
            <TextInput label="Avatar (URL)" value={selectedEmployee.avatar} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, avatar: e.currentTarget.value })} />
            <Button mt="md" color="blue" onClick={handleUpdateEmployee}>Guardar cambios</Button>
          </>
        )}
      </Modal>

      {/* Eliminar */}
      <Modal opened={deleteModalOpened} onClose={closeDelete} title="Eliminar empleado" centered>
        {selectedEmployee && (
          <>
            <Text>¿Seguro que quieres eliminar a <b>{selectedEmployee.name}</b>?</Text>
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={closeDelete}>Cancelar</Button>
              <Button color="red" onClick={handleDeleteEmployee}>Eliminar</Button>
            </Group>
          </>
        )}
      </Modal>
    </ScrollArea>
  );
}

export default EmployeesTable;
