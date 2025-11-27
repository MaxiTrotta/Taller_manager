-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: mysql:3306
-- Tiempo de generación: 17-11-2025 a las 03:31:57
-- Versión del servidor: 5.7.44
-- Versión de PHP: 8.2.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `taller_mecanico`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `client`
--

CREATE TABLE `client` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `cuitCuil` bigint(11) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` bigint(11) NOT NULL,
  `deleted` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `client`
--

INSERT INTO `client` (`id`, `name`, `cuitCuil`, `address`, `city`, `province`, `email`, `phone`, `deleted`) VALUES
(1, 'Ivan Bontempo', 23350517219, 'Humberto Primo 61', 'Chivilcoy', 'Buenos Aires', 'ivan@mail.com', 514065, 0),
(2, 'Maxi', 23350517219, 'Calle falsa 1234', 'Springfield', 'Texas', 'maxi@email.com', 514065, 0),
(3, 'Bob Marley', 23350517219, 'Alguna calle de Jamaica', 'Kingston Town', 'Jamaica', 'Bob@mail.com', 222333, 0),
(4, 'Manu Ginobili', 66666666, 'Calle 123', 'Bahia Blanca', 'Buenos Aires', 'Manu@mail.com', 111111, 0),
(5, 'Pato', 123123, 'av villarino 222', 'Chivilcoy', 'juikolp', 'pato@gmail.com', 12121212, 0),
(6, 'Pato', 20411462944, 'Gral Frias 372', 'Chivilcoy', 'Buenos Aires', 'cuack@gmail.com', 2346458340, 0),
(7, 'Roger Federer', 1415161677, 'Cochabamba 144 cerca de un arbol', 'Madrid', 'EspaÃ±a', 'Rogelio@gmail.com', 11252624282, 0),
(8, 'prueba', 1233211231123, 'DICPRUEBA', 'CIUPRUEBA', 'PRUPRU', 'prueba@gmail', 12312312312, 0),
(9, 'Trafersa', 123321, 'alguna', 'alguna', 'alguna', 'Trafersa@gmail.com', 123321, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `employed`
--

CREATE TABLE `employed` (
  `id` int(11) NOT NULL,
  `idSector` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `cuilCuit` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `deleted` int(255) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `employed`
--

INSERT INTO `employed` (`id`, `idSector`, `name`, `cuilCuit`, `phone`, `email`, `address`, `deleted`) VALUES
(1, 3, 'Ricardo ', '23165478949', '2346123456', 'ricardito@gmail.com', 'Las Heras 444', 1),
(2, 4, 'Will Smith', '2316123456', '234699999', 'elwill@gmail.com.ar', 'Vicente Lopez 12', 0),
(3, 2, 'Colapinto Franco', '2316123456', '234699999', 'Franquito@gmail.com.ar', 'Maipu 222', 0),
(4, 4, 'Will Smit', '2316123456', '234699999', 'elwill@gmail.com', 'Bomberos Voluntarios 222', 0),
(5, 1, 'Pedrito', '22222223', '55555555', 'Peter@gmail.com', 'Rodriguez PeÃ±a 34', 0),
(6, 1, 'Colapinto Franco', '5464564', '234699999', 'Franquito@gmail.com.ar', 'Maipu 222', 0),
(7, 4, 'Cachito', '5555', '88888', 'Cachito@gmail.com', 'Rodriguez PeÃ±a 34', 0),
(8, 5, 'Michael Jordan', '12121212', '23232323', 'jordan@bulls.com', 'alguna calle de EEUU', 0),
(9, 1, 'Luly', '27335471364', '2346615432', 'luly@gmail.com', 'Humberto Primo 61', 0),
(10, 5, 'Oscar Parente', '123321123321', '12391239123', 'Oscar@gmail.com', 'bolivar', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orderTask`
--

CREATE TABLE `orderTask` (
  `id` int(11) NOT NULL,
  `idOrder` int(11) NOT NULL,
  `state` varchar(255) NOT NULL,
  `idTask` int(11) NOT NULL,
  `idSector` int(11) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `deleted` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `orderTask`
--

INSERT INTO `orderTask` (`id`, `idOrder`, `state`, `idTask`, `idSector`, `note`, `deleted`) VALUES
(1, 1, 'EN PROCESO', 1, 1, '', 0),
(2, 2, 'EN PROCESO', 2, 2, '', 0),
(3, 1, 'EN PROCESO', 3, 3, '1', 0),
(4, 9, 'EN PROCESO', 1, 2, 'asd', 0),
(5, 10, 'Pendiente', 3, 2, 'prueba 27/10', 0),
(6, 11, 'FINALIZADO', 2, 4, 'prueba finalizado', 0),
(7, 12, 'FINALIZADO', 1, 1, 'pruebacopilot', 0),
(8, 13, 'PENDIENTE', 1, 1, '111', 0),
(9, 13, 'PENDIENTE', 2, 2, '222', 0),
(10, 13, 'PENDIENTE', 3, 3, '333', 0),
(11, 13, 'PENDIENTE', 3, 4, '444', 0),
(12, 14, 'FINALIZADO', 1, 1, 'PRUEBA 1 DEL BACKEND', 0),
(13, 14, 'FINALIZADO', 2, 2, 'prueba 2 del backend', 0),
(14, 14, 'FINALIZADO', 3, 4, 'reparar freno izquierdo', 0),
(15, 14, 'FINALIZADO', 4, 5, 'rapido', 0),
(16, 15, 'EN PROCESO', 1, 1, 'prueba 27 10 21 46', 0),
(17, 17, 'Pendiente', 1, 1, '', 0),
(18, 18, 'FINALIZADO', 1, 1, '', 0),
(19, 18, 'FINALIZADO', 1, 1, '', 0),
(20, 20, 'EN PROCESO', 1, 1, '', 0),
(21, 20, 'EN PROCESO', 2, 1, '', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `order_base`
--

CREATE TABLE `order_base` (
  `id` int(11) NOT NULL,
  `idClient` int(11) NOT NULL,
  `idVehicle` int(11) NOT NULL,
  `idOrderTask` int(11) NOT NULL,
  `creationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `order_base`
--

INSERT INTO `order_base` (`id`, `idClient`, `idVehicle`, `idOrderTask`, `creationDate`, `deleted`) VALUES
(1, 1, 2, 3, '2025-10-27 22:02:04', 1),
(2, 2, 1, 2, '2025-10-27 22:02:04', 0),
(3, 3, 3, 1, '2025-10-27 22:02:04', 1),
(4, 3, 1, 1, '2025-10-27 22:02:04', 1),
(5, 1, 3, 0, '2025-10-27 22:02:04', 1),
(6, 1, 3, 0, '2025-10-27 22:02:04', 1),
(7, 1, 3, 1, '2025-10-27 22:02:04', 1),
(8, 1, 3, 1, '2025-10-27 22:02:04', 1),
(9, 2, 1, 0, '2025-10-27 22:09:18', 0),
(10, 7, 5, 0, '2025-10-27 22:20:40', 1),
(11, 1, 3, 0, '2025-10-27 22:51:36', 0),
(12, 4, 4, 0, '2025-10-27 22:58:40', 0),
(13, 4, 4, 0, '2025-10-27 23:36:03', 0),
(14, 8, 6, 0, '2025-10-27 23:52:37', 0),
(15, 1, 3, 0, '2025-10-28 00:46:05', 0),
(16, 1, 3, 0, '2025-11-02 12:13:53', 1),
(17, 1, 3, 0, '2025-11-02 12:14:04', 1),
(18, 1, 3, 0, '2025-11-02 12:14:23', 1),
(19, 1, 3, 0, '2025-11-16 21:18:58', 1),
(20, 1, 3, 0, '2025-11-16 21:19:34', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sector`
--

CREATE TABLE `sector` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `deleted` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `sector`
--

INSERT INTO `sector` (`id`, `name`, `deleted`) VALUES
(1, 'Alineacion', 0),
(2, 'Cardan', 0),
(3, 'Reparacion', 0),
(4, 'Suspension', 0),
(5, 'Administracion', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `task`
--

CREATE TABLE `task` (
  `id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `deleted` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `task`
--

INSERT INTO `task` (`id`, `description`, `deleted`) VALUES
(1, 'Cambio de aceite y reparacion de sistema electrico', 0),
(2, 'Hacer cardan, buje de parrilla y limpiar carburador', 0),
(3, 'Reparar faro delantero', 0),
(4, 'Cambiar correa de distribucion', 0),
(5, 'Reparar faro delantero', 0),
(6, 'Cambiar correa de distribucion', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `token_auth_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `admin` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `token`, `token_auth_date`, `deleted`, `admin`) VALUES
(3, 'Matias', 'mat@test.com', '$2y$10$utjooAOUrB40XwI7fXjIs.laS3t1uKA5pzCXo08lOcGNDnBEqiz5y', 'ad0b706700ddcab9d0fd509b22925985', '2025-09-16 22:20:45', 1, 0),
(4, 'Maxi', 'maxi@test.com', '$2y$10$t5EWKYfNzCyuQE6mi1/b1OmVXQwI51bPo5VdFmPoN5uys1c9nvXZO', 'afa6fdb68bf3cd17714ff18eb59dc4d2', '2025-11-17 00:53:29', 0, 1),
(5, 'Ivan', 'ivan@test.com', '$2y$10$exuHVuxiOx0YOfHK//TdrOI47X9a5mEwAEhwaHkfIQmrpaDhzPkru', '7cb9d11b6b51a416340a55fc10312944', '2025-10-15 20:40:59', 0, 0),
(6, 'maxi', 'maxi@gmail.com', '$2y$10$eoClckDBl3gtxcJABMIPW.qfxnKIGq899GJEuPq6vnWs8CvjHOb92', 'd67f7d8decce1eded19e9f68c0fb1afe', '2025-11-17 00:49:51', 0, 0),
(7, 'administrador', 'administrador@test.com', '$2y$10$l59Z/RfFuSGKea4aGC/pguO54Kz6WxdL8qj38epw6XLq1uNI5/75y', 'ebb333a8218636fe442881e91fabc456', '2025-11-17 02:03:53', 0, 1),
(8, 'Mecanico', 'mecanico@test.com', '$2y$10$YyXYtqadfd0a46OQuq/qw.7FWOUFveqcCqVMej4OpYJw5oOmVNByK', '220b1525ad005bd894edb9ba655bdf7e', '2025-11-17 01:40:07', 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vehicle`
--

CREATE TABLE `vehicle` (
  `id` int(11) NOT NULL,
  `clientId` int(11) NOT NULL,
  `licensePlate` varchar(255) NOT NULL,
  `brand` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `year` int(11) NOT NULL,
  `deleted` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `vehicle`
--

INSERT INTO `vehicle` (`id`, `clientId`, `licensePlate`, `brand`, `model`, `year`, `deleted`) VALUES
(1, 2, 'ABC123', 'Volkswagen', 'Gol', 1993, 0),
(2, 3, 'XXXXX', 'Audi', 'A1', 2021, 0),
(3, 1, 'AAA222', 'Renault', 'Kwid', 2020, 0),
(4, 4, 'BBB333', 'Ford', 'Focus', 2015, 0),
(5, 7, 'zzz123', 'Fiat', '600', 1965, 0),
(6, 8, 'PRUEBA', 'PRUEBA', 'PRUEBA', 2025, 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `employed`
--
ALTER TABLE `employed`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idSector` (`idSector`);

--
-- Indices de la tabla `orderTask`
--
ALTER TABLE `orderTask`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `order_base`
--
ALTER TABLE `order_base`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `sector`
--
ALTER TABLE `sector`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `vehicle`
--
ALTER TABLE `vehicle`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`clientId`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `client`
--
ALTER TABLE `client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `employed`
--
ALTER TABLE `employed`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `orderTask`
--
ALTER TABLE `orderTask`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `order_base`
--
ALTER TABLE `order_base`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `sector`
--
ALTER TABLE `sector`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `task`
--
ALTER TABLE `task`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `vehicle`
--
ALTER TABLE `vehicle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
