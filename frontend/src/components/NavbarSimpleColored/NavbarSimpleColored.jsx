import { useState } from 'react';
import {
  Icon2fa,
  IconBellRinging,
  IconDatabaseImport,
  IconFingerprint,
  IconKey,
  IconLogout,
  IconReceipt2,
  IconSettings,
  IconSwitchHorizontal,
} from '@tabler/icons-react';
import { Code, Group } from '@mantine/core';
import classes from './NavbarSimpleColored.module.css';
import ActionToggle from '../ActionToggle/ActionToggle';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';


const data = [
  { link: '/cliente', label: 'Clientes', icon: IconDatabaseImport },
  { link: '/ordenes', label: 'Ordenes De Trabajo', icon: IconReceipt2 },
  { link: '/empleado', label: 'Empleados', icon: IconFingerprint },
  { link: '/register', label: 'Registrar Nuevo Usuario', icon: IconKey },
  { link: '/mecanico', label: 'Vista de mecanico', icon: IconSettings },
  
];
export function NavbarSimpleColored() {
  const navigate = useNavigate();
  const [active, setActive] = useState('Billing');

  const links = data.map((item) => (

    <Link
      className={classes.link}
      data-active={item.label === active || undefined}
      to={item.link}
      key={item.label}
      onClick={() => setActive(item.label)}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">

          <div style={{ display: "flex" }}>
            <a href="/cliente">
              <img src="/public/Logo.png" alt="Logo Ortiz Hnos" />
            </a>

           

          </div> 
          <Code fw={700} className={classes.version}>
            v 1.0
          </Code>
        </Group>
        {links}
      </div>
      <div className={classes.footer}>
        <a href="#" className={classes.link} onClick={(event) => {
          event.preventDefault();
          localStorage.removeItem("token")
          navigate("/login")
        }}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Cerrar sesión</span>
        </a>
        
      </div>
    </nav>
  );
}

export default NavbarSimpleColored;