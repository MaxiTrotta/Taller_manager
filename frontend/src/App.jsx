import './App.css'
import FormularioRegistro from './components/FormularioRegistro/FormularioRegistro'
import FormularioCliente from './components/FormularioCliente/FormularioCliente'
import UserTable from './components/UserTable/UserTable'
import { HomePage } from './pages/HomePage/HomePage'
import { Header } from "./components/Header/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { Footer } from "./components/Footer/Footer";
import { useEffect, useState } from 'react';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import NavbarSimpleColored from './components/NavbarSimpleColored/NavbarSimpleColored';
import ActionToggle from './components/ActionToggle/ActionToggle';

function App() {

  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetch("http://localhost:9092/api/ping.php")
      .then(res => res.json())
      .then(data => setMensaje(data.message))
      .catch(error => console.error("Error al conectar con el backend:", error));
  }, []);



  return (
    <MantineProvider>
      <BrowserRouter>
        <div className="contenedor_backend">
          <NavbarSimpleColored/>
          <div className='contenido'>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/formulario" element={<FormularioRegistro />} />
              <Route path="/cliente" element={<FormularioCliente />} />
              <Route path="/empleado" element={<UserTable />} />
            </Routes>
          </div>
        </div>
        {/* <Footer /> */}
      </BrowserRouter>
    </MantineProvider>
  )
}

export default App
