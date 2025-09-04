import { Navigate, Outlet } from "react-router";
import { NavbarSimpleColored } from "./components/NavbarSimpleColored/NavbarSimpleColored";

// El usuario no debe tener un token
export function PublicRoute() {
	const token = localStorage.getItem("token");
	if (token) return <Navigate to="/home" replace />;
	return <Outlet />; // Muestra el contenido de la ruta
}

// El usuario debe tener un token
export function PrivateRoute() {
	const token = localStorage.getItem("token");
	if (!token) return <Navigate to="/login" replace />;
	return <div className="contenedor_backend">
		<NavbarSimpleColored />
		<div className='contenido'>
			<Outlet />
		</div> ;
	</div>
}
