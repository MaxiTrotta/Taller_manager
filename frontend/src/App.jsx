import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

import { PrivateRoute, PublicRoute, MecanicRoute } from "./Routes";

import { LoginPage } from "./pages/LoginPage/LoginPage";
import { RegisterPage } from "./pages/RegisterPage/RegisterPage";
import { TableSort } from './components/TableSort/TableSort'
import EmployeesTable from './components/EmployeesTable/EmployeesTable';
import WorkOrdersTable from './components/WorkOrdersTable/WorkOrdersTable';
import MecanicPage from './pages/MacanicPage/MecanicPage';
import UsersTable from './components/UsersTable/UsersTable';

function App() {
	return (
		<MantineProvider defaultColorScheme="white" forceColorScheme='dark'>
			<BrowserRouter>
				<Routes>
					{/* RUTAS PUBLICAS */}
					<Route element={<PublicRoute />}>
						<Route path="/" element={<LoginPage />} />
						<Route path="/login" element={<LoginPage />} />
					</Route>

					{/* RUTAS SOLO ADMIN */}
					<Route element={<PrivateRoute />}>
						<Route path="/home" element={<TableSort />} />
						<Route path="/usuarios" element={<UsersTable />} />
						<Route path="/register" element={<RegisterPage />} />
						<Route path="/empleado" element={<EmployeesTable />} />
						<Route path="/ordenes" element={<WorkOrdersTable />} />
						<Route path="/cliente" element={<TableSort />} />
					</Route>

					{/* RUTA SOLO MECANICOS */}
					<Route element={<MecanicRoute />}>
						<Route path="/mecanico" element={<MecanicPage />} />
					</Route>
				</Routes>

			</BrowserRouter>
		</MantineProvider>
	)
}

export default App;
