-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.42 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping database structure for rayvat_ticketmdatabase
CREATE DATABASE IF NOT EXISTS `rayvat_ticketmdatabase` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `rayvat_ticketmdatabase`;

-- Dumping structure for table rayvat_ticketmdatabase.bookingmaster
CREATE TABLE IF NOT EXISTS `bookingmaster` (
  `bookingid` int NOT NULL AUTO_INCREMENT,
  `eventid` int NOT NULL,
  `userid` int NOT NULL,
  `seats` int NOT NULL DEFAULT '1',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '1=Confirmed, 2=Cancelled',
  `isdeleted` tinyint NOT NULL DEFAULT '0' COMMENT '0=Active, 1=Deleted',
  `createddate` datetime NOT NULL,
  `modifieddate` datetime DEFAULT NULL,
  PRIMARY KEY (`bookingid`),
  KEY `idx_bookingmaster_eventid` (`eventid`),
  KEY `idx_bookingmaster_userid` (`userid`),
  CONSTRAINT `fk_bookingmaster_eventid` FOREIGN KEY (`eventid`) REFERENCES `eventmaster` (`eventid`),
  CONSTRAINT `fk_bookingmaster_userid` FOREIGN KEY (`userid`) REFERENCES `usermaster` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table rayvat_ticketmdatabase.bookingmaster: ~0 rows (approximately)

-- Dumping structure for table rayvat_ticketmdatabase.eventmaster
CREATE TABLE IF NOT EXISTS `eventmaster` (
  `eventid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `date` date NOT NULL,
  `capacity` int NOT NULL,
  `availableseats` int NOT NULL,
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '1=Upcoming, 2=Completed, 3=Cancelled',
  `createdby` int NOT NULL,
  `isdeleted` tinyint NOT NULL DEFAULT '0' COMMENT '0=Active, 1=Deleted',
  `createddate` datetime NOT NULL,
  `modifieddate` datetime DEFAULT NULL,
  PRIMARY KEY (`eventid`),
  KEY `idx_eventmaster_date` (`date`),
  KEY `idx_eventmaster_createdby` (`createdby`),
  CONSTRAINT `fk_eventmaster_createdby` FOREIGN KEY (`createdby`) REFERENCES `usermaster` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table rayvat_ticketmdatabase.eventmaster: ~2 rows (approximately)
INSERT INTO `eventmaster` (`eventid`, `name`, `description`, `date`, `capacity`, `availableseats`, `status`, `createdby`, `isdeleted`, `createddate`, `modifieddate`) VALUES
	(1, 'Tech Conference 2026 - Updated', 'Annual technology conference', '2026-02-10', 150, 150, 1, 1, 0, '2026-02-10 18:22:16', '2026-02-10 18:22:59'),
	(2, 'Music Festival', 'Live music event', '2026-02-12', 200, 200, 1, 1, 0, '2026-02-10 18:22:33', '2026-02-10 18:24:15');

-- Dumping structure for table rayvat_ticketmdatabase.usermaster
CREATE TABLE IF NOT EXISTS `usermaster` (
  `userid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` tinyint NOT NULL DEFAULT '2' COMMENT '1=Admin, 2=User',
  `isdeleted` tinyint NOT NULL DEFAULT '0' COMMENT '0=Active, 1=Deleted',
  `createddate` datetime NOT NULL,
  `modifieddate` datetime DEFAULT NULL,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `uk_usermaster_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table rayvat_ticketmdatabase.usermaster: ~2 rows (approximately)
INSERT INTO `usermaster` (`userid`, `name`, `email`, `password`, `role`, `isdeleted`, `createddate`, `modifieddate`) VALUES
	(1, 'Admin User', 'admin@example.com', '$2b$10$FYQ98ujKsbex7Gd2aRZlve680XIagHnnHjwgmqKu8d.kZQlKgVS3O', 1, 0, '2026-02-10 18:20:30', NULL),
	(2, 'John Doe', 'john@example.com', '$2b$10$hK3UYSsn7Syi8FRrdbV8Se3vckj6202TNjKM7sA4az12SS8V9w8g6', 2, 0, '2026-02-10 18:20:41', NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
