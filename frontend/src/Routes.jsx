import { Navigate, Outlet, useLocation } from "react-router";
import { NavbarSimpleColored } from "./components/NavbarSimpleColored/NavbarSimpleColored";

// El usuario no debe tener un token
export function PublicRoute() {
	const token = localStorage.getItem("token");
	if (token) return <Navigate to="/home" replace />;
	return <Outlet />; // Muestra el contenido de la ruta
}

// El usuario debe tener un token
export function PrivateRoute() {
	const location = useLocation()
	const hideNavbarOnPaths = ['/mecanico'];
	const showNavbar = !hideNavbarOnPaths.includes(location.pathname);

	const token = localStorage.getItem("token");
	if (!token) return <Navigate to="/login" replace />;
	return <div className="contenedor_backend">
		{
			showNavbar ? <NavbarSimpleColored /> : null
		}

		<div className='contenido'>
			<Outlet />
		</div> ;
	</div>
}

export function MecanicRoute() {
	const token = localStorage.getItem("token");
	if (!token) return <Navigate to="/login" replace />;
	return <div className="contenedor_backend">
	
		<div className='contenido'>
			<Outlet />
		</div> ;
	</div>
}
