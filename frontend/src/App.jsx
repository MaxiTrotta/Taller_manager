import './App.css'
import { HomePage } from './pages/HomePage/HomePage'
import { Header } from "./components/Header/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from 'react';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { PrivateRoute, PublicRoute } from "./Routes";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { RegisterPage } from "./pages/RegisterPage/RegisterPage";
import { TableSort } from './components/TableSort/TableSort'
import EmployeesTable from './components/EmployeesTable/EmployeesTable';
import WorkOrdersTable from './components/WorkOrdersTable/WorkOrdersTable';



function App() {
	return (
		<MantineProvider defaultColorScheme="white" forceColorScheme='dark'>
			<BrowserRouter>
				<Routes>
					{/*Rutas públicas*/}
					<Route element={<PublicRoute />}>
						<Route path="/" element={<LoginPage />} />	
						<Route path="/login" element={<LoginPage />} />
					</Route>

					{/*Rutas privadas */}
						<Route element={<PrivateRoute />}>
						<Route path="/register" element={<RegisterPage />} />
						<Route path="/home" element={<HomePage />} />
						<Route path="/cliente" element={<TableSort />} />
						<Route path="/ordenes" element={<WorkOrdersTable />} />
						<Route path="/empleado" element={<EmployeesTable />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</MantineProvider >
	);
}

export default App;