SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";
--
CREATE TABLE `personas` (
`id` int(11) NOT NULL,
`nombre` varchar(100) NOT NULL,
`apellidos` varchar(100) NOT NULL,
`fumador` varchar(50) NOT NULL,
`foto` BLOB
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
--
ALTER TABLE `personas`
ADD PRIMARY KEY (`id`);
--
ALTER TABLE `personas`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;