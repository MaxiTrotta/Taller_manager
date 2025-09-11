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
import { PrivateRoute, PublicRoute } from "./Routes";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { RegisterPage } from "./pages/RegisterPage/RegisterPage";
import { TableSort } from './components/TableSort/TableSort'

// function App() {


//   return (
//     <MantineProvider>
//       <BrowserRouter>
//         <div className="contenedor_backend">
//           <NavbarSimpleColored/>
//           <div className='contenido'>
//             <Routes>
//               <Route path="/" element={<HomePage />} />
//               <Route path="/formulario" element={<FormularioRegistro />} />
//               <Route path="/cliente" element={<FormularioCliente />} />
//               <Route path="/empleado" element={<UserTable />} />
//             </Routes>
//           </div>
//         </div>
//         {/* <Footer /> */}
//       </BrowserRouter>
//     </MantineProvider>
//   )
// }

// export default App

function App() {
	return (
		<MantineProvider defaultColorScheme="dark">
			<BrowserRouter>
				<Routes>
					{/*Rutas públicas*/}
					<Route element={<PublicRoute />}>
						<Route path="/" element={<LoginPage />} />	
						<Route path="/login" element={<LoginPage />} />
						<Route path="/register" element={<RegisterPage />} />
					</Route>

					{/*Rutas privadas */}
					<Route element={<PrivateRoute />}>
						<Route path="/home" element={<HomePage />} />
						<Route path="/cliente" element={<TableSort />} />
						<Route path="/ordenes" element={<FormularioCliente />} />
						<Route path="/empleado" element={<UserTable />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</MantineProvider >
	);
}

export default App;