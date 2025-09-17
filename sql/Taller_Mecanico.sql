-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: mysql:3306
-- Tiempo de generación: 17-09-2025 a las 00:13:35
-- Versión del servidor: 5.7.44
-- Versión de PHP: 8.2.28

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
  `dni` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `cuitCuil` varchar(20) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `createdAt` date NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `modifiedBy` varchar(255) NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `client`
--

INSERT INTO `client` (`id`, `dni`, `name`, `cuitCuil`, `address`, `city`, `province`, `email`, `phone`, `createdAt`, `createdBy`, `modifiedBy`, `deleted`) VALUES
(13, 37228294, 'Maximiliano Trotta', '20-37228294-1 ', 'Tucuman 432', 'Chivilcoy', 'Buenos Aires', 'maxi@hotmail.com', '+549-2346-508311', '2025-09-03', 'admin', 'admin', 0),
(14, 35051721, 'Ivan Bontempo', '23-35051721-9 ', 'Humberto Primero 61', 'Chivilcoy', 'Buenos Aires', 'ivan@hotmail.com', '+549-2346-508314', '2025-09-03', 'admin', 'admin', 0),
(15, 47140334, 'Julia Viretto Irrazabal', '27-47140334-8 ', 'Fortin Mulitas 175', 'Norberto de la Riestra', 'Buenos Aires', 'Julia_Lobahotmail.com', '+549-2346-503311', '2025-09-03', 'admin', 'admin', 0),
(16, 41146294, 'Patricio Perroud', '20-41146294-4 ', 'General Frias 372', 'Chivilcoy', 'Buenos Aires', 'pato_perroud@hotmail.com', '+549-2346-558311', '2025-09-03', 'admin', 'admin', 0),
(17, 45626557, 'GianFranco Caporaletti', '20-45626557-0 ', 'Islas Malvinas 850', 'Pedernales', 'Buenos Aires', 'Gianfranco_capo@hotmail.com', '+549-2346-508311', '2025-09-03', 'admin', 'admin', 0),
(18, 45040569, 'Valentin Chavez', '20-45040569-9 ', 'Pellegrini 1644', 'Bragado', 'Buenos Aires', 'Valen_chavez@hotmail.com', '+549-2346-568311', '2025-09-03', 'admin', 'admin', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `domain`
--

CREATE TABLE `domain` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `deleted` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `domain`
--

INSERT INTO `domain` (`id`, `name`, `code`, `deleted`) VALUES
(1, 'maxi', '1234', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `employed`
--

CREATE TABLE `employed` (
  `id` int(11) NOT NULL,
  `id_sector` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `cuil` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `deleted` tinyint(4) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `id_vehicle` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `order_task`
--

CREATE TABLE `order_task` (
  `id` int(11) NOT NULL,
  `id_order` int(11) NOT NULL,
  `state` varchar(255) NOT NULL,
  `id_sector` int(11) NOT NULL,
  `status_date` datetime NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sector`
--

CREATE TABLE `sector` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `task`
--

CREATE TABLE `task` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
  `token_auth_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `token`, `token_auth_date`) VALUES
(1, 'maxi', 'maxi@gmail.com', '$2y$10$ta4mYCAPhRo5NaxvlBhv4uq2Bmon2kchuLPlbrtXSqc8Wr6XTfy1C', 'b54279b1fb3bcfd139f0ac6f23bc21dd', '2025-09-16 20:31:26'),
(2, 'ivan', 'ivan@gmail.com', '$2y$10$toIt9t/6imchqFcCjigndOdlCglQFXY/HJ5fSyN05vVnGwOsday66', '4c132b0f3f3ac46231fbdb09e87be912', '2025-09-10 20:30:35');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vehicle`
--

CREATE TABLE `vehicle` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `license_plate` varchar(255) NOT NULL,
  `brand` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `year` int(11) NOT NULL,
  `deleted` int(11) NOT NULL,
  `is_finished` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `domain`
--
ALTER TABLE `domain`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `employed`
--
ALTER TABLE `employed`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_sector` (`id_sector`),
  ADD KEY `id_sector_2` (`id_sector`);

--
-- Indices de la tabla `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_vehicle` (`id_vehicle`),
  ADD KEY `id_cliente` (`id_cliente`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `order_task`
--
ALTER TABLE `order_task`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `id_vehicle` (`id_order`),
  ADD KEY `id_sector` (`id_sector`),
  ADD KEY `user_id` (`user_id`);

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
  ADD KEY `client_id` (`client_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `client`
--
ALTER TABLE `client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `domain`
--
ALTER TABLE `domain`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `employed`
--
ALTER TABLE `employed`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `order_task`
--
ALTER TABLE `order_task`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sector`
--
ALTER TABLE `sector`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `task`
--
ALTER TABLE `task`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `vehicle`
--
ALTER TABLE `vehicle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `employed`
--
ALTER TABLE `employed`
  ADD CONSTRAINT `employed_ibfk_1` FOREIGN KEY (`id_sector`) REFERENCES `sector` (`id`);

--
-- Filtros para la tabla `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `client` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `order_task`
--
ALTER TABLE `order_task`
  ADD CONSTRAINT `order_task_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `order_task_ibfk_2` FOREIGN KEY (`id_order`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_task_ibfk_3` FOREIGN KEY (`id_sector`) REFERENCES `sector` (`id`);

--
-- Filtros para la tabla `vehicle`
--
ALTER TABLE `vehicle`
  ADD CONSTRAINT `vehicle_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
