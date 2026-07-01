-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: schoolhealthdb
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `Id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ParentId` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `FullName` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `PhoneNumber` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Role` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Address` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Email` (`Email`),
  KEY `FK_Account_Parent` (`ParentId`),
  KEY `IDX_Account_Role` (`Role`),
  CONSTRAINT `FK_Account_Parent` FOREIGN KEY (`ParentId`) REFERENCES `accounts` (`Id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES ('829d08bc-e205-44aa-81ba-b294802ee092',NULL,'Quang Hai Nam','QHNam323@gmail.com','$2a$11$MxQ0.bEcFZpJ5myvBV8G6.dXJMPWoNb74v94w.k4izjVxnS9dx0zG','09328882','Parent','192/392 D2 Street','Active'),('82fce811-963c-4b5c-b111-1c750a7dd86f',NULL,'Admin','admin@gmail.com','$2a$12$8SMv3ZXPQWB4dWeCNDjqG.9hArHun5r.04KPSpFqus1Z4hzhGSCmq','0904848747','Admin','64/1B Cà Street','Active'),('9891e6b6-76d7-45fa-9cb9-8116cc780c6d',NULL,'Sarah Johnson','SarahJ2@gmail.com','$2a$12$3KN0iPXlvXmpWkfleBoiD.vt2ct7tiuOmh3iiuxMUat3ivRTO2JvC','09021328723','SchoolNurse','11/AB/F3 Draf Street','Active'),('ccc8b802-98cf-46b7-948a-b12e03191d31','829d08bc-e205-44aa-81ba-b294802ee092','Lantern Intern','int293@gmail.com','$2a$11$LlQy5lTihUsPipkboIqTLunAltHFvPs5KlAbNTV7UA5hYXwmIBhrm','093208327','Student','685/30/41, Xo Viet Nghe Tinh, Binh Thanh district','Active'),('ccc8b812-98cf-46b7-948c-b12e03191d31',NULL,'Phan Phu An','PhuAn2883@gmail.com','$2a$12$3KN0iPXlvXmpWkfleBoiD.vt2ct7tiuOmh3iiuxMUat3ivRTO2JvC','09038884723','SchoolNurse','99/28 Log Street','Active'),('cef7cb97-689b-4e9c-b073-9826b9ba8f36',NULL,'Be Van Quang','BeVQ@gmail.com','$2a$12$oRj9.URxtn7O.IK69mOPu.mKuWCznagq8WBgptTro7hHscD1/O1L6','0908888123','Parent','82/3A Apple Pie Street, Binh Thanh District','Active'),('fa0a9e7d-14c8-4c68-bb13-1b56abc5dc7a','cef7cb97-689b-4e9c-b073-9826b9ba8f36','Nguyen Hai An','HaiAn@fppt.edu.com','$2a$11$VnxoM6q8K6FzY8D1qHqiiOHG7dJarCr/urzmWNtCa0/4ltICcQf3u','090482193','Student','82/3A Apple Street','Active'),('zb339e8d-13cz-4c68-1f13-1236abc5dc7a',NULL,'Wetherian','We@fppt.edu.com','$11$VnxoM6q8K6FzY8D1qHqiiOHG7dJarCr/urzmWNtCa0/4ltICcQf3u','0903882738','Student','64/1B Cà Street','NotLinked');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `healthcheckupevents`
--

DROP TABLE IF EXISTS `healthcheckupevents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `healthcheckupevents` (
  `Id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `StudentId` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CreatedBy` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ShortDescription` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `DateOccurred` datetime NOT NULL,
  `DateSignupStart` datetime DEFAULT NULL,
  `DateSignupEnd` datetime DEFAULT NULL,
  `Status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IDX_HealthCheckupEvent_CreatedBy` (`CreatedBy`),
  KEY `IDX_HealthCheckupEvent_StudentId` (`StudentId`),
  CONSTRAINT `FK_HealthCheckupEvent_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `accounts` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_HealthCheckupEvent_Student` FOREIGN KEY (`StudentId`) REFERENCES `accounts` (`Id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `healthcheckupevents`
--

LOCK TABLES `healthcheckupevents` WRITE;
/*!40000 ALTER TABLE `healthcheckupevents` DISABLE KEYS */;
/*!40000 ALTER TABLE `healthcheckupevents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incidentrecords`
--

DROP TABLE IF EXISTS `incidentrecords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incidentrecords` (
  `Id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `StudentId` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `HandleBy` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `IncidentType` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `DateOccurred` datetime NOT NULL,
  `Status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IDX_IncidentRecord_StudentId` (`StudentId`),
  KEY `IDX_IncidentRecord_HandleBy` (`HandleBy`),
  CONSTRAINT `FK_IncidentRecord_HandleBy` FOREIGN KEY (`HandleBy`) REFERENCES `accounts` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_IncidentRecord_Student` FOREIGN KEY (`StudentId`) REFERENCES `accounts` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incidentrecords`
--

LOCK TABLES `incidentrecords` WRITE;
/*!40000 ALTER TABLE `incidentrecords` DISABLE KEYS */;
INSERT INTO `incidentrecords` VALUES ('dfb66d8d-2b87-44a6-a685-2e792b6d1840','ccc8b802-98cf-46b7-948a-b12e03191d31','9891e6b6-76d7-45fa-9cb9-8116cc780c6d','Wa','Waa','2025-07-10 10:59:00','Active');
/*!40000 ALTER TABLE `incidentrecords` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicalsupplies`
--

DROP TABLE IF EXISTS `medicalsupplies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicalsupplies` (
  `Id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `CreatedBy` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `Amount` int NOT NULL,
  `IsAvailable` tinyint(1) NOT NULL DEFAULT '1',
  `IsDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`),
  KEY `IDX_MedicalSupply_CreatedBy` (`CreatedBy`),
  CONSTRAINT `FK_MedicalSupply_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `accounts` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicalsupplies`
--

LOCK TABLES `medicalsupplies` WRITE;
/*!40000 ALTER TABLE `medicalsupplies` DISABLE KEYS */;
/*!40000 ALTER TABLE `medicalsupplies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicinerequests`
--

DROP TABLE IF EXISTS `medicinerequests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicinerequests` (
  `Id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `RequestBy` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ForStudent` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `DateSent` datetime NOT NULL,
  `Status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IDX_MedicineRequest_RequestBy` (`RequestBy`),
  KEY `IDX_MedicineRequest_ForStudent` (`ForStudent`),
  CONSTRAINT `FK_MedicineRequest_ForStudent` FOREIGN KEY (`ForStudent`) REFERENCES `accounts` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_MedicineRequest_RequestBy` FOREIGN KEY (`RequestBy`) REFERENCES `accounts` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicinerequests`
--

LOCK TABLES `medicinerequests` WRITE;
/*!40000 ALTER TABLE `medicinerequests` DISABLE KEYS */;
INSERT INTO `medicinerequests` VALUES ('5ca98c73-6600-47c8-8dfa-48025fba985e','cef7cb97-689b-4e9c-b073-9826b9ba8f36','fa0a9e7d-14c8-4c68-bb13-1b56abc5dc7a','Pafleocn - 200mg - 1 lan','2025-07-26 11:37:34','Pending'),('aa3d855f-18c6-451d-abec-2e5b10b791a8','cef7cb97-689b-4e9c-b073-9826b9ba8f36','fa0a9e7d-14c8-4c68-bb13-1b56abc5dc7a','wadwad','2025-07-26 11:09:10','Pending'),('d6c7330d-08cc-4ab9-85bb-6793981e887c','cef7cb97-689b-4e9c-b073-9826b9ba8f36','fa0a9e7d-14c8-4c68-bb13-1b56abc5dc7a','Prifcolen 100mg - 1 - 2 per day\nSilizion - 1 - 2 per day - After Eating','2025-07-15 15:40:42','Pending'),('e915ab67-cba5-4a2b-8b62-4361f10547ee','cef7cb97-689b-4e9c-b073-9826b9ba8f36','fa0a9e7d-14c8-4c68-bb13-1b56abc5dc7a','Awake 100mg - 1 - 2 per day\nSilizion - 1 - 2 per day - After Eating\nadwadwadwadwadwa AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaaAWE','2025-07-15 15:48:35','Pending');
/*!40000 ALTER TABLE `medicinerequests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicines`
--

DROP TABLE IF EXISTS `medicines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicines` (
  `Id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `CreatedBy` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `Amount` int NOT NULL,
  `IsAvailable` tinyint(1) NOT NULL DEFAULT '1',
  `IsDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`),
  KEY `IDX_Medicine_CreatedBy` (`CreatedBy`),
  CONSTRAINT `FK_Medicine_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `accounts` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicines`
--

LOCK TABLES `medicines` WRITE;
/*!40000 ALTER TABLE `medicines` DISABLE KEYS */;
INSERT INTO `medicines` VALUES ('185b3ab2-3aa0-4fc4-a62e-f60e1dcd03d6','9891e6b6-76d7-45fa-9cb9-8116cc780c6d','Cetirizine 200mg','	Allergy relief antihistamine',10,1,0),('24c7686c-3b89-4e7b-b5db-87a471aa7be3','9891e6b6-76d7-45fa-9cb9-8116cc780c6d','Omeprazole 150mg','	Acid reflux and heartburn relief',7,1,0),('63a56dc6-c243-4b29-bc28-593fcfbe4093','9891e6b6-76d7-45fa-9cb9-8116cc780c6d','Paracetamol 100mg','Pain reliever and fever reducer',25,1,0),('8c6a1126-2c8f-4949-bd4b-816bc7afb08d','9891e6b6-76d7-45fa-9cb9-8116cc780c6d','Iofjdwio 3mg','Cure cat',300,1,0),('c53e1711-e124-4c43-a22b-6a5bb4d3dd44','9891e6b6-76d7-45fa-9cb9-8116cc780c6d','Opziwjd 80mg','Cure dog',20,1,0),('d502cb42-0c57-4ab3-bdd2-e6fc17e01d4a','9891e6b6-76d7-45fa-9cb9-8116cc780c6d','Ibuprofen 50mg','Nonsteroidal anti-inflammatory drug',15,1,0),('e14ccba6-2012-44df-8e24-6339c983b60e','82fce811-963c-4b5c-b111-1c750a7dd86f','Paracetamol 100mg','Cure alive',200,1,1);
/*!40000 ALTER TABLE `medicines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_healthcheckup`
--

DROP TABLE IF EXISTS `student_healthcheckup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_healthcheckup` (
  `Id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `EventId` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `StudentId` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ResultSummary` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `Status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `EventId` (`EventId`),
  KEY `StudentId` (`StudentId`),
  CONSTRAINT `student_healthcheckup_ibfk_1` FOREIGN KEY (`EventId`) REFERENCES `healthcheckupevents` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `student_healthcheckup_ibfk_2` FOREIGN KEY (`StudentId`) REFERENCES `accounts` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_healthcheckup`
--

LOCK TABLES `student_healthcheckup` WRITE;
/*!40000 ALTER TABLE `student_healthcheckup` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_healthcheckup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_vaccinecheckup`
--

DROP TABLE IF EXISTS `student_vaccinecheckup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_vaccinecheckup` (
  `Id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `EventId` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `StudentId` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ResultSummary` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `Status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `EventId` (`EventId`),
  KEY `StudentId` (`StudentId`),
  CONSTRAINT `student_vaccinecheckup_ibfk_1` FOREIGN KEY (`EventId`) REFERENCES `vaccineevents` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `student_vaccinecheckup_ibfk_2` FOREIGN KEY (`StudentId`) REFERENCES `accounts` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_vaccinecheckup`
--

LOCK TABLES `student_vaccinecheckup` WRITE;
/*!40000 ALTER TABLE `student_vaccinecheckup` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_vaccinecheckup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studenthealthrecords`
--

DROP TABLE IF EXISTS `studenthealthrecords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studenthealthrecords` (
  `Id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `StudentId` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `CreatedBy` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Height` int DEFAULT NULL,
  `Allergies` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `ChronicDiseases` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `Vision` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `Hearing` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `Status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IDX_StudentHealthRecord_StudentId` (`StudentId`),
  KEY `IDX_StudentHealthRecord_CreatedBy` (`CreatedBy`),
  CONSTRAINT `FK_StudentHealthRecord_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `accounts` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_StudentHealthRecord_Student` FOREIGN KEY (`StudentId`) REFERENCES `accounts` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studenthealthrecords`
--

LOCK TABLES `studenthealthrecords` WRITE;
/*!40000 ALTER TABLE `studenthealthrecords` DISABLE KEYS */;
INSERT INTO `studenthealthrecords` VALUES ('42ad65aa-50ff-465c-8290-e128a689731e','fa0a9e7d-14c8-4c68-bb13-1b56abc5dc7a','cef7cb97-689b-4e9c-b073-9826b9ba8f36',150,'Peanut Butter','Covid','Far-sight','Minor Hearing Issue (Require loud speaking)',NULL);
/*!40000 ALTER TABLE `studenthealthrecords` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treatmentrecords`
--

DROP TABLE IF EXISTS `treatmentrecords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treatmentrecords` (
  `Id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `StudentId` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `StudentHealthRecordId` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `RecordDate` datetime NOT NULL,
  `Treatment` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `Status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IDX_TreatmentRecord_StudentId` (`StudentId`),
  KEY `IDX_TreatmentRecord_StudentHealthRecordId` (`StudentHealthRecordId`),
  CONSTRAINT `FK_TreatmentRecord_Student` FOREIGN KEY (`StudentId`) REFERENCES `accounts` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_TreatmentRecord_StudentHealthRecord` FOREIGN KEY (`StudentHealthRecordId`) REFERENCES `studenthealthrecords` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatmentrecords`
--

LOCK TABLES `treatmentrecords` WRITE;
/*!40000 ALTER TABLE `treatmentrecords` DISABLE KEYS */;
/*!40000 ALTER TABLE `treatmentrecords` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vaccineevents`
--

DROP TABLE IF EXISTS `vaccineevents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vaccineevents` (
  `Id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `StudentId` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CreatedBy` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ShortDescription` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `DateOccurred` datetime NOT NULL,
  `DateSignupStart` datetime DEFAULT NULL,
  `DateSignupEnd` datetime DEFAULT NULL,
  `Status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IDX_VaccineEvent_CreatedBy` (`CreatedBy`),
  KEY `IDX_VaccineEvent_StudentId` (`StudentId`),
  CONSTRAINT `FK_VaccineEvent_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `accounts` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_VaccineEvent_Student` FOREIGN KEY (`StudentId`) REFERENCES `accounts` (`Id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vaccineevents`
--

LOCK TABLES `vaccineevents` WRITE;
/*!40000 ALTER TABLE `vaccineevents` DISABLE KEYS */;
/*!40000 ALTER TABLE `vaccineevents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vaccinerecords`
--

DROP TABLE IF EXISTS `vaccinerecords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vaccinerecords` (
  `Id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `StudentId` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `StudentHealthRecordId` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `RecordDate` datetime NOT NULL,
  `Vaccine` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `Status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IDX_VaccineRecord_StudentId` (`StudentId`),
  KEY `IDX_VaccineRecord_StudentHealthRecordId` (`StudentHealthRecordId`),
  CONSTRAINT `FK_VaccineRecord_Student` FOREIGN KEY (`StudentId`) REFERENCES `accounts` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_VaccineRecord_StudentHealthRecord` FOREIGN KEY (`StudentHealthRecordId`) REFERENCES `studenthealthrecords` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vaccinerecords`
--

LOCK TABLES `vaccinerecords` WRITE;
/*!40000 ALTER TABLE `vaccinerecords` DISABLE KEYS */;
/*!40000 ALTER TABLE `vaccinerecords` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-01 11:34:43
