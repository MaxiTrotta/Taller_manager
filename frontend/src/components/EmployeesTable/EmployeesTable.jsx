// import { useState, useEffect } from "react";
// import { employeesService } from "../../services/employeeService";

// import {
//   ActionIcon,
//   Avatar,
//   Badge,
//   Button,
//   Group,
//   Modal,
//   ScrollArea,
//   Table,
//   Text,
//   TextInput,
// } from "@mantine/core";
// import { useDisclosure } from "@mantine/hooks";
// import {
//   IconPencil,
//   IconTrash,
//   IconEye,
//   IconSearch,
// } from "@tabler/icons-react";
// import { CircularIndeterminate } from "../TableSort/TableSort"; // reutilizamos loader

// // Colores según sector/puesto
// const jobColors = {
//   reparacion: "red",
//   alineacion: "blue",
//   cardan: "gray",
//   suspension: "green",
//   administracion: "orange",
// };

// export function EmployeesTable() {
//   const [employees, setEmployees] = useState([]); // siempre un array
//   const [loading, setLoading] = useState(false);

//   const [search, setSearch] = useState("");

//   // Modales
//   const [addModalOpened, { open: openAdd, close: closeAdd }] =
//     useDisclosure(false);
//   const [editModalOpened, { open: openEdit, close: closeEdit }] =
//     useDisclosure(false);
//   const [deleteModalOpened, { open: openDelete, close: closeDelete }] =
//     useDisclosure(false);
//   const [viewModalOpened, { open: openView, close: closeView }] =
//     useDisclosure(false);

//   // Empleado seleccionado
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [newEmployee, setNewEmployee] = useState({
//     name: "",
//     job: "",
//     email: "",
//     phone: "",
//     avatar: "",
//   });

//   // Cargar empleados
//   useEffect(() => {
//     async function fetchEmployees() {
//       setLoading(true);
//       try {
//         const response = await employeesService.getAllEmployees();
//         console.log("Response empleados:", response.data); // <--- para debug

//         // Si response.data es un array, lo usamos tal cual
//         // Si es un objeto con propiedad "data", usamos response.data.data
//         const employeesArray = Array.isArray(response.data)
//           ? response.data
//           : response.data?.data ?? []; // fallback a []

//         setEmployees(employeesArray);
//       } catch (err) {
//         console.error("Error al cargar empleados:", err);
//         setEmployees([]); // fallback a array vacío
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchEmployees();
//   }, []);


//   // Filtrar empleados por búsqueda
//   const filtered = employees.filter((emp) =>
//     Object.values(emp).some((val) =>
//       val?.toString().toLowerCase().includes(search.toLowerCase())
//     )
//   );

//   // =================== Handlers ===================
//   const handleAddEmployee = async () => {
//     try {
//       const response = await employeesService.createEmployed(newEmployee);
//       if (response.status === 201 || response.status === 200) {
//         const created = response.data ?? { id: Math.random(), ...newEmployee };
//         setEmployees([...employees, created]);
//         closeAdd();
//         setNewEmployee({ name: "", job: "", email: "", phone: "", avatar: "" });
//       }
//     } catch (err) {
//       console.error("Error al crear empleado:", err);
//     }
//   };

//   const handleUpdateEmployee = async () => {
//     try {
//       const response = await employeesService.updateEmployed(
//         selectedEmployee.id,
//         selectedEmployee
//       );
//       if (response.status === 200) {
//         const updated = employees.map((emp) =>
//           emp.id === selectedEmployee.id ? selectedEmployee : emp
//         );
//         setEmployees(updated);
//         closeEdit();
//       }
//     } catch (err) {
//       console.error("Error al actualizar empleado:", err);
//     }
//   };

//   const handleDeleteEmployee = async () => {
//     try {
//       const response = await employeesService.deleteEmployed(
//         selectedEmployee.id
//       );
//       if (response.status === 200 || response.status === 204) {
//         setEmployees(
//           employees.filter((emp) => emp.id !== selectedEmployee.id)
//         );
//         closeDelete();
//       }
//     } catch (err) {
//       console.error("Error al eliminar empleado:", err);
//     }
//   };

//   // =================== Render rows ===================
//   const rows = filtered.map((emp) => (
//     <Table.Tr key={emp.id}>
//       <Table.Td>
//         <Group gap="sm">
//           <Avatar size={30} src={emp.avatar} radius={30} />
//           <Text fz="sm" fw={500}>
//             {emp.name}
//           </Text>
//         </Group>
//       </Table.Td>
//       <Table.Td>
//         <Badge
//           color={jobColors[emp.job?.toLowerCase()] ?? "gray"}
//           variant="light"
//         >
//           {emp.job}
//         </Badge>
//       </Table.Td>
//       <Table.Td>{emp.email}</Table.Td>
//       <Table.Td>{emp.phone}</Table.Td>
//       <Table.Td>
//         <Group gap={0} justify="flex-end">
//           <ActionIcon
//             variant="subtle"
//             color="gray"
//             onClick={() => {
//               setSelectedEmployee(emp);
//               openView();
//             }}
//           >
//             <IconEye size={16} />
//           </ActionIcon>
//           <ActionIcon
//             variant="subtle"
//             color="gray"
//             onClick={() => {
//               setSelectedEmployee(emp);
//               openEdit();
//             }}
//           >
//             <IconPencil size={16} />
//           </ActionIcon>
//           <ActionIcon
//             variant="subtle"
//             color="red"
//             onClick={() => {
//               setSelectedEmployee(emp);
//               openDelete();
//             }}
//           >
//             <IconTrash size={16} />
//           </ActionIcon>
//         </Group>
//       </Table.Td>
//     </Table.Tr>
//   ));

//   return (
//     <ScrollArea>
//       <Group justify="space-between" mb="sm">
//         <TextInput
//           placeholder="Buscar empleado"
//           leftSection={<IconSearch size={16} />}
//           value={search}
//           onChange={(e) => setSearch(e.currentTarget.value)}
//           style={{ width: "300px" }}
//         />

//         <Button color="green" onClick={openAdd}>
//           Agregar Empleado
//         </Button>
//       </Group>

//       <Table highlightOnHover>
//         <Table.Thead>
//           <Table.Tr>
//             <Table.Th>Empleado</Table.Th>
//             <Table.Th>Sector</Table.Th>
//             <Table.Th>Email</Table.Th>
//             <Table.Th>Teléfono</Table.Th>
//             <Table.Th />
//           </Table.Tr>
//         </Table.Thead>
//         <Table.Tbody>
//           {loading ? (
//             <Table.Tr>
//               <Table.Td colSpan={5}>
//                 <CircularIndeterminate />
//               </Table.Td>
//             </Table.Tr>
//           ) : rows.length > 0 ? (
//             rows
//           ) : (
//             <Table.Tr>
//               <Table.Td colSpan={5} style={{ textAlign: "center" }}>
//                 No se encontraron empleados
//               </Table.Td>
//             </Table.Tr>
//           )}
//         </Table.Tbody>
//       </Table>

//       {/* Modal Ver Detalles */}
//       <Modal opened={viewModalOpened} onClose={closeView} title="Detalles del empleado" centered>
//         {selectedEmployee && (
//           <>
//             <Text><b>Nombre:</b> {selectedEmployee.name}</Text>
//             <Text><b>Sector:</b> {selectedEmployee.job}</Text>
//             <Text><b>Email:</b> {selectedEmployee.email}</Text>
//             <Text><b>Teléfono:</b> {selectedEmployee.phone}</Text>
//           </>
//         )}
//       </Modal>

//       {/* Modal Agregar */}
//       <Modal opened={addModalOpened} onClose={closeAdd} title="Agregar empleado" centered>
//         <TextInput
//           label="Nombre"
//           value={newEmployee.name}
//           onChange={(e) =>
//             setNewEmployee({ ...newEmployee, name: e.currentTarget.value })
//           }
//         />
//         <TextInput
//           label="Sector"
//           value={newEmployee.job}
//           onChange={(e) =>
//             setNewEmployee({ ...newEmployee, job: e.currentTarget.value })
//           }
//         />
//         <TextInput
//           label="Email"
//           value={newEmployee.email}
//           onChange={(e) =>
//             setNewEmployee({ ...newEmployee, email: e.currentTarget.value })
//           }
//         />
//         <TextInput
//           label="Teléfono"
//           value={newEmployee.phone}
//           onChange={(e) =>
//             setNewEmployee({ ...newEmployee, phone: e.currentTarget.value })
//           }
//         />
//         <TextInput
//           label="Avatar (URL)"
//           value={newEmployee.avatar}
//           onChange={(e) =>
//             setNewEmployee({ ...newEmployee, avatar: e.currentTarget.value })
//           }
//         />
//         <Button mt="md" color="green" onClick={handleAddEmployee}>
//           Guardar
//         </Button>
//       </Modal>

//       {/* Modal Editar */}
//       <Modal opened={editModalOpened} onClose={closeEdit} title="Editar empleado" centered>
//         {selectedEmployee && (
//           <>
//             <TextInput
//               label="Nombre"
//               value={selectedEmployee.name}
//               onChange={(e) =>
//                 setSelectedEmployee({
//                   ...selectedEmployee,
//                   name: e.currentTarget.value,
//                 })
//               }
//             />
//             <TextInput
//               label="Sector"
//               value={selectedEmployee.job}
//               onChange={(e) =>
//                 setSelectedEmployee({
//                   ...selectedEmployee,
//                   job: e.currentTarget.value,
//                 })
//               }
//             />
//             <TextInput
//               label="Email"
//               value={selectedEmployee.email}
//               onChange={(e) =>
//                 setSelectedEmployee({
//                   ...selectedEmployee,
//                   email: e.currentTarget.value,
//                 })
//               }
//             />
//             <TextInput
//               label="Teléfono"
//               value={selectedEmployee.phone}
//               onChange={(e) =>
//                 setSelectedEmployee({
//                   ...selectedEmployee,
//                   phone: e.currentTarget.value,
//                 })
//               }
//             />
//             <TextInput
//               label="Avatar (URL)"
//               value={selectedEmployee.avatar}
//               onChange={(e) =>
//                 setSelectedEmployee({
//                   ...selectedEmployee,
//                   avatar: e.currentTarget.value,
//                 })
//               }
//             />
//             <Button mt="md" color="blue" onClick={handleUpdateEmployee}>
//               Guardar cambios
//             </Button>
//           </>
//         )}
//       </Modal>

//       {/* Modal Eliminar */}
//       <Modal opened={deleteModalOpened} onClose={closeDelete} title="Eliminar empleado" centered>
//         {selectedEmployee && (
//           <>
//             <Text>
//               ¿Seguro que quieres eliminar a{" "}
//               <b>{selectedEmployee.name}</b>?
//             </Text>
//             <Group justify="flex-end" mt="md">
//               <Button variant="default" onClick={closeDelete}>
//                 Cancelar
//               </Button>
//               <Button color="red" onClick={handleDeleteEmployee}>
//                 Eliminar
//               </Button>
//             </Group>
//           </>
//         )}
//       </Modal>
//     </ScrollArea>
//   );
// }

// export default EmployeesTable;















// =============================================================FRONT SIN LLAMADO AL BACK PARA VER LA ESTRUCTURA=============================================================

import { useState } from "react";
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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconPencil,
  IconTrash,
  IconEye,
  IconSearch,
} from "@tabler/icons-react";

// Colores según sector/puesto
const jobColors = {
  reparacion: "red",
  alineacion: "blue",
  cardan: "gray",
  suspension: "green",
  administracion: "orange",
};

// Datos simulados
const dummyEmployees = [
  {
    id: 1,
    name: "Maxi",
    job: "alineacion",
    email: "maxi@gmail.com",
    phone: "+54 2346 555555",
    avatar: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png"
  },
  {
    id: 2,
    name: "Ivan",
    job: "cardan",
    email: "ivan@gmail.com",
    phone: "+54 2346 555555",
    avatar: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png"
  },
  {
    id: 3,
    name: "Julia",
    job: "administracion",
    email: "julia@gmail.com",
    phone: "+54 2346 555555",
    avatar: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png"
  },
];

export function EmployeesTable() {
  const [employees, setEmployees] = useState(dummyEmployees);
  const [search, setSearch] = useState("");

  const [addModalOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [editModalOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [viewModalOpened, { open: openView, close: closeView }] = useDisclosure(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    job: "",
    email: "",
    phone: "",
    avatar: "",
  });

  // Filtrar empleados por búsqueda
  const filtered = employees.filter((emp) =>
    Object.values(emp).some((val) =>
      val?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  // =================== Handlers simulados ===================
  const handleAddEmployee = () => {
    const id = Math.max(...employees.map(e => e.id)) + 1;
    setEmployees([...employees, { id, ...newEmployee }]);
    closeAdd();
    setNewEmployee({ name: "", job: "", email: "", phone: "", avatar: "" });
  };

  const handleUpdateEmployee = () => {
    setEmployees(
      employees.map((emp) =>
        emp.id === selectedEmployee.id ? selectedEmployee : emp
      )
    );
    closeEdit();
  };

  const handleDeleteEmployee = () => {
    setEmployees(employees.filter((emp) => emp.id !== selectedEmployee.id));
    closeDelete();
  };

  // =================== Render rows ===================
  const rows = filtered.map((emp) => (
    <Table.Tr key={emp.id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar size={30} src={emp.avatar} radius={30} />
          <Text fz="sm" fw={500}>
            {emp.name}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Badge
          color={jobColors[emp.job?.toLowerCase()] ?? "gray"}
          variant="light"
        >
          {emp.job}
        </Badge>
      </Table.Td>
      <Table.Td>{emp.email}</Table.Td>
      <Table.Td>{emp.phone}</Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end">
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => {
              setSelectedEmployee(emp);
              openView();
            }}
          >
            <IconEye size={16} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => {
              setSelectedEmployee(emp);
              openEdit();
            }}
          >
            <IconPencil size={16} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => {
              setSelectedEmployee(emp);
              openDelete();
            }}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

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

        <Button color="green" onClick={openAdd}>
          Agregar Empleado
        </Button>
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
          {rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={5} style={{ textAlign: "center" }}>
                No se encontraron empleados
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>

      {/* Modal Ver Detalles */}
      <Modal opened={viewModalOpened} onClose={closeView} title="Detalles del empleado" centered>
        {selectedEmployee && (
          <>
            <Text><b>Nombre:</b> {selectedEmployee.name}</Text>
            <Text><b>Sector:</b> {selectedEmployee.job}</Text>
            <Text><b>Email:</b> {selectedEmployee.email}</Text>
            <Text><b>Teléfono:</b> {selectedEmployee.phone}</Text>
          </>
        )}
      </Modal>

      {/* Modal Agregar */}
      <Modal opened={addModalOpened} onClose={closeAdd} title="Agregar empleado" centered>
        <TextInput label="Nombre" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.currentTarget.value })} />
        <TextInput label="Sector" value={newEmployee.job} onChange={(e) => setNewEmployee({ ...newEmployee, job: e.currentTarget.value })} />
        <TextInput label="Email" value={newEmployee.email} onChange={(e) => setNewEmployee({ ...newEmployee, email: e.currentTarget.value })} />
        <TextInput label="Teléfono" value={newEmployee.phone} onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.currentTarget.value })} />
        <TextInput label="Avatar (URL)" value={newEmployee.avatar} onChange={(e) => setNewEmployee({ ...newEmployee, avatar: e.currentTarget.value })} />
        <Button mt="md" color="green" onClick={handleAddEmployee}>Guardar</Button>
      </Modal>

      {/* Modal Editar */}
      <Modal opened={editModalOpened} onClose={closeEdit} title="Editar empleado" centered>
        {selectedEmployee && (
          <>
            <TextInput label="Nombre" value={selectedEmployee.name} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, name: e.currentTarget.value })} />
            <TextInput label="Sector" value={selectedEmployee.job} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, job: e.currentTarget.value })} />
            <TextInput label="Email" value={selectedEmployee.email} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, email: e.currentTarget.value })} />
            <TextInput label="Teléfono" value={selectedEmployee.phone} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, phone: e.currentTarget.value })} />
            <TextInput label="Avatar (URL)" value={selectedEmployee.avatar} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, avatar: e.currentTarget.value })} />
            <Button mt="md" color="blue" onClick={handleUpdateEmployee}>Guardar cambios</Button>
          </>
        )}
      </Modal>

      {/* Modal Eliminar */}
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
