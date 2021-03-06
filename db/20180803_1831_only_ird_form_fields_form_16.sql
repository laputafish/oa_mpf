-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.1.9-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win32
-- HeidiSQL Version:             9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table yoov_api_bak0803_1831.ird_form_file_fields
DROP TABLE IF EXISTS `ird_form_file_fields`;
CREATE TABLE IF NOT EXISTS `ird_form_file_fields` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ird_form_file_id` int(10) unsigned NOT NULL DEFAULT '0',
  `key` varchar(50) NOT NULL,
  `type` enum('string','char','segments') NOT NULL DEFAULT 'string',
  `is_ird_fields` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `hidden` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `blank_if_zero` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `seq_no` int(10) unsigned NOT NULL DEFAULT '0',
  `seq_sub_no` int(10) unsigned NOT NULL DEFAULT '0',
  `x` float unsigned NOT NULL DEFAULT '0',
  `y` float unsigned NOT NULL DEFAULT '0',
  `font_size` int(10) unsigned NOT NULL DEFAULT '12',
  `font_style` varchar(10) NOT NULL DEFAULT '',
  `border_style` varchar(10) NOT NULL DEFAULT '',
  `relative_to` enum('global','key') NOT NULL DEFAULT 'global',
  `relative_to_key_id` int(10) unsigned NOT NULL DEFAULT '0',
  `width` int(10) unsigned NOT NULL DEFAULT '100',
  `field_count` int(10) unsigned NOT NULL DEFAULT '0',
  `align` enum('L','R','C') NOT NULL DEFAULT 'L',
  `char_align` enum('L','R','C','unused') NOT NULL DEFAULT 'C',
  `lang` enum('eng','chn','symbol') NOT NULL DEFAULT 'eng',
  `append_asterisk` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `to_currency` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `remark` text,
  `is_symbol` tinyint(1) DEFAULT '0',
  `for_testing_only` tinyint(1) unsigned DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=808 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table yoov_api_bak0803_1831.ird_form_file_fields: ~493 rows (approximately)
/*!40000 ALTER TABLE `ird_form_file_fields` DISABLE KEYS */;
INSERT INTO `ird_form_file_fields` (`id`, `ird_form_file_id`, `key`, `type`, `is_ird_fields`, `hidden`, `blank_if_zero`, `seq_no`, `seq_sub_no`, `x`, `y`, `font_size`, `font_style`, `border_style`, `relative_to`, `relative_to_key_id`, `width`, `field_count`, `align`, `char_align`, `lang`, `append_asterisk`, `to_currency`, `remark`, `is_symbol`, `for_testing_only`) VALUES
	(111, 16, 'ERN', 'string', 1, 1, 1, 2, 0, 48, 35, 12, '', '', 'global', 0, 90, 0, 'L', 'C', 'eng', 1, 0, '', 0, 0),
	(112, 16, 'ErName', 'string', 1, 0, 1, 5, 0, 48, 35, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, '', 0, 0),
	(114, 16, 'Surname', 'string', 1, 0, 1, 9, 4, 100, 39, 10, '', '', 'global', 0, 90, 0, 'L', 'C', 'eng', 1, 0, '', 0, 0),
	(115, 16, 'NameInChinese', 'string', 1, 0, 1, 9, 6, 48, 48, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'chn', 0, 0, '', 0, 0),
	(116, 16, 'HKID', 'string', 1, 0, 1, 9, 2, 100, 53, 12, '', '', 'global', 0, 90, 0, 'L', 'C', 'eng', 1, 0, '', 0, 0),
	(117, 16, 'PpNum', 'string', 1, 0, 1, 9, 9, 120, 57.5, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 1, 0, '', 0, 0),
	(118, 16, 'Sex', 'string', 1, 0, 1, 9, 7, 120, 62.5, 12, '', '', 'global', 0, 90, 0, 'L', 'C', 'eng', 1, 0, '', 0, 0),
	(119, 16, 'MaritalStatus', 'string', 1, 0, 1, 9, 8, 100, 67, 12, '', '', 'global', 0, 90, 0, 'L', 'C', 'eng', 1, 0, '', 0, 0),
	(120, 16, 'SpouseName', 'string', 1, 0, 1, 9, 10, 68, 71.5, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, '', 0, 0),
	(121, 16, 'SpouseHKID', 'string', 1, 0, 1, 9, 11, 77, 75.5, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, '', 0, 0),
	(122, 16, 'SpousePpNum', 'string', 1, 0, 1, 9, 12, 100, 79, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, '', 0, 0),
	(123, 16, 'ResAddr', 'string', 1, 0, 1, 9, 13, 48, 83.4, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, '', 0, 0),
	(124, 16, 'PosAddr', 'string', 1, 0, 1, 9, 15, 80, 87.2, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, '', 0, 0),
	(125, 16, 'Capacity', 'string', 1, 0, 1, 9, 16, 68, 91.5, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, '', 0, 0),
	(126, 16, 'EndDateOfEmp', 'string', 1, 0, 1, 9, 19, 12, 100, 12, '', '', 'global', 0, 90, 0, 'L', 'C', 'eng', 1, 0, '', 0, 0),
	(142, 16, 'Remarks', 'string', 1, 0, 1, 9, 71, 88, 273.3, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, '', 0, 0),
	(143, 16, 'Designation', 'string', 1, 0, 1, 6, 0, 103, 268.5, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, '', 0, 0),
	(260, 16, 'Section', 'string', 1, 1, 1, 1, 0, 48, 35, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(261, 16, 'SubDate', 'string', 1, 0, 1, 4, 0, 103, 273, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(262, 16, 'YrErReturn', 'string', 1, 1, 1, 3, 0, 0, 0, 12, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(263, 16, 'NoRecordBatch', 'string', 1, 1, 1, 7, 0, 0, 0, 12, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(264, 16, 'TotIncomeBatch', 'string', 1, 1, 1, 8, 0, 0, 0, 12, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(265, 16, 'SheetNo', 'string', 1, 0, 1, 9, 1, 150, 27, 12, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 1, 0, NULL, 0, 0),
	(266, 16, 'TypeOfForm', 'string', 1, 1, 1, 9, 3, 0, 0, 12, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(267, 16, 'GivenName', 'string', 1, 0, 1, 9, 5, 48, 43.5, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(268, 16, 'AreaCodeResAddr', 'string', 1, 0, 1, 9, 14, 0, 0, 12, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(269, 16, 'PtPrinEmp', 'string', 1, 0, 1, 9, 17, 111, 95.5, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(270, 16, 'StartDateOfEmp', 'string', 1, 0, 1, 9, 18, 140, 100, 12, 'B', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(271, 16, 'PerOfSalary', 'string', 1, 0, 1, 9, 20, 130, 116.5, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(272, 16, 'AmtOfSalary', 'string', 1, 0, 0, 9, 21, 160, 116.5, 10, '', '', 'global', 0, 30, 0, 'R', 'C', 'eng', 0, 0, NULL, 0, 0),
	(273, 16, 'PerOfLeavePay', 'string', 1, 0, 1, 9, 22, 130, 120.6, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(274, 16, 'AmtOfLeavePay', 'string', 1, 0, 1, 9, 23, 160, 120.6, 10, '', '', 'global', 0, 30, 0, 'R', 'C', 'eng', 0, 0, NULL, 0, 0),
	(275, 16, 'PerOfDirectorFee', 'string', 1, 0, 1, 9, 24, 130, 124.7, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(276, 16, 'AmtOfDirectorFee', 'string', 1, 0, 1, 9, 25, 160, 124.7, 10, '', '', 'global', 0, 30, 0, 'R', 'C', 'eng', 0, 0, NULL, 0, 0),
	(277, 16, 'PerOfCommFee', 'string', 1, 0, 1, 9, 26, 130, 128.8, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(278, 16, 'AmtOfCommFee', 'string', 1, 0, 1, 9, 27, 160, 128.8, 10, '', '', 'global', 0, 30, 0, 'R', 'C', 'eng', 0, 0, NULL, 0, 0),
	(279, 16, 'PerOfBonus', 'string', 1, 0, 1, 9, 28, 130, 132.9, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(280, 16, 'AmtOfBonus', 'string', 1, 0, 1, 9, 29, 160, 132.9, 10, '', '', 'global', 0, 30, 0, 'R', 'C', 'eng', 0, 0, NULL, 0, 0),
	(281, 16, 'PerOfBpEtc', 'string', 1, 0, 1, 9, 30, 130, 137, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(282, 16, 'AmtOfBpEtc', 'string', 1, 0, 1, 9, 31, 160, 137, 10, '', '', 'global', 0, 30, 0, 'R', 'C', 'eng', 0, 0, NULL, 0, 0),
	(283, 16, 'PerOfPayRetire', 'string', 1, 0, 1, 9, 32, 130, 141.1, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(284, 16, 'AmtOfPayRetire', 'string', 1, 0, 1, 9, 33, 160, 141.1, 10, '', '', 'global', 0, 30, 0, 'R', 'C', 'eng', 0, 0, NULL, 0, 0),
	(285, 16, 'PerOfSalTaxPaid', 'string', 1, 0, 1, 9, 34, 130, 145.2, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(286, 16, 'AmtOfSalTaxPaid', 'string', 1, 0, 1, 9, 35, 160, 145.2, 10, '', '', 'global', 0, 30, 0, 'R', 'C', 'eng', 0, 0, NULL, 0, 0),
	(287, 16, 'PerOfEduBen', 'string', 1, 0, 1, 9, 36, 130, 149.3, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(288, 16, 'AmtOfEduBen', 'string', 1, 0, 1, 9, 37, 160, 149.3, 10, '', '', 'global', 0, 30, 0, 'R', 'C', 'eng', 0, 0, NULL, 0, 0),
	(289, 16, 'PerOfGainShareOption', 'string', 1, 0, 1, 9, 38, 130, 153.4, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(290, 16, 'AmtOfGainShareOption', 'string', 1, 0, 1, 9, 39, 160, 153.4, 10, '', '', 'global', 0, 30, 0, 'R', 'C', 'eng', 0, 0, NULL, 0, 0),
	(291, 16, 'NatureOtherRAP1', 'string', 1, 0, 1, 9, 40, 0, 0, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(292, 16, 'PerOfOtherRAP1', 'string', 1, 0, 1, 9, 41, 0, 0, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(293, 16, 'AmtOfOtherRAP1', 'string', 1, 0, 1, 9, 42, 0, 0, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(294, 16, 'NatureOtherRAP2', 'string', 1, 0, 1, 9, 43, 0, 0, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(295, 16, 'PerOfOtherRAP2', 'string', 1, 0, 1, 9, 44, 0, 0, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(296, 16, 'AmtOfOtherRAP2', 'string', 1, 0, 1, 9, 45, 0, 0, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(297, 16, 'NatureOtherRAP3', 'string', 1, 0, 1, 9, 46, 0, 0, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(298, 16, 'PerOfOtherRAP3', 'string', 1, 0, 1, 9, 47, 0, 0, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(299, 16, 'AmtOfOtherRAP3', 'string', 1, 0, 1, 9, 48, 0, 0, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(300, 16, 'PerOfPension', 'string', 1, 0, 1, 9, 49, 130, 173.5, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(301, 16, 'AmtOfPension', 'string', 1, 0, 1, 9, 50, 160, 173.5, 10, '', '', 'global', 0, 30, 0, 'R', 'C', 'eng', 0, 0, NULL, 0, 0),
	(302, 16, 'TotalIncome', 'string', 1, 0, 0, 9, 51, 160, 178, 12, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 1, 0, NULL, 0, 0),
	(303, 16, 'PlaceOfResInd', 'string', 1, 0, 1, 9, 52, 0, 182.2, 12, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 1, 0, NULL, 0, 0),
	(304, 16, 'AddrOfPlace1', 'string', 1, 0, 1, 9, 53, 35, 187, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(305, 16, 'NatureOfPlace1', 'string', 1, 0, 1, 9, 54, 50, 191.2, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(306, 16, 'PerOfPlace1', 'string', 1, 0, 1, 9, 55, 110, 191.2, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(307, 16, 'RentPaidEr1', 'string', 1, 0, 1, 9, 56, 160, 195.4, 10, '', '', 'global', 0, 30, 0, 'R', 'C', 'eng', 0, 0, NULL, 0, 0),
	(308, 16, 'RentPaidEe1', 'string', 1, 0, 1, 9, 57, 160, 199.6, 10, '', '', 'global', 0, 30, 0, 'R', 'C', 'eng', 0, 0, NULL, 0, 0),
	(309, 16, 'RentRefund1', 'string', 1, 0, 1, 9, 58, 160, 203.8, 10, '', '', 'global', 0, 30, 0, 'R', 'C', 'eng', 0, 0, NULL, 0, 0),
	(310, 16, 'RentPaidErByEe1', 'string', 1, 0, 1, 9, 59, 160, 208, 10, '', '', 'global', 0, 30, 0, 'R', 'C', 'eng', 0, 0, NULL, 0, 0),
	(311, 16, 'AddrOfPlace2', 'string', 1, 0, 1, 9, 60, 35, 211.5, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(312, 16, 'NatureOfPlace2', 'string', 1, 0, 1, 9, 61, 50, 215.7, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(313, 16, 'PerOfPlace2', 'string', 1, 0, 1, 9, 62, 110, 215.7, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(314, 16, 'RentPaidEr2', 'string', 1, 0, 1, 9, 63, 160, 219.5, 10, '', '', 'global', 0, 30, 0, 'R', 'C', 'eng', 0, 0, NULL, 0, 0),
	(315, 16, 'RentPaidEe2', 'string', 1, 0, 1, 9, 64, 160, 223.7, 10, '', '', 'global', 0, 30, 0, 'R', 'C', 'eng', 0, 0, NULL, 0, 0),
	(316, 16, 'RentRefund2', 'string', 1, 0, 1, 9, 65, 160, 227.9, 10, '', '', 'global', 0, 30, 0, 'R', 'C', 'eng', 0, 0, NULL, 0, 0),
	(317, 16, 'RentPaidErByEe2', 'string', 1, 0, 1, 9, 66, 160, 232.1, 10, '', '', 'global', 0, 30, 0, 'R', 'C', 'eng', 0, 0, NULL, 0, 0),
	(318, 16, 'OverseaIncInd', 'string', 1, 0, 1, 9, 67, 0, 237, 12, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 1, 0, NULL, 0, 0),
	(319, 16, 'AmtPaidOverseaCo', 'string', 1, 0, 1, 9, 68, 110, 257, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(320, 16, 'NameOfOverseaCo', 'string', 1, 0, 1, 9, 69, 75, 248.5, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(321, 16, 'AddrOfOverseaCo', 'string', 1, 0, 1, 9, 70, 30, 253, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(322, 16, 'HeaderPeriod', 'string', 0, 0, 1, 0, 1, 0, 20, 10, 'B', '', 'global', 0, 210, 0, 'C', 'C', 'eng', 0, 0, NULL, 0, 0),
	(323, 16, 'EmpPeriod', 'string', 0, 0, 1, 0, 2, 43, 100.3, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(324, 16, 'FileNo', 'string', 0, 0, 1, 0, 4, 48, 30.5, 10, '', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(325, 16, 'IncPeriod', 'string', 0, 0, 1, 0, 3, 10.8, 104.7, 10, 'U', '', 'global', 0, 100, 0, 'L', 'C', 'eng', 0, 0, NULL, 0, 0),
	(754, 16, 'HeaderForTestingOnlyLabel', 'string', 0, 0, 1, 0, 0, 0, 15, 14, '', '', 'global', 0, 200, 0, 'R', 'C', 'eng', 0, 0, NULL, 0, 1);
