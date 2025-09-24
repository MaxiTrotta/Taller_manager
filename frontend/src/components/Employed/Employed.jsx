import { IconPencil, IconTrash } from '@tabler/icons-react';
import { ActionIcon,
   Anchor, 
   Avatar, 
   Badge,
    Group, 
    Table, 
    Text } from '@mantine/core';

const data = [
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png',
    name: 'Maxi',
    job: 'alineacion',
    email: 'Maxi@gmail.com',
    phone: '+54 (2346) 5555555',
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    name: 'Ivan',
    job: 'cardan',
    email: 'ivan@gmail.com',
    phone: '+54 (2346) 5555555',
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png',
    name: 'Pato',
    job: 'reparacion',
    email: 'pato@gmail.com',
    phone: '+54 (2346) 5555555',
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png',
    name: 'Julia',
    job: 'administracion',
    email: 'julia@gmail.com',
    phone: '+54 (2346) 5555555',
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-10.png',
    name: 'Gian',
    job: 'Suspension',
    email: 'gian@gmail.com',
    phone: '+54 (2346) 5555555',
  },
];

const jobColors = {
  reparacion: 'red',
  alineacion: 'blue',
  cardan: 'grey',
  suspension: 'green',
  administracion: 'orange',
};

export function UsersTable() {
  const rows = data.map((item) => (
    <Table.Tr key={item.name}>
      <Table.Td>
        <Group gap="sm">
          <Avatar size={30} src={item.avatar} radius={30} />
          <Text fz="sm" fw={500}>
            {item.name}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Badge color={jobColors[item.job.toLowerCase()]} variant="light">
          {item.job}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Anchor component="button" size="m">
          {item.email}
        </Anchor>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.phone}</Text>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end">
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

  return (
    <Table.ScrollContainer minWidth={800}>
      <Table verticalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Empleado</Table.Th>
            <Table.Th>Sector</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Telefono</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}

export default UsersTable;