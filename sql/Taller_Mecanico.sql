-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: mysql:3306
-- Tiempo de generación: 17-10-2025 a las 00:46:28
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
(7, 'Roger Federer', 1415161677, 'Cochabamba 144 cerca de un arbol', 'Madrid', 'EspaÃ±a', 'Rogelio@gmail.com', 11252624282, 0);

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
(1, 3, 'Ricardo Darin', '23165478949', '2346123456', 'ricardito@gmail.com', 'Las Heras 444', 0),
(2, 4, 'Will Smith', '2316123456', '234699999', 'elwill@gmail.com.ar', 'Vicente Lopez 12', 0),
(3, 2, 'Colapinto Franco', '2316123456', '234699999', 'Franquito@gmail.com.ar', 'Maipu 222', 0),
(4, 2, 'Will Smit', '2316123456', '234699999', 'elwill@gmail.com', 'Bomberos Voluntarios 222', 0),
(5, 1, 'Pedrito', '22222223', '55555555', 'Peter@gmail.com', 'Rodriguez PeÃ±a 34', 0),
(6, 1, 'Colapinto Franco', '5464564', '234699999', 'Franquito@gmail.com.ar', 'Maipu 222', 0),
(7, 4, 'Cachito', '5555', '88888', 'Cachito@gmail.com', 'Rodriguez PeÃ±a 34', 0),
(8, 5, 'Michael Jordan', '12121212', '23232323', 'jordan@bulls.com', 'alguna calle de EEUU', 0),
(9, 1, 'Luly', '27335471364', '2346615432', 'luly@gmail.com', 'Humberto Primo 61', 0);

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
(1, 1, 'PENDIENTE', 1, 1, NULL, 0),
(2, 2, 'FINALIZADO', 2, 2, NULL, 0),
(3, 1, 'EN PROCESO', 3, 3, NULL, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `order_base`
--

CREATE TABLE `order_base` (
  `id` int(11) NOT NULL,
  `idClient` int(11) NOT NULL,
  `idVehicle` int(11) NOT NULL,
  `idOrderTask` int(11) NOT NULL,
  `deleted` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `order_base`
--

INSERT INTO `order_base` (`id`, `idClient`, `idVehicle`, `idOrderTask`, `deleted`) VALUES
(1, 1, 2, 3, 0),
(2, 2, 1, 2, 0),
(3, 3, 3, 1, 0),
(4, 3, 1, 1, 0);

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
  `deleted` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `token`, `token_auth_date`, `deleted`) VALUES
(3, 'Matias', 'mat@test.com', '$2y$10$utjooAOUrB40XwI7fXjIs.laS3t1uKA5pzCXo08lOcGNDnBEqiz5y', 'ad0b706700ddcab9d0fd509b22925985', '2025-09-16 22:20:45', 0),
(4, 'Maxi', 'maxi@test.com', '$2y$10$t5EWKYfNzCyuQE6mi1/b1OmVXQwI51bPo5VdFmPoN5uys1c9nvXZO', '905c3ea79f816e5ea76141b80e96f93f', '2025-09-17 21:02:20', 0),
(5, 'Ivan', 'ivan@test.com', '$2y$10$exuHVuxiOx0YOfHK//TdrOI47X9a5mEwAEhwaHkfIQmrpaDhzPkru', '7cb9d11b6b51a416340a55fc10312944', '2025-10-15 20:40:59', 0);

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
(5, 7, 'zzz123', 'Fiat', '600', 1965, 0);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `employed`
--
ALTER TABLE `employed`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `orderTask`
--
ALTER TABLE `orderTask`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `order_base`
--
ALTER TABLE `order_base`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `vehicle`
--
ALTER TABLE `vehicle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
