-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               11.0.2-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.3.0.6589
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping structure for function deshbesh.CAP_FIRST
DROP FUNCTION IF EXISTS `CAP_FIRST`;
DELIMITER //
CREATE FUNCTION `CAP_FIRST`(`input` VARCHAR(255)) RETURNS varchar(255) CHARSET latin1 COLLATE latin1_swedish_ci
    DETERMINISTIC
BEGIN
	DECLARE len INT;
	DECLARE i INT;

	SET len   = CHAR_LENGTH(input);
	SET input = LOWER(input);
	SET i = 0;

	WHILE (i < len) DO
		IF (MID(input,i,1) = ' ' OR i = 0) THEN
			IF (i < len) THEN
				SET input = CONCAT(
					LEFT(input,i),
					UPPER(MID(input,i + 1,1)),
					RIGHT(input,len - i - 1)
				);
			END IF;
		END IF;
		SET i = i + 1;
	END WHILE;

	RETURN input;
END//
DELIMITER ;


-- Dumping structure for event deshbesh.COUNTER_SHUFFLE
DROP EVENT IF EXISTS `COUNTER_SHUFFLE`;
DELIMITER //
CREATE EVENT `COUNTER_SHUFFLE` ON SCHEDULE EVERY 1 DAY STARTS '2023-04-06 04:00:00' ON COMPLETION NOT PRESERVE DISABLE DO UPDATE counters AS t1
INNER JOIN (
  SELECT SectorID_id, GROUP_CONCAT(StaffID_id ORDER BY RAND() SEPARATOR '-') AS shuffled_bets
  FROM (
    SELECT SectorID_id, StaffID_id
    FROM counters
    WHERE No != 1 AND StaffID_id IS NOT NULL
  ) AS temp
  GROUP BY SectorID_id
) AS t2
ON t1.SectorID_id = t2.SectorID_id
SET t1.StaffID_id = 
  CASE 
    WHEN t2.shuffled_bets IS NOT NULL THEN 
      SUBSTRING_INDEX(SUBSTRING_INDEX(t2.shuffled_bets, '-', t1.No - 1), '-', -1)
    ELSE t1.StaffID_id
  END
WHERE t1.No != 1
AND t1.StaffID_id IS NOT NULL//
DELIMITER ;


-- Dumping structure for procedure deshbesh.GET_CTR_NO
DROP PROCEDURE IF EXISTS `GET_CTR_NO`;
DELIMITER //
CREATE PROCEDURE `GET_CTR_NO`(
	IN `SectCode` VARCHAR(4),
	IN `SectorID` VARCHAR(35),
	OUT `GetCtrNo` VARCHAR(20)
)
BEGIN
   SELECT MAX(SUBSTR(containers.SerialNo,4,8)) INTO GetCtrNo FROM containers INNER JOIN sectors ON containers.SectorID_id = sectors.id WHERE sectors.id = SectorID;
      IF GetCtrNo IS NULL THEN
        BEGIN
          SELECT CONCAT(SectCode, '00001') INTO GetCtrNo FROM Dual;
        END;
      ELSE
         SELECT CONCAT(SectCode,  SUBSTR(CONCAT(RPAD('0', 5, 0), CAST(MAX(SUBSTR(CONCAT(SectCode, GetCtrNo),4,8))+1 AS CHAR(10) )),-5,5)) INTO GetCtrNo FROM containers INNER JOIN sectors ON containers.SectorID_id = sectors.id WHERE sectors.id = SectorID; 
		END IF;
END//
DELIMITER ;

-- Dumping structure for procedure deshbesh.GET_DEL_NOTE_NO
DROP PROCEDURE IF EXISTS `GET_DEL_NOTE_NO`;
DELIMITER //
CREATE PROCEDURE `GET_DEL_NOTE_NO`(
	IN `SectorNo` VARCHAR(5),
	OUT `GetDeliveryNoteNo` VARCHAR(50)
)
BEGIN
	DECLARE Sector VARCHAR(9);
    SET Sector = LPAD(SectorNo, 3, '0');
    
    SELECT MAX(SUBSTR(DeliveryNote.DeliveryNoteNo,3,14)) INTO GetDeliveryNoteNo 
    FROM DeliveryNote 
    INNER JOIN sectors ON DeliveryNote.SectorID_id = sectors.id 
    WHERE sectors.SLNo = SectorNo;
	
    IF GetDeliveryNoteNo IS NULL THEN
        SET GetDeliveryNoteNo = CONCAT('DN', DATE_FORMAT(CURDATE(), '%y%m%d'), Sector, '0001');
    ELSE
		IF SUBSTR(GetDeliveryNoteNo,1,9) = CONCAT(DATE_FORMAT(CURDATE(), '%y%m%d'), Sector) THEN
            SELECT CONCAT('DN', SUBSTR(GetDeliveryNoteNo,1,6), Sector, LPAD(MAX(SUBSTR(CONCAT(Sector, GetDeliveryNoteNo),14,15)) + 1, 4, '0')) 
            INTO GetDeliveryNoteNo 
            FROM DeliveryNote 
            INNER JOIN sectors ON DeliveryNote.SectorID_id = sectors.id 
            WHERE sectors.SLNo = SectorNo; 
        ELSE 
            SET GetDeliveryNoteNo = '0000000000000';
			SELECT CONCAT('DN', DATE_FORMAT(CURDATE(), '%y%m%d'), Sector, LPAD(MAX(SUBSTR(CONCAT(Sector, GetDeliveryNoteNo),14,15)) + 1, 4, '0')) 
            INTO GetDeliveryNoteNo 
            FROM DeliveryNote 
            INNER JOIN sectors ON DeliveryNote.SectorID_id = sectors.id 
            WHERE sectors.SLNo = SectorNo;
		END IF;
    END IF;
END//
DELIMITER ;

-- Dumping structure for procedure deshbesh.GET_INVOICE_NO
DROP PROCEDURE IF EXISTS `GET_INVOICE_NO`;
DELIMITER //
CREATE PROCEDURE `GET_INVOICE_NO`(
	IN `SectorNo` INT,
	IN `CounterNo` INT,
	OUT `GetInvoiceNo` VARCHAR(25)
)
BEGIN 
DECLARE Sector VARCHAR(9); 
SET Sector = CONCAT(SUBSTR(CONCAT(RPAD('0', 3, 0),SectorNo),-3,3), SUBSTR(CONCAT(RPAD('0', 2, 0),CounterNo),-2,2)); 
SELECT MAX(sale.InvoiceNo) INTO GetInvoiceNo FROM sale INNER JOIN sectors ON sale.SectorID_id = sectors.id INNER JOIN counters ON sale.CounterID_id = counters.id WHERE sectors.SLNo = SectorNo AND counters.No=CounterNo; 
		IF GetInvoiceNo IS NULL THEN 
        BEGIN 
          SELECT concat(concat(date_format(curdate(), '%y%m%d'), Sector), '0001') INTO GetInvoiceNo FROM DUAL; 
        END; 
      ELSE 
        BEGIN 
          IF SUBSTR(GetInvoiceNo,1,11) = concat(date_format(curdate(), '%y%m%d'), SUBSTR(Sector,1,5)) THEN 
            SELECT CONCAT(SUBSTR(GetInvoiceNo,1,11),  SUBSTR(CONCAT(RPAD('0', 4, 0), CAST(MAX(SUBSTR(CONCAT(SUBSTR(Sector,1,2), GetInvoiceNo),14,15))+1 AS CHAR(30) )),-4,4)) INTO GetInvoiceNo FROM sale INNER JOIN sectors ON sale.SectorID_id = sectors.id INNER JOIN counters ON sale.CounterID_id = counters.id WHERE sectors.SLNo = SectorNo AND counters.No=CounterNo; 
			 ELSE 
            SET GetInvoiceNo ='000000000000000'; 
            SELECT CONCAT(CONCAT(date_format(curdate(), '%y%m%d'), Sector), SUBSTR(CONCAT(RPAD('0', 4, 0),CAST(MAX(SUBSTR(SUBSTR(Sector,1,2) || GetInvoiceNo,14,15))+1 AS CHAR(20))),-4,4)) INTO GetInvoiceNo FROM sale INNER JOIN sectors ON sale.SectorID_id = sectors.id INNER JOIN counters ON sale.CounterID_id = counters.id WHERE sectors.SLNo = SectorNo AND counters.No=CounterNo; 
			 END IF; 
        END; 
      END IF; 
END//
DELIMITER ;

-- Dumping structure for procedure deshbesh.GET_NOTE_NO
DROP PROCEDURE IF EXISTS `GET_NOTE_NO`;
DELIMITER //
CREATE PROCEDURE `GET_NOTE_NO`(
	IN `NoteType` VARCHAR(5),
	IN `SectorNo` INT,
	OUT `GetNoteNo` VARCHAR(255)
)
BEGIN
DECLARE Sector VARCHAR(9);

SET Sector = SUBSTR(CONCAT(RPAD('0', 3, 0),SectorNo),-3,3);

SELECT MAX(SUBSTR(Note.NoteNo,3,14)) INTO GetNoteNo FROM Note INNER JOIN sectors ON Note.SectorID_id = sectors.id WHERE sectors.SLNo = SectorNo;
      IF GetNoteNo IS NULL THEN
        BEGIN
          SELECT concat(CONCAT(NoteType, date_format(curdate(), '%y%m%d'), Sector), '0001') INTO GetNoteNo FROM Dual;
        END;
      ELSE
        BEGIN
          IF SUBSTR(GetNoteNo,1,9) = concat(date_format(curdate(), '%y%m%d'), Sector) THEN
              SELECT CONCAT(NoteType, CONCAT(SUBSTR(GetNoteNo,1,6), Sector),  SUBSTR(CONCAT(RPAD('0', 4, 0), CAST(MAX(SUBSTR(CONCAT(Sector, GetNoteNo),14,15))+1 AS CHAR(30) )),-4,4)) INTO GetNoteNo FROM Note INNER JOIN sectors ON Note.SectorID_id = sectors.id WHERE sectors.SLNo = SectorNo; 
			 ELSE 
            SET GetNoteNo ='000000000000000'; 
            SELECT CONCAT(CONCAT(NoteType, date_format(curdate(), '%y%m%d'), Sector), SUBSTR(CONCAT(RPAD('0', 4, 0),CAST(MAX(SUBSTR(Sector || GetNoteNo,14,15))+1 AS CHAR(20))),-4,4)) INTO GetNoteNo FROM Note INNER JOIN sectors ON Note.SectorID_id = sectors.id WHERE sectors.SLNo = SectorNo;
			 END IF;
        END;
      END IF;
END//
DELIMITER ;

-- Dumping structure for procedure deshbesh.GET_ORDER_NO
DROP PROCEDURE IF EXISTS `GET_ORDER_NO`;
DELIMITER //
CREATE PROCEDURE `GET_ORDER_NO`(
	IN `InvoiceType` VARCHAR(5),
	IN `SectorNo` INT,
	OUT `GetOrderNo` VARCHAR(255)
)
BEGIN
DECLARE Sector VARCHAR(9);

SET Sector = SUBSTR(CONCAT(RPAD('0', 3, 0),SectorNo),-3,3);

SELECT MAX(SUBSTR(deliveryorder.OrderNo,3,14)) INTO GetOrderNo FROM deliveryorder INNER JOIN sectors ON deliveryorder.SectorID_id = sectors.id WHERE sectors.SLNo = SectorNo;
      IF GetOrderNo IS NULL THEN
        BEGIN
          SELECT concat(concat(InvoiceType, date_format(curdate(), '%y%m%d'), Sector), '0001') INTO GetOrderNo FROM Dual;
        END;
      ELSE
        BEGIN
          IF SUBSTR(GetOrderNo,1,9) = concat(date_format(curdate(), '%y%m%d'), Sector) THEN
              SELECT CONCAT(CONCAT(InvoiceType, SUBSTR(GetOrderNo,1,6), Sector),  SUBSTR(CONCAT(RPAD('0', 4, 0), CAST(MAX(SUBSTR(CONCAT(Sector, GetOrderNo),14,15))+1 AS CHAR(30) )),-4,4)) INTO GetOrderNo FROM deliveryorder INNER JOIN sectors ON deliveryorder.SectorID_id = sectors.id WHERE sectors.SLNo = SectorNo; 
			 ELSE 
            SET GetOrderNo ='000000000000000'; 
            SELECT CONCAT(CONCAT(InvoiceType, date_format(curdate(), '%y%m%d'), Sector), SUBSTR(CONCAT(RPAD('0', 4, 0),CAST(MAX(SUBSTR(Sector || GetOrderNo,14,15))+1 AS CHAR(20))),-4,4)) INTO GetOrderNo FROM deliveryorder INNER JOIN sectors ON deliveryorder.SectorID_id = sectors.id WHERE sectors.SLNo = SectorNo;
			 END IF;
        END;
      END IF;
END//
DELIMITER ;

-- Dumping structure for procedure deshbesh.GET_PURCHASE_NO
DROP PROCEDURE IF EXISTS `GET_PURCHASE_NO`;
DELIMITER //
CREATE PROCEDURE `GET_PURCHASE_NO`(
	IN `InvoiceType` VARCHAR(5),
	IN `SectorNo` INT,
	OUT `GetPurchaseNo` VARCHAR(255)
)
BEGIN
DECLARE Sector VARCHAR(9);

SET Sector = SUBSTR(CONCAT(RPAD('0', 3, 0),SectorNo),-3,3);

SELECT MAX(SUBSTR(purchase.PurchaseNo,3,14)) INTO GetPurchaseNo FROM purchase INNER JOIN sectors ON purchase.SectorID_id = sectors.id WHERE sectors.SLNo = SectorNo;
	   IF GetPurchaseNo IS NULL THEN
        BEGIN
          SELECT concat(concat(InvoiceType, date_format(curdate(), '%y%m%d'), Sector), '0001') INTO GetPurchaseNo FROM Dual;
        END;
      ELSE
        BEGIN
          IF SUBSTR(GetPurchaseNo,1,9) = concat(date_format(curdate(), '%y%m%d'), Sector) THEN
              SELECT CONCAT(CONCAT(InvoiceType, SUBSTR(GetPurchaseNo,1,6), Sector),  SUBSTR(CONCAT(RPAD('0', 4, 0), CAST(MAX(SUBSTR(CONCAT(Sector, GetPurchaseNo),14,15))+1 AS CHAR(30) )),-4,4)) INTO GetPurchaseNo FROM purchase INNER JOIN sectors ON purchase.SectorID_id = sectors.id WHERE sectors.SLNo = SectorNo; 
          ELSE 
            SET GetPurchaseNo ='000000000000000'; 
            SELECT CONCAT(InvoiceType, DATE_FORMAT(CURDATE(), '%y%m%d'), Sector, LPAD(MAX(SUBSTR(CONCAT(Sector, GetPurchaseNo),14,15)) + 1, 4, '0')) INTO GetPurchaseNo FROM purchase INNER JOIN sectors ON purchase.SectorID_id = sectors.id WHERE sectors.SLNo = SectorNo;
          END IF;
        END;
      END IF;
END//
DELIMITER ;

-- Dumping structure for procedure deshbesh.GET_PURCHASE_ORDER_NO
DROP PROCEDURE IF EXISTS `GET_PURCHASE_ORDER_NO`;
DELIMITER //
CREATE PROCEDURE `GET_PURCHASE_ORDER_NO`(
	IN `InvoiceType` VARCHAR(50),
	IN `SectorNo` INT,
	OUT `GetPurchaseOrderNo` VARCHAR(50)
)
BEGIN
DECLARE Sector VARCHAR(9);

SET Sector = SUBSTR(CONCAT(RPAD('0', 3, 0),SectorNo),-3,3);

SELECT MAX(SUBSTR(purchaseorder.OrderNo,3,14)) INTO GetPurchaseOrderNo FROM purchaseorder INNER JOIN sectors ON purchaseorder.SectorID_id = sectors.id WHERE sectors.SLNo = SectorNo;

		IF GetPurchaseOrderNo IS NULL THEN
		   SELECT Sector, InvoiceType, GetPurchaseOrderNo;
        BEGIN
          SELECT concat(concat(InvoiceType, date_format(curdate(), '%y%m%d'), Sector), '0001') INTO GetPurchaseOrderNo FROM Dual;
        END;
      ELSE
        BEGIN
          IF SUBSTR(GetPurchaseOrderNo,1,9) = concat(date_format(curdate(), '%y%m%d'), Sector) THEN
              SELECT CONCAT(CONCAT(InvoiceType, SUBSTR(GetPurchaseOrderNo,1,6), Sector),  SUBSTR(CONCAT(RPAD('0', 4, 0), CAST(MAX(SUBSTR(CONCAT(Sector, GetPurchaseOrderNo),14,15))+1 AS CHAR(30) )),-4,4)) INTO GetPurchaseOrderNo FROM purchaseorder INNER JOIN sectors ON purchaseorder.SectorID_id = sectors.id WHERE sectors.SLNo = SectorNo; 
			 ELSE 
            SET GetPurchaseOrderNo ='000000000000000'; 
            SELECT CONCAT(CONCAT(InvoiceType, date_format(curdate(), '%y%m%d'), Sector), SUBSTR(CONCAT(RPAD('0', 4, 0),CAST(MAX(SUBSTR(Sector || GetPurchaseOrderNo,14,15))+1 AS CHAR(20))),-4,4)) INTO GetPurchaseOrderNo FROM purchaseorder INNER JOIN sectors ON purchaseorder.SectorID_id = sectors.id WHERE sectors.SLNo = SectorNo;
			 END IF;
        END;
      END IF;
END//
DELIMITER ;

-- Dumping structure for procedure deshbesh.GET_QUOTE_NO
DROP PROCEDURE IF EXISTS `GET_QUOTE_NO`;
DELIMITER //
CREATE PROCEDURE `GET_QUOTE_NO`(
	IN `InvoiceType` VARCHAR(5),
	IN `SectorNo` INT,
	OUT `GetQuoteNo` VARCHAR(255)
)
BEGIN
DECLARE Sector VARCHAR(9);

SET Sector = SUBSTR(CONCAT(RPAD('0', 3, 0),SectorNo),-3,3);

SELECT MAX(SUBSTR(quotation.QuoteNo,3,14)) INTO GetQuoteNo FROM quotation INNER JOIN sectors ON quotation.SectorID_id = sectors.id WHERE sectors.SLNo = SectorNo;
      IF GetQuoteNo IS NULL THEN
        BEGIN
          SELECT concat(concat(InvoiceType, date_format(curdate(), '%y%m%d'), Sector), '0001') INTO GetQuoteNo FROM Dual;
        END;
      ELSE
        BEGIN
          IF SUBSTR(GetQuoteNo,1,9) = concat(date_format(curdate(), '%y%m%d'), Sector) THEN
              SELECT CONCAT(CONCAT(InvoiceType, SUBSTR(GetQuoteNo,1,6), Sector),  SUBSTR(CONCAT(RPAD('0', 4, 0), CAST(MAX(SUBSTR(CONCAT(Sector, GetQuoteNo),14,15))+1 AS CHAR(30) )),-4,4)) INTO GetQuoteNo FROM quotation INNER JOIN sectors ON quotation.SectorID_id = sectors.id WHERE sectors.SLNo = SectorNo; 
			 ELSE 
            SET GetQuoteNo ='000000000000000'; 
            SELECT CONCAT(CONCAT(InvoiceType, date_format(curdate(), '%y%m%d'), Sector), SUBSTR(CONCAT(RPAD('0', 4, 0),CAST(MAX(SUBSTR(Sector || GetQuoteNo,14,15))+1 AS CHAR(20))),-4,4)) INTO GetQuoteNo FROM quotation INNER JOIN sectors ON quotation.SectorID_id = sectors.id WHERE sectors.SLNo = SectorNo;
			 END IF;
        END;
      END IF;
END//
DELIMITER ;

-- Dumping structure for procedure deshbesh.GET_REQUEST_NO
DROP PROCEDURE IF EXISTS `GET_REQUEST_NO`;
DELIMITER //
CREATE PROCEDURE `GET_REQUEST_NO`(
	IN `SectorNo` INT,
	OUT `GetRequestNo` VARCHAR(50)
)
BEGIN
	DECLARE Sector VARCHAR(9);
    SET Sector = LPAD(SectorNo, 3, '0');
    
    SELECT MAX(SUBSTR(DeliveryRequest.RequestNo,3,14)) INTO GetRequestNo 
    FROM DeliveryRequest 
    INNER JOIN sectors ON DeliveryRequest.RequestToID_id = sectors.id 
    WHERE sectors.SLNo = SectorNo;
	
    IF GetRequestNo IS NULL THEN
        SET GetRequestNo = CONCAT('DR', DATE_FORMAT(CURDATE(), '%y%m%d'), Sector, '0001');
    ELSE
		IF SUBSTR(GetRequestNo,1,9) = CONCAT(DATE_FORMAT(CURDATE(), '%y%m%d'), Sector) THEN
            SELECT CONCAT('DR', SUBSTR(GetRequestNo,1,6), Sector, LPAD(MAX(SUBSTR(CONCAT(Sector, GetRequestNo),14,15)) + 1, 4, '0')) 
            INTO GetRequestNo 
            FROM DeliveryRequest 
            INNER JOIN sectors ON DeliveryRequest.RequestToID_id = sectors.id 
            WHERE sectors.SLNo = SectorNo; 
        ELSE 
            SET GetRequestNo = '0000000000000';
			SELECT CONCAT('DR', DATE_FORMAT(CURDATE(), '%y%m%d'), Sector, LPAD(MAX(SUBSTR(CONCAT(Sector, GetRequestNo),14,15)) + 1, 4, '0')) 
            INTO GetRequestNo 
            FROM DeliveryRequest 
            INNER JOIN sectors ON DeliveryRequest.RequestToID_id = sectors.id 
            WHERE sectors.SLNo = SectorNo;
		END IF;
    END IF;
END//
DELIMITER ;

-- Dumping structure for procedure deshbesh.GET_VOUCHER_NO
DROP PROCEDURE IF EXISTS `GET_VOUCHER_NO`;
DELIMITER //
CREATE PROCEDURE `GET_VOUCHER_NO`(
	IN `VoucherType` VARCHAR(5),
	IN `SectorNo` INT,
	OUT `GetVoucherNo` VARCHAR(25)
)
BEGIN
DECLARE Sector VARCHAR(9); 

SET Sector = SUBSTR(CONCAT(RPAD('0', 3, 0),SectorNo),-3,3);

SELECT MAX(SUBSTR(voucher.VoucherNo,3,14)) INTO GetVoucherNo FROM voucher INNER JOIN sectors ON voucher.SectorID_id = sectors.id WHERE sectors.SLNo = SectorNo; 
      IF GetVoucherNo IS NULL THEN 
        BEGIN 
          SELECT concat(CONCAT(VoucherType, date_format(curdate(), '%y%m%d'), Sector), '0001') INTO GetVoucherNo FROM DUAL; 
        END; 
      ELSE 
        BEGIN 
          IF SUBSTR(GetVoucherNo,1,9) = concat(date_format(curdate(), '%y%m%d'), Sector) THEN 
              SELECT CONCAT(CONCAT(VoucherType, SUBSTR(GetVoucherNo,1,6), Sector),  SUBSTR(CONCAT(RPAD('0', 4, 0), CAST(MAX(SUBSTR(CONCAT(Sector, GetVoucherNo),14,15))+1 AS CHAR(30) )),-4,4)) INTO GetVoucherNo FROM voucher INNER JOIN sectors ON voucher.SectorID_id = sectors.id WHERE sectors.SLNo = SectorNo; 
          ELSE 
            SET GetVoucherNo ='000000000000000'; 
            SELECT CONCAT(CONCAT(VoucherType, date_format(curdate(), '%y%m%d'), Sector), SUBSTR(CONCAT(RPAD('0', 4, 0), CAST(MAX(SUBSTR(Sector || GetVoucherNo,14,15))+1 AS CHAR(20))),-4,4)) INTO GetVoucherNo FROM voucher INNER JOIN sectors ON voucher.SectorID_id = sectors.id WHERE sectors.SLNo = SectorNo;
          END IF; 
        END; 
      END IF; 
END//
DELIMITER ;

-- Dumping structure for procedure deshbesh.GET_YARD_PURCHASE_NO
DROP PROCEDURE IF EXISTS `GET_YARD_PURCHASE_NO`;
DELIMITER //
CREATE PROCEDURE `GET_YARD_PURCHASE_NO`(
	IN `InvoiceType` VARCHAR(5),
	IN `SectorNo` INT,
	OUT `GetPurchaseNo` VARCHAR(50)
)
BEGIN
DECLARE Sector VARCHAR(9);

SET Sector = SUBSTR(CONCAT(RPAD('0', 3, 0),SectorNo),-3,3);

SELECT MAX(SUBSTR(ctrpurs.PurchaseNo,3,14)) INTO GetPurchaseNo FROM ctrpurs INNER JOIN sectors ON ctrpurs.SectorID_id = sectors.id WHERE sectors.SLNo = SectorNo;
      IF GetPurchaseNo IS NULL THEN
        BEGIN
          SELECT concat(concat(InvoiceType, date_format(curdate(), '%y%m%d'), Sector), '0001') INTO GetPurchaseNo FROM Dual;
        END;
      ELSE
        BEGIN
          IF SUBSTR(GetPurchaseNo,1,9) = concat(date_format(curdate(), '%y%m%d'), Sector) THEN
              SELECT CONCAT(CONCAT(InvoiceType, SUBSTR(GetPurchaseNo,1,6), Sector),  SUBSTR(CONCAT(RPAD('0', 4, 0), CAST(MAX(SUBSTR(CONCAT(Sector, GetPurchaseNo),14,15))+1 AS CHAR(30) )),-4,4)) INTO GetPurchaseNo FROM ctrpurs INNER JOIN sectors ON ctrpurs.SectorID_id = sectors.id WHERE sectors.SLNo = SectorNo; 
          ELSE 
            SET GetPurchaseNo ='000000000000000'; 
            SELECT CONCAT(CONCAT(InvoiceType, date_format(curdate(), '%y%m%d'), Sector), SUBSTR(CONCAT(RPAD('0', 4, 0),CAST(MAX(SUBSTR(Sector || GetPurchaseNo,14,15))+1 AS CHAR(20))),-4,4)) INTO GetPurchaseNo FROM ctrpurs INNER JOIN sectors ON ctrpurs.SectorID_id = sectors.id WHERE sectors.SLNo = SectorNo;
          END IF;
        END;
      END IF;
END//
DELIMITER ;


-- Dumping structure for procedure deshbesh.PARTY_PAYMENT_VOUCHER
DROP PROCEDURE IF EXISTS `PARTY_PAYMENT_VOUCHER`;
DELIMITER //
CREATE PROCEDURE `PARTY_PAYMENT_VOUCHER`(
	IN `IsBankParam` VARCHAR(5),
	IN `IsChequeParam` VARCHAR(5),
	IN `IsCardParam` VARCHAR(5),
	IN `IsOnlineParam` VARCHAR(5),
	IN `TrxNoParam` VARCHAR(20),
	IN `FrmAccNameParam` VARCHAR(100),
	IN `FrmAccNumberParam` VARCHAR(20),
	IN `FrmChequeNoParam` VARCHAR(20),
	IN `FrmBankIDParam` VARCHAR(100),
	IN `PaymentParam` DECIMAL(10,2),
	IN `DiscountParam` DECIMAL(10,2),
	IN `PaidAmountParam` DECIMAL(10,2),
	IN `DueParam` DECIMAL(10,2),
	IN `SectorIDParam` VARCHAR(100),
	IN `InvoiceNoParam` VARCHAR(25),
	IN `SalesManParam` VARCHAR(100),
	IN `PaymentStatusParam` INTEGER,
	IN `GrandTotalParam` DECIMAL(10,2),
	IN `PartyIDParam` VARCHAR(100),
	IN `CreatedAtParam` DATETIME,
	IN `UpdatedByParam` VARCHAR(100)
)
BEGIN
 DECLARE VOUCHERTYPE VARCHAR(25);
 DECLARE SectorNo INTEGER;
 DECLARE ACC_SaleID VARCHAR(100);
 DECLARE ACC_SaleCode INTEGER;
 DECLARE ACC_ReceivableID VARCHAR(100);
 DECLARE ACC_ReceivableCode INTEGER;
 DECLARE ACC_CashID VARCHAR(100);
 DECLARE ACC_CashCode INTEGER; 
 DECLARE ACC_BankID VARCHAR(100);
 DECLARE ACC_BankCode INTEGER;
 DECLARE PaymentTitle VARCHAR(80);
 DECLARE PaymentTerm VARCHAR(80);
 DECLARE PartyName VARCHAR(80);
 DECLARE BankTitle VARCHAR(80);
 DECLARE IsBank BOOLEAN;
 DECLARE IsCheque BOOLEAN;
 DECLARE IsCard BOOLEAN;
 DECLARE IsOnline BOOLEAN;
 DECLARE TrxNo VARCHAR(10);
 DECLARE FrmAccName VARCHAR(100);
 DECLARE FrmAccNumber VARCHAR(100);
 DECLARE FrmChequeNo VARCHAR(100);
 DECLARE FrmBankID VARCHAR(100);
 DECLARE Payment INTEGER;
 DECLARE Discount DECIMAL(10,2);
 DECLARE PaidAmount DECIMAL(10,2);
 DECLARE Due DECIMAL(10,2);
 DECLARE PartyID VARCHAR(100);
 DECLARE Narration VARCHAR(255);
 DECLARE EXIT HANDLER FOR SQLEXCEPTION 
BEGIN 
  GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
  SET @errormessage = CONCAT('Error ', @errno, ' (', @sqlstate, '): ', @text);
  ROLLBACK; 
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @errormessage;
END; 
 

 SET IsBank = IF(IsBankParam = 'true', TRUE, FALSE);
 SET IsCheque = IF(IsChequeParam = 'true', TRUE, FALSE);
 SET IsCard = IF(IsCardParam = 'true', TRUE, FALSE);
 SET IsOnline = IF(IsOnlineParam = 'true', TRUE, FALSE);
 SET TrxNo = TrxNoParam;
 SET FrmAccName = FrmAccNameParam;
 SET FrmAccNumber = FrmAccNumberParam;
 SET FrmChequeNo = FrmChequeNoParam;
 SET FrmBankID = FrmBankIDParam;
 SET Payment = PaymentParam;
 SET Discount = DiscountParam;
 SET PaidAmount = PaidAmountParam;
 SET Due = DueParam;
 SET PartyID = PartyIDParam;
 
 SELECT coa.id, coa.COA_Code, sectors.SLNo INTO ACC_SaleID, ACC_SaleCode, SectorNo FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = SectorIDParam AND coa.COA_Code BETWEEN '40002' AND '40499';
 SELECT coa.id, coa.COA_Code INTO ACC_ReceivableID, ACC_ReceivableCode FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = SectorIDParam AND coa.COA_Code BETWEEN '11501' AND '11999';
 SELECT coa.id, coa.COA_Code INTO ACC_CashID, ACC_CashCode FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = SectorIDParam AND coa.COA_Code BETWEEN '10500' AND '10999';
 SELECT coa.id, coa.COA_Code INTO ACC_BankID, ACC_BankCode FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = SectorIDParam AND coa.COA_Code BETWEEN '11001' AND '11499';
 SELECT BankName INTO BankTitle FROM banks WHERE id = FrmBankID;
 SET @GetVoucherNo = '0';
 SET VOUCHERTYPE = 'PV';
 CALL `GET_VOUCHER_NO`(VOUCHERTYPE, SectorNo, @GetVoucherNo);

 ##SELECT @GetVoucherNo AS voucher, PartyIDParam AS party, ACC_ReceivableID AS Receivable, FrmBankID;

 SET @id = uuid_v4();
 SELECT FullForm, label INTO PaymentTitle, PaymentTerm FROM PaymentTerms WHERE value = Payment;
 SELECT party.Title INTO PartyName FROM myparty JOIN party ON myparty.PartyID_id = party.id WHERE myparty.id = PartyIDParam AND myparty.SectorID_id = SectorIDParam;
 

START TRANSACTION; 
IF PartyIDParam IS NOT NULL THEN
   case
     when PaymentParam = 14 then 
     BEGIN
		    INSERT INTO Voucher (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) 
		    values (@id, SectorIDParam, date_format(CURDATE(), '%Y%m%d'), @GetVoucherNo, 6, SalesManParam, 'Cash', CONCAT('Being received hand cash K', CAST(FORMAT(PaidAmountParam, 2) AS CHAR) ,' from ' , PartyName,' for invoice due as per invoice no-', InvoiceNoParam, '. And following invoice mark as ', 
		           CASE PaymentStatusParam
		               WHEN 3 THEN CONCAT('due- K', FORMAT(DueParam, 2))
		               WHEN 2 THEN 'paid'
		               WHEN 1 THEN CONCAT('partial due- K', FORMAT(DueParam, 2))
		               ELSE 'N/A'                
		           END),
		           InvoiceNoParam, 2, SalesManParam, CreatedAtParam, CreatedAtParam, UpdatedByParam);
		
		    -- Second INSERT statement
		    INSERT INTO VoucherMap (ID,VOUCHERNO_ID,SLNO,DR,CR,COA_ID,COA_CODE,CREATEDAT,UPDATEDAT,UPDATEDBY_id,OPERATORID_ID,PARTYID_ID) 
		    SELECT uuid_v4(), @id, 1, PaidAmountParam, 0, ACC_CashID, ACC_CashCode, CreatedAtParam, CreatedAtParam, UpdatedByParam, SalesManParam, PartyIDParam FROM DUAL 
		    UNION ALL 
		    SELECT uuid_v4(), @id, 2, 0, PaidAmountParam, ACC_ReceivableID, ACC_ReceivableCode, CreatedAtParam, CreatedAtParam, UpdatedByParam, SalesManParam, PartyIDParam FROM DUAL;
     END;
	when PaymentParam = 15 then
	BEGIN
	   
        SET @Narration = CONCAT(
        'Being received bank payment K', 
        CAST(FORMAT(PaidAmountParam, 2) AS CHAR),
        ' from ', 
        BankTitle, 
        ' A/C Name- ', 
        FrmAccName, 
        ', A/C No- ', 
        FrmAccNumber, 
        ', on behalf of ', 
        PartyName, 
        ' for invoice due as per invoice no-', 
        InvoiceNoParam, 
        '. And following invoice mark as ', 
        CASE 
            WHEN PaymentStatusParam = 3 THEN CONCAT('due- K', FORMAT(DueParam, 2))
            WHEN PaymentStatusParam = 2 THEN 'paid'
            WHEN PaymentStatusParam = 1 THEN CONCAT('partial due- K', FORMAT(DueParam, 2))
            ELSE 'N/A'
        END
      );
	          INSERT INTO Voucher 
                (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) 
                  values (
                  @id, 
                  SectorIDParam, 
                  date_format(curdate(), '%Y%m%d'), 
                  @GetVoucherNo, 
                  6, 
                  SalesManParam, 
                  'Bank', 
					   @Narration,
                  InvoiceNoParam, 
                  2, 
                  SalesManParam, 
                  CreatedAtParam, 
                  CreatedAtParam, 
                  UpdatedByParam);
                  
                      INSERT INTO VoucherMap 
                    (ID,VOUCHERNO_ID,SLNO,DR,CR,COA_ID,COA_CODE,CREATEDAT,UPDATEDAT,UPDATEDBY_id,OPERATORID_ID,PARTYID_ID) 
                      SELECT 
                      uuid_v4(), 
                      @id, 
                      1, 
                      PaidAmountParam, 
                      0, 
                      ACC_BankID, 
                      ACC_BankCode,
                      CreatedAtParam, 
                      CreatedAtParam, 
                      UpdatedByParam, 
                      SalesManParam, 
                      PartyID 
                      FROM DUAL 

                      UNION ALL 

                      SELECT 
                      uuid_v4(), 
                      @id, 
                      2, 
                      0, 
                      PaidAmountParam, 
                      ACC_ReceivableID, 
                      ACC_ReceivableCode, 
                      CreatedAtParam, 
                      CreatedAtParam, 
                      UpdatedByParam, 
                      SalesManParam, 
                      PartyID 
                      FROM DUAL; 
                         END;
                         
      WHEN PaymentParam = 16 THEN
          INSERT INTO Voucher 
                (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) 
                  values (
                  @id, 
                  SectorIDParam, 
                  date_format(curdate(), '%Y%m%d'), 
                  @GetVoucherNo, 
                  6, 
                  SalesManParam, 
                  'Bank', 
                  CONCAT('Being received bank cheque from ' , BankTitle,' on behalf of ', PartyName,' for invoice due as per invoice no-', InvoiceNoParam, '. The cheque number is ', FrmChequeNo, ' and the amount is ', CAST(FORMAT(PaidAmountParam, 2) AS CHAR), '. And following invoice mark as ',			            
						CASE PaymentStatusParam
			                WHEN 3 THEN CONCAT('due- K', FORMAT(DueParam, 2))
			                WHEN 2 THEN 'paid'
			                WHEN 1 THEN CONCAT('partial due- K', FORMAT(DueParam, 2))
			                ELSE 'N/A'                
			            END),
                  InvoiceNoParam, 
                  2, 
                  SalesManParam, 
                  CreatedAtParam, 
                  CreatedAtParam, 
                  UpdatedByParam);
                  BEGIN
                      INSERT INTO VoucherMap 
                    (ID,VOUCHERNO_ID,SLNO,DR,CR,COA_ID,COA_CODE,CREATEDAT,UPDATEDAT,UPDATEDBY_id,OPERATORID_ID,PARTYID_ID) 
                      SELECT 
                      uuid_v4(), 
                      @id, 
                      1, 
                      PaidAmountParam, 
                      0, 
                      ACC_BankID, 
                      ACC_BankCode, 
                      CreatedAtParam, 
                      CreatedAtParam, 
                      UpdatedByParam, 
                      SalesManParam, 
                      PartyID 
                      FROM DUAL 

                      UNION ALL 

                      SELECT 
                      uuid_v4(), 
                      @id, 
                      2, 
                      0, 
                      PaidAmountParam, 
                      ACC_ReceivableID, 
                      ACC_ReceivableCode, 
                      CreatedAtParam, 
                      CreatedAtParam, 
                      UpdatedByParam, 
                      SalesManParam, 
                      PartyID 
                      FROM DUAL;
                      END;
      WHEN PaymentParam = 17 then
      BEGIN
          INSERT INTO Voucher 
                (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) 
                  values (
                  @id, 
                  SectorIDParam, 
                  date_format(curdate(), '%Y%m%d'), 
                  @GetVoucherNo, 
                  6, 
                  SalesManParam, 
                  'Bank', 
                  CONCAT('Being received online payment from ' , BankTitle,' on behalf of ', PartyName,' for invoice due as per invoice no-', InvoiceNoParam, '. The transaction/reference/pin number is ', TrxNo, ' and the amount is ', CAST(FORMAT(PaidAmountParam, 2) AS CHAR), '. And following invoice mark as ', 
			            CASE PaymentStatusParam
			                WHEN 3 THEN CONCAT('due- K', FORMAT(DueParam, 2))
			                WHEN 2 THEN 'paid'
			                WHEN 1 THEN CONCAT('partial due- K', FORMAT(DueParam, 2))
			                ELSE 'N/A'                
			            END
        				),
                  InvoiceNoParam, 
                  2, 
                  SalesManParam, 
                  CreatedAtParam, 
                  CreatedAtParam, 
                  UpdatedByParam);
                  
                      INSERT INTO VoucherMap 
                    (ID,VOUCHERNO_ID,SLNO,DR,CR,COA_ID,COA_CODE,CREATEDAT,UPDATEDAT,UPDATEDBY_id,OPERATORID_ID,PARTYID_ID) 
                      SELECT 
                      uuid_v4(), 
                      @id, 
                      1, 
                      PaidAmountParam, 
                      0, 
                      ACC_BankID, 
                      ACC_BankCode,
                      CreatedAtParam, 
                      CreatedAtParam, 
                      UpdatedByParam, 
                      SalesManParam, 
                      PartyID 
                      FROM DUAL 

                      UNION ALL 

                      SELECT 
                      uuid_v4(), 
                      @id, 
                      2, 
                      0, 
                      PaidAmountParam, 
                      ACC_ReceivableID, 
                      ACC_ReceivableCode, 
                      CreatedAtParam, 
                      CreatedAtParam, 
                      UpdatedByParam, 
                      SalesManParam, 
                      PartyID 
                      FROM DUAL;
      END;
      WHEN PaymentParam = 18 then
      BEGIN
          INSERT INTO Voucher 
                (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) 
                  values (
                  @id, 
                  SectorIDParam, 
                  date_format(curdate(), '%Y%m%d'), 
                  @GetVoucherNo, 
                  6, 
                  SalesManParam, 
                  'Bank', 
                  CONCAT('Being received card payment K', CAST(FORMAT(PaidAmountParam, 2) AS CHAR) ,' from ' , PartyName,' for invoice due as per invoice no-', InvoiceNoParam, '. And following invoice mark as ', 
			            CASE PaymentStatusParam
			                WHEN 3 THEN CONCAT('due- K', FORMAT(DueParam, 2))
			                WHEN 2 THEN 'paid'
			                WHEN 1 THEN CONCAT('partial due- K', FORMAT(DueParam, 2))
			                ELSE 'N/A'                
			            END
        				),
                  InvoiceNoParam, 
                  2, 
                  SalesManParam, 
                  CreatedAtParam, 
                  CreatedAtParam, 
                  UpdatedByParam);
                  
                      INSERT INTO VoucherMap 
                    (ID,VOUCHERNO_ID,SLNO,DR,CR,COA_ID,COA_CODE,CREATEDAT,UPDATEDAT,UPDATEDBY_id,OPERATORID_ID,PARTYID_ID) 
                      SELECT 
                      uuid_v4(), 
                      @id, 
                      1, 
                      PaidAmountParam, 
                      0, 
                      ACC_BankID, 
                      ACC_BankCode,
                      CreatedAtParam, 
                      CreatedAtParam, 
                      UpdatedByParam, 
                      SalesManParam, 
                      PartyID 
                      FROM DUAL 

                      UNION ALL 

                      SELECT 
                      uuid_v4(), 
                      @id, 
                      2, 
                      0, 
                      PaidAmountParam, 
                      ACC_ReceivableID, 
                      ACC_ReceivableCode, 
                      CreatedAtParam, 
                      CreatedAtParam, 
                      UpdatedByParam, 
                      SalesManParam, 
                      PartyID 
                      FROM DUAL;
       END;
                     END CASE;
   
  
  END IF;
COMMIT;

END//
DELIMITER ;


-- Dumping structure for procedure deshbesh.SUPPLIER_PAYMENT_VOUCHER
DROP PROCEDURE IF EXISTS `SUPPLIER_PAYMENT_VOUCHER`;
DELIMITER //
CREATE PROCEDURE `SUPPLIER_PAYMENT_VOUCHER`(
	IN `IsBankParam` VARCHAR(5),
	IN `IsChequeParam` VARCHAR(5),
	IN `IsCardParam` VARCHAR(5),
	IN `IsOnlineParam` VARCHAR(5),
	IN `TrxNoParam` VARCHAR(20),
	IN `ToAccNameParam` VARCHAR(100),
	IN `ToAccNumberParam` VARCHAR(20),
	IN `ToChequeNoParam` VARCHAR(20),
	IN `ToBankIDParam` VARCHAR(100),
	IN `PaymentParam` DECIMAL(10,2),
	IN `DiscountParam` DECIMAL(10,2),
	IN `PaidAmountParam` DECIMAL(10,2),
	IN `DueParam` DECIMAL(10,2),
	IN `SectorIDParam` VARCHAR(100),
	IN `PurchaseNoParam` VARCHAR(25),
	IN `ReceiverIDParam` VARCHAR(100),
	IN `PaymentStatusParam` INTEGER,
	IN `GrandTotalParam` DECIMAL(10,2),
	IN `SupplierIDParam` VARCHAR(100),
	IN `CreatedAtParam` DATETIME,
	IN `UpdatedByParam` VARCHAR(100)
)
BEGIN
 DECLARE VOUCHERTYPE VARCHAR(25);
 DECLARE SectorNo INTEGER;
 DECLARE ACC_PursID VARCHAR(100);
 DECLARE ACC_PursCode INTEGER;
 DECLARE ACC_PayableID VARCHAR(100);
 DECLARE ACC_PayableCode INTEGER;
 DECLARE ACC_CashID VARCHAR(100);
 DECLARE ACC_CashCode INTEGER; 
 DECLARE ACC_BankID VARCHAR(100);
 DECLARE ACC_BankCode INTEGER;
 DECLARE PaymentTitle VARCHAR(80);
 DECLARE PaymentTerm VARCHAR(80);
 DECLARE SupplierName VARCHAR(80);
 DECLARE BankTitle VARCHAR(80);
 DECLARE IsBank BOOLEAN;
 DECLARE IsCheque BOOLEAN;
 DECLARE IsCard BOOLEAN;
 DECLARE IsOnline BOOLEAN;
 DECLARE TrxNo VARCHAR(10);
 DECLARE ToAccName VARCHAR(100);
 DECLARE ToAccNumber VARCHAR(100);
 DECLARE ToChequeNo VARCHAR(100);
 DECLARE ToBankID VARCHAR(100);
 DECLARE Payment INTEGER;
 DECLARE Discount DECIMAL(10,2);
 DECLARE PaidAmount DECIMAL(10,2);
 DECLARE Due DECIMAL(10,2);
 DECLARE SupplierID VARCHAR(100);
 DECLARE Narration VARCHAR(255);
 DECLARE EXIT HANDLER FOR SQLEXCEPTION 
BEGIN 
  GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
  SET @errormessage = CONCAT('Error ', @errno, ' (', @sqlstate, '): ', @text);
  ROLLBACK; 
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @errormessage;
END; 
 

 SET IsBank = IF(IsBankParam = 'true', TRUE, FALSE);
 SET IsCheque = IF(IsChequeParam = 'true', TRUE, FALSE);
 SET IsCard = IF(IsCardParam = 'true', TRUE, FALSE);
 SET IsOnline = IF(IsOnlineParam = 'true', TRUE, FALSE);
 SET TrxNo = TrxNoParam;
 SET ToAccName = ToAccNameParam;
 SET ToAccNumber = ToAccNumberParam;
 SET ToChequeNo = ToChequeNoParam;
 SET ToBankID = ToBankIDParam;
 SET Payment = PaymentParam;
 SET Discount = DiscountParam;
 SET PaidAmount = PaidAmountParam;
 SET Due = DueParam;
 SET SupplierID = SupplierIDParam;
 
 SELECT coa.id, coa.COA_Code, sectors.SLNo INTO ACC_PursID, ACC_PursCode, SectorNo FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = SectorIDParam AND coa.COA_Code BETWEEN '30002' AND '30100';
 SELECT coa.id, coa.COA_Code INTO ACC_PayableID, ACC_PayableCode FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = SectorIDParam AND coa.COA_Code BETWEEN '20002' AND '20499';
 SELECT coa.id, coa.COA_Code INTO ACC_CashID, ACC_CashCode FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = SectorIDParam AND coa.COA_Code BETWEEN '10500' AND '10999';
 SELECT coa.id, coa.COA_Code INTO ACC_BankID, ACC_BankCode FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = SectorIDParam AND coa.COA_Code BETWEEN '11001' AND '11499';
 SELECT BankName INTO BankTitle FROM banks WHERE id = ToBankID;
 SET @GetVoucherNo = '0';
 SET VOUCHERTYPE = 'PV';
 CALL `GET_VOUCHER_NO`(VOUCHERTYPE, SectorNo, @GetVoucherNo);

 ##SELECT @GetVoucherNo AS voucher, SupplierIDParam AS suppliers, ACC_PayableID AS Receivable, ToBankID;

 SET @id = uuid_v4();
 SELECT FullForm, label INTO PaymentTitle, PaymentTerm FROM PaymentTerms WHERE value = Payment;
 SELECT SupplierTitle INTO SupplierName FROM suppliers WHERE id = SupplierIDParam;
 

START TRANSACTION; 
IF SupplierIDParam IS NOT NULL THEN
   case
     when PaymentParam = 14 then 
     BEGIN
		    INSERT INTO Voucher (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) 
		    values (@id, SectorIDParam, date_format(CURDATE(), '%Y%m%d'), @GetVoucherNo, 6, ReceiverIDParam, 'Cash', CONCAT('Being payment by hand cash K', CAST(FORMAT(PaidAmountParam, 2) AS CHAR) ,' to ' , SupplierName,' for purchase due as per purchase no-', PurchaseNoParam, '. And following purchase mark as ', 
		           CASE PaymentStatusParam
		               WHEN 3 THEN CONCAT('due- K', FORMAT(DueParam, 2))
		               WHEN 2 THEN 'paid'
		               WHEN 1 THEN CONCAT('partial due- K', FORMAT(DueParam, 2))
		               ELSE 'N/A'                
		           END),
		           PurchaseNoParam, 2, ReceiverIDParam, CreatedAtParam, CreatedAtParam, UpdatedByParam);
		
		    -- Second INSERT statement
		    INSERT INTO VoucherMap (ID,VOUCHERNO_ID,SLNO,DR,CR,COA_ID,COA_CODE,CREATEDAT,UPDATEDAT,UPDATEDBY_id,OPERATORID_ID,SUPPLIERID_ID) 
		    SELECT uuid_v4(), @id, 1, PaidAmountParam, 0, ACC_PayableID, ACC_PayableCode, CreatedAtParam, CreatedAtParam, UpdatedByParam, ReceiverIDParam, SupplierIDParam FROM DUAL 
		    UNION ALL 
		    SELECT uuid_v4(), @id, 2, 0, PaidAmountParam, ACC_CashID, ACC_CashCode,  CreatedAtParam, CreatedAtParam, UpdatedByParam, ReceiverIDParam, SupplierIDParam FROM DUAL;
     END;
	when PaymentParam = 15 then
	BEGIN
        SET @Narration = CONCAT(
        'Being payment by bank K', 
        CAST(FORMAT(PaidAmountParam, 2) AS CHAR),
        ' to ', 
        BankTitle, 
        ' A/C Name- ', 
        ToAccName, 
        ', A/C No- ', 
        ToAccNumber, 
        ', on behalf of ', 
        SupplierName, 
        ' for purchase due as per purchase no-', 
        PurchaseNoParam, 
        '. And following purchase mark as ', 
        CASE 
            WHEN PaymentStatusParam = 3 THEN CONCAT('due- K', FORMAT(DueParam, 2))
            WHEN PaymentStatusParam = 2 THEN 'paid'
            WHEN PaymentStatusParam = 1 THEN CONCAT('partial due- K', FORMAT(DueParam, 2))
            ELSE 'N/A'
        END
      );
	          INSERT INTO Voucher 
                (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) 
                  values (
                  @id, 
                  SectorIDParam, 
                  date_format(curdate(), '%Y%m%d'), 
                  @GetVoucherNo, 
                  6, 
                  ReceiverIDParam, 
                  'Bank', 
					   @Narration,
                  PurchaseNoParam, 
                  2, 
                  ReceiverIDParam, 
                  CreatedAtParam, 
                  CreatedAtParam, 
                  UpdatedByParam);
                  
                      INSERT INTO VoucherMap 
                    (ID,VOUCHERNO_ID,SLNO,DR,CR,COA_ID,COA_CODE,CREATEDAT,UPDATEDAT,UPDATEDBY_id,OPERATORID_ID,SUPPLIERID_ID) 
                      SELECT 
                      uuid_v4(), 
                      @id, 
                      1, 
                      PaidAmountParam, 
                      0,
                      ACC_PayableID, 
                      ACC_PayableCode, 
                      CreatedAtParam, 
                      CreatedAtParam, 
                      UpdatedByParam, 
                      ReceiverIDParam, 
                      SupplierID 
                      FROM DUAL 

                      UNION ALL 

                      SELECT 
                      uuid_v4(), 
                      @id, 
                      2, 
                      0,
                      PaidAmountParam, 
                      ACC_BankID, 
                      ACC_BankCode,
                      CreatedAtParam, 
                      CreatedAtParam, 
                      UpdatedByParam, 
                      ReceiverIDParam, 
                      SupplierID 
                      FROM DUAL; 
                         END;
                         
      WHEN PaymentParam = 16 THEN
          INSERT INTO Voucher 
                (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) 
                  values (
                  @id, 
                  SectorIDParam, 
                  date_format(curdate(), '%Y%m%d'), 
                  @GetVoucherNo, 
                  6, 
                  ReceiverIDParam, 
                  'Bank', 
                  CONCAT('Being payment by bank cheque to ' , BankTitle,' on behalf of ', SupplierName,' for purchase due as per purchase no-', PurchaseNoParam, '. The cheque number is ', ToChequeNo, ' and the amount is ', CAST(FORMAT(PaidAmountParam, 2) AS CHAR), '. And following purchase mark as ',			            
						CASE PaymentStatusParam
			                WHEN 3 THEN CONCAT('due- K', FORMAT(DueParam, 2))
			                WHEN 2 THEN 'paid'
			                WHEN 1 THEN CONCAT('partial due- K', FORMAT(DueParam, 2))
			                ELSE 'N/A'                
			            END),
                  PurchaseNoParam, 
                  2, 
                  ReceiverIDParam, 
                  CreatedAtParam, 
                  CreatedAtParam, 
                  UpdatedByParam);
                  BEGIN
                      INSERT INTO VoucherMap 
                    (ID,VOUCHERNO_ID,SLNO,DR,CR,COA_ID,COA_CODE,CREATEDAT,UPDATEDAT,UPDATEDBY_id,OPERATORID_ID,SUPPLIERID_ID) 
                      SELECT 
                      uuid_v4(), 
                      @id, 
                      1, 
                      PaidAmountParam, 
                      0,
                      ACC_PayableID, 
                      ACC_PayableCode, 
                      CreatedAtParam, 
                      CreatedAtParam, 
                      UpdatedByParam, 
                      ReceiverIDParam, 
                      SupplierID 
                      FROM DUAL 

                      UNION ALL 

                      SELECT 
                      uuid_v4(), 
                      @id, 
                      2, 
                      0,
                      PaidAmountParam, 
                      ACC_BankID, 
                      ACC_BankCode, 
                      CreatedAtParam, 
                      CreatedAtParam, 
                      UpdatedByParam, 
                      ReceiverIDParam, 
                      SupplierID 
                      FROM DUAL;
                      END;
      WHEN PaymentParam = 17 then
      BEGIN
          INSERT INTO Voucher 
                (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) 
                  values (
                  @id, 
                  SectorIDParam, 
                  date_format(curdate(), '%Y%m%d'), 
                  @GetVoucherNo, 
                  6, 
                  ReceiverIDParam, 
                  'Bank', 
                  CONCAT('Being payment by online to ' , BankTitle,' on behalf of ', SupplierName,' for purchase due as per purchase no-', PurchaseNoParam, '. The transaction/reference/pin number is ', TrxNo, ' and the amount is ', CAST(FORMAT(PaidAmountParam, 2) AS CHAR), '. And following purchase mark as ', 
			            CASE PaymentStatusParam
			                WHEN 3 THEN CONCAT('due- K', FORMAT(DueParam, 2))
			                WHEN 2 THEN 'paid'
			                WHEN 1 THEN CONCAT('partial due- K', FORMAT(DueParam, 2))
			                ELSE 'N/A'                
			            END
        				),
                  PurchaseNoParam, 
                  2, 
                  ReceiverIDParam, 
                  CreatedAtParam, 
                  CreatedAtParam, 
                  UpdatedByParam);
                  
                      INSERT INTO VoucherMap 
                    (ID,VOUCHERNO_ID,SLNO,DR,CR,COA_ID,COA_CODE,CREATEDAT,UPDATEDAT,UPDATEDBY_id,OPERATORID_ID,SUPPLIERID_ID) 
                      SELECT 
                      uuid_v4(), 
                      @id, 
                      1, 
                      PaidAmountParam, 
                      0,
                      ACC_PayableID, 
                      ACC_PayableCode, 
                      CreatedAtParam, 
                      CreatedAtParam, 
                      UpdatedByParam, 
                      ReceiverIDParam, 
                      SupplierID 
                      FROM DUAL 

                      UNION ALL 

                      SELECT 
                      uuid_v4(), 
                      @id, 
                      2, 
                      0,
                      PaidAmountParam, 
                      ACC_BankID, 
                      ACC_BankCode,
                      CreatedAtParam, 
                      CreatedAtParam, 
                      UpdatedByParam, 
                      ReceiverIDParam, 
                      SupplierID 
                      FROM DUAL;
      END;
      WHEN PaymentParam = 18 then
      BEGIN
          INSERT INTO Voucher 
                (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) 
                  values (
                  @id, 
                  SectorIDParam, 
                  date_format(curdate(), '%Y%m%d'), 
                  @GetVoucherNo, 
                  6, 
                  ReceiverIDParam, 
                  'Bank', 
                  CONCAT('Being card payment K', CAST(FORMAT(PaidAmountParam, 2) AS CHAR) ,' to ' , SupplierName,' for purchase due as per purchase no-', PurchaseNoParam, '. And following purchase mark as ', 
			            CASE PaymentStatusParam
			                WHEN 3 THEN CONCAT('due- K', FORMAT(DueParam, 2))
			                WHEN 2 THEN 'paid'
			                WHEN 1 THEN CONCAT('partial due- K', FORMAT(DueParam, 2))
			                ELSE 'N/A'                
			            END
        				),
                  PurchaseNoParam, 
                  2, 
                  ReceiverIDParam, 
                  CreatedAtParam, 
                  CreatedAtParam, 
                  UpdatedByParam);
                  
                      INSERT INTO VoucherMap 
                    (ID,VOUCHERNO_ID,SLNO,DR,CR,COA_ID,COA_CODE,CREATEDAT,UPDATEDAT,UPDATEDBY_id,OPERATORID_ID,SUPPLIERID_ID) 
                      SELECT 
                      uuid_v4(), 
                      @id, 
                      1, 
                      PaidAmountParam, 
                      0,
                      ACC_PayableID, 
                      ACC_PayableCode, 
                      CreatedAtParam, 
                      CreatedAtParam, 
                      UpdatedByParam, 
                      ReceiverIDParam, 
                      SupplierID 
                      FROM DUAL 

                      UNION ALL 

                      SELECT 
                      uuid_v4(), 
                      @id, 
                      2, 
                      0,
                      PaidAmountParam, 
                      ACC_BankID, 
                      ACC_BankCode,
                      CreatedAtParam, 
                      CreatedAtParam, 
                      UpdatedByParam, 
                      ReceiverIDParam, 
                      SupplierID 
                      FROM DUAL;
       END;
                     END CASE;
   
  
  END IF;
COMMIT;

END//
DELIMITER ;

-- Dumping structure for procedure deshbesh.updateStock
DROP PROCEDURE IF EXISTS `updateStock`;
DELIMITER //
CREATE PROCEDURE `updateStock`(
	IN `RequestID` CHAR(36),
	IN `RequestedID_id` CHAR(36),
	IN `RequestForID_id` CHAR(36)
)
BEGIN
-- Declare variables
  DECLARE done INT DEFAULT FALSE;
  DECLARE salemap_qty DECIMAL(10,2);
  DECLARE salemap_wt DECIMAL(10,3);
  DECLARE salemap_rate DECIMAL(10,2);
  DECLARE salemap_itemID CHAR(36);

  -- Declare cursor
  DECLARE cur CURSOR FOR SELECT Qty, Weight, Rate, ItemID_id FROM DeliveryRequestMap WHERE RequestID_id = RequestID;

  -- Handler for 'Not found'
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  -- Open the cursor
  OPEN cur;

  -- Start the loop
  read_loop: LOOP
    -- Get the next row
    FETCH cur INTO salemap_qty, salemap_wt, salemap_rate, salemap_itemID;

    -- Exit the loop if there are no more rows
    IF done THEN
      LEAVE read_loop;
    END IF;

   UPDATE stock 
     SET Qty = Qty + salemap_qty, Weight = Weight + salemap_wt, Cost = salemap_rate, LastReceived = salemap_qty, UpdatedAt = NOW()
     WHERE Stock.SectorID_id = RequestForID_id AND ItemID_id = salemap_itemID;

  END LOOP;

  -- Close the cursor
  CLOSE cur;
END//
DELIMITER ;


-- Dumping structure for function deshbesh.uuid_v4
DROP FUNCTION IF EXISTS `uuid_v4`;
DELIMITER //
CREATE FUNCTION `uuid_v4`() RETURNS char(32) CHARSET latin1 COLLATE latin1_swedish_ci
    NO SQL
BEGIN
    -- Generate 8 2-byte strings that we will combine into a UUIDv4
    SET @h1 = LPAD(HEX(FLOOR(RAND() * 0xffff)), 4, '0');
    SET @h2 = LPAD(HEX(FLOOR(RAND() * 0xffff)), 4, '0');
    SET @h3 = LPAD(HEX(FLOOR(RAND() * 0xffff)), 4, '0');
    SET @h6 = LPAD(HEX(FLOOR(RAND() * 0xffff)), 4, '0');
    SET @h7 = LPAD(HEX(FLOOR(RAND() * 0xffff)), 4, '0');
    SET @h8 = LPAD(HEX(FLOOR(RAND() * 0xffff)), 4, '0');

    -- 4th section will start with a 4 indicating the version
    SET @h4 = CONCAT('4', LPAD(HEX(FLOOR(RAND() * 0x0fff)), 3, '0'));

    -- 5th section first half-byte can only be 8, 9 A or B
    SET @h5 = CONCAT(HEX(FLOOR(RAND() * 4 + 8)),
                LPAD(HEX(FLOOR(RAND() * 0x0fff)), 3, '0'));

    -- Build the complete UUID
    RETURN LOWER(CONCAT(
        @h1, @h2, @h3, @h4, @h5, @h6, @h7, @h8
    ));
END//
DELIMITER ;


-- Dumping structure for trigger deshbesh.DELIVERY_NOTE_INSERT_REQUEST_STS
DROP TRIGGER IF EXISTS `DELIVERY_NOTE_INSERT_REQUEST_STS`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `DELIVERY_NOTE_INSERT_REQUEST_STS` AFTER INSERT ON `deliverynote` FOR EACH ROW BEGIN
	IF NEW.Status = 2 THEN
		UPDATE deliveryrequest SET STATUS=2 WHERE id = NEW.RequestID_id;
	END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger deshbesh.DELIVERY_NOTE_STATUS_TRIGGER
DROP TRIGGER IF EXISTS `DELIVERY_NOTE_STATUS_TRIGGER`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `DELIVERY_NOTE_STATUS_TRIGGER` AFTER UPDATE ON `deliverynote` FOR EACH ROW BEGIN
	IF NEW.Status = 3 THEN
	 UPDATE deliveryrequest SET STATUS = 3 WHERE id = NEW.RequestID_id;
	END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger deshbesh.DELIVERY_ORDER_STOCK_AVAILABILITY
DROP TRIGGER IF EXISTS `DELIVERY_ORDER_STOCK_AVAILABILITY`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `DELIVERY_ORDER_STOCK_AVAILABILITY` BEFORE INSERT ON `deliveryordermap` FOR EACH ROW BEGIN
 DECLARE Available DECIMAL(10,2);
 SELECT stock.Qty INTO Available 
 FROM stock JOIN productitems ON stock.ItemID_id = productitems.id 
 AND stock.SectorID_id = (SELECT SectorID_id FROM sale WHERE id = NEW.OrderNo_id) 
 WHERE stock.ItemID_id = NEW.ItemID_id 
 AND stock.SectorID_id = (SELECT SectorID_id FROM sale WHERE id = NEW.OrderNo_id);
 
 SET NEW.Available = Available;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger deshbesh.NOTE_VOUCHER
DROP TRIGGER IF EXISTS `NOTE_VOUCHER`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `NOTE_VOUCHER` AFTER INSERT ON `note` FOR EACH ROW BEGIN
 DECLARE       VOUCHERTYPE             VARCHAR(25);
 DECLARE       SectorNo                INTEGER;
 DECLARE       INVOICENO               VARCHAR(25);

 DECLARE       ACC_ReturnInwardID      VARCHAR(32);
 DECLARE       ACC_ReturnInwardCode    INTEGER;
 
 DECLARE       ACC_PurchaseID      VARCHAR(32);
 DECLARE       ACC_PurchaseCode    INTEGER;
 
 DECLARE       ACC_ReceivableID        VARCHAR(32);
 DECLARE       ACC_ReceivableCode      INTEGER;
  
 DECLARE       ACC_PayableID           VARCHAR(32);
 DECLARE       ACC_PayableCode         INTEGER;
 
 DECLARE       ACC_CashID              VARCHAR(32);
 DECLARE       ACC_CashCode            INTEGER; 

 DECLARE       ACC_BankID              VARCHAR(32);
 DECLARE       ACC_BankCode            INTEGER;

 DECLARE       PartyID                 VARCHAR(80);
 DECLARE       PartyName               VARCHAR(80);

SET @GetVoucherNo = '0';
SET VOUCHERTYPE = 'JV';


SET @id = uuid_v4();

SELECT InvoiceNo INTO InvoiceNo FROM sale WHERE id = new.InvoiceNo_id;
SELECT party.Title INTO PartyName FROM myparty JOIN party ON myparty.PartyID_id = party.id WHERE myparty.id = NEW.PartyID_id AND myparty.SectorID_id = NEW.SectorID_id;

SET PartyID = NEW.PartyID_id;

IF NEW.PartyID_id IS NOT NULL AND NEW.NoteType = 2 THEN
   SELECT coa.id, coa.COA_Code, sectors.SLNo INTO ACC_ReturnInwardID, ACC_ReturnInwardCode, SectorNo FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = NEW.SectorID_id AND coa.COA_Code BETWEEN '40501' AND '40999';
   SELECT coa.id, coa.COA_Code INTO ACC_ReceivableID, ACC_ReceivableCode FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = NEW.SectorID_id AND coa.COA_Code BETWEEN '11501' AND '11999';
   CALL `GET_VOUCHER_NO`(VOUCHERTYPE, SectorNo, @GetVoucherNo);
   INSERT INTO Voucher 
                  (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) 
                  VALUES (
                  @id,
                  new.SectorID_id, 
                  date_format(curdate(), '%Y%m%d'), 
                  @GetVoucherNo, 
                  6, 
                  new.Rep_id,
                  'Credit Note', 
                  NEW.Details, 
                  new.NoteNo, 
                  2, 
                  new.Rep_id, 
                  new.CreatedAt, 
                  new.CreatedAt, 
                  new.UpdatedBy_id); 
                      INSERT INTO VoucherMap 
                      (ID,VOUCHERNO_ID,SLNO,DR,CR,COA_ID,COA_CODE,CREATEDAT,UPDATEDAT,UPDATEDBY_id,OPERATORID_ID,PARTYID_ID) 
                      SELECT 
                      uuid_v4(), 
                      @id, 
                      1, 
                      new.Amount, 
                      0,
                      ACC_ReturnInwardID, 
                      ACC_ReturnInwardCode, 
                      new.CreatedAt, 
                      new.CreatedAt, 
                      new.UpdatedBy_id, 
                      new.Rep_id, 
                      PartyID 
                      FROM DUAL 

                      UNION ALL 

                      SELECT 
                      uuid_v4(), 
                      @id, 
                      2, 
                      0, 
                      new.Amount, 
                      ACC_ReceivableID, 
                      ACC_ReceivableCode, 
                      new.CreatedAt, 
                      new.CreatedAt, 
                      new.UpdatedBy_id, 
                      new.Rep_id, 
                      PartyID
                      FROM DUAL;
                      
ELSEIF NEW.SupplierID_id IS NOT NULL AND NEW.NoteType = 3  THEN
   SELECT coa.id, coa.COA_Code INTO ACC_PayableID, ACC_PayableCode FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = NEW.SectorID_id AND coa.COA_Code BETWEEN '20002' AND '20499';
   SELECT coa.id, coa.COA_Code, sectors.SLNo INTO ACC_PurchaseID, ACC_PurchaseCode, SectorNo FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = NEW.SectorID_id AND coa.COA_Code BETWEEN '30002' AND '30099';
   CALL `GET_VOUCHER_NO`(VOUCHERTYPE, SectorNo, @GetVoucherNo);
   INSERT INTO Voucher 
                  (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) 
                  VALUES (
                  @id,
                  new.SectorID_id, 
                  date_format(curdate(), '%Y%m%d'), 
                  @GetVoucherNo, 
                  6, 
                  new.Rep_id,
                  'Debit Note', 
                  NEW.Details, 
                  new.NoteNo, 
                  2, 
                  new.Rep_id, 
                  new.CreatedAt, 
                  new.CreatedAt, 
                  new.UpdatedBy_id); 
                  
                      INSERT INTO VoucherMap 
                      (ID,VOUCHERNO_ID,SLNO,DR,CR,COA_ID,COA_CODE,CREATEDAT,UPDATEDAT,UPDATEDBY_id,OPERATORID_ID,SUPPLIERID_ID) 
                      SELECT 
                      uuid_v4(), 
                      @id, 
                      1, 
                      new.Amount,
                      0, 
                      ACC_PayableID, 
                      ACC_PayableCode, 
                      new.CreatedAt, 
                      new.CreatedAt, 
                      new.UpdatedBy_id, 
                      new.Rep_id, 
                      NEW.SupplierID_id 
                      FROM DUAL 

                      UNION ALL 

                      SELECT 
                      uuid_v4(), 
                      @id, 
                      2, 
                      0, 
                      new.Amount, 
                      ACC_PurchaseID, 
                      ACC_PurchaseCode, 
                      new.CreatedAt, 
                      new.CreatedAt, 
                      new.UpdatedBy_id, 
                      new.Rep_id, 
                      NEW.SupplierID_id  
                      FROM DUAL;
                      
ELSEIF NEW.PartyID_id IS NULL AND NEW.NoteType = 1 THEN
   SELECT coa.id, coa.COA_Code, sectors.SLNo INTO ACC_ReturnInwardID, ACC_ReturnInwardCode, SectorNo FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = NEW.SectorID_id AND coa.COA_Code BETWEEN '40501' AND '40999'; 
   SELECT coa.id, coa.COA_Code INTO ACC_CashID, ACC_CashCode FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = NEW.SectorID_id AND coa.COA_Code BETWEEN '10500' AND '10999';
   CALL `GET_VOUCHER_NO`(VOUCHERTYPE, SectorNo, @GetVoucherNo);
   INSERT INTO Voucher 
                  (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) 
                  VALUES (
                  @id,
                  new.SectorID_id, 
                  date_format(curdate(), '%Y%m%d'), 
                  @GetVoucherNo, 
                  6, 
                  new.Rep_id,
                  'Cash Refund', 
                  NEW.Details, 
                  new.NoteNo, 
                  2, 
                  new.Rep_id, 
                  new.CreatedAt, 
                  new.CreatedAt, 
                  new.UpdatedBy_id); 
                  
                      INSERT INTO VoucherMap 
                      (ID,VOUCHERNO_ID,SLNO,DR,CR,COA_ID,COA_CODE,CREATEDAT,UPDATEDAT,UPDATEDBY_id,OPERATORID_ID,PARTYID_ID) 
                      SELECT 
                      uuid_v4(), 
                      @id, 
                      1, 
                      new.Amount, 
                      0,
                      ACC_ReturnInwardID, 
                      ACC_ReturnInwardCode, 
                      new.CreatedAt, 
                      new.CreatedAt, 
                      new.UpdatedBy_id, 
                      new.Rep_id, 
                      PartyID
                      FROM DUAL 

                      UNION ALL 

                      SELECT 
                      uuid_v4(), 
                      @id, 
                      2, 
                      0, 
                      new.Amount, 
                      ACC_CashID, 
                      ACC_CashCode, 
                      new.CreatedAt, 
                      new.CreatedAt, 
                      new.UpdatedBy_id, 
                      new.Rep_id, 
                      PartyID 
                      FROM DUAL;
                      

ELSEIF NEW.SupplierID_id IS NOT NULL AND NEW.NoteType = 1 THEN
   SELECT coa.id, coa.COA_Code INTO ACC_CashID, ACC_CashCode FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = NEW.SectorID_id AND coa.COA_Code BETWEEN '10500' AND '10999';
   SELECT coa.id, coa.COA_Code, sectors.SLNo INTO ACC_PurchaseID, ACC_PurchaseCode, SectorNo FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = NEW.SectorID_id AND coa.COA_Code BETWEEN '30002' AND '30099';
   CALL `GET_VOUCHER_NO`(VOUCHERTYPE, SectorNo, @GetVoucherNo);
      INSERT INTO Voucher 
                  (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) 
                  VALUES (
                  @id,
                  new.SectorID_id, 
                  date_format(curdate(), '%Y%m%d'), 
                  @GetVoucherNo, 
                  6, 
                  new.Rep_id,
                  'Cash Refund',  
                  NEW.Details, 
                  new.NoteNo, 
                  2, 
                  new.Rep_id, 
                  new.CreatedAt, 
                  new.CreatedAt, 
                  new.UpdatedBy_id); 
                  
                      INSERT INTO VoucherMap 
                      (ID,VOUCHERNO_ID,SLNO,DR,CR,COA_ID,COA_CODE,CREATEDAT,UPDATEDAT,UPDATEDBY_id,OPERATORID_ID,SUPPLIERID_ID) 
                      SELECT 
                      uuid_v4(), 
                      @id, 
                      1, 
                      new.Amount,
                      0, 
                      ACC_CashID, 
                      ACC_CashCode, 
                      new.CreatedAt, 
                      new.CreatedAt, 
                      new.UpdatedBy_id, 
                      new.Rep_id, 
                      NEW.SupplierID_id 
                      FROM DUAL 

                      UNION ALL 

                      SELECT 
                      uuid_v4(), 
                      @id, 
                      2, 
                      0, 
                      new.Amount, 
                      ACC_PurchaseID, 
                      ACC_PurchaseCode, 
                      new.CreatedAt, 
                      new.CreatedAt, 
                      new.UpdatedBy_id, 
                      new.Rep_id, 
                      NEW.SupplierID_id  
                      FROM DUAL;
   
END IF;

END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger deshbesh.PURCHASE_VOUCHER
DROP TRIGGER IF EXISTS `PURCHASE_VOUCHER`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `PURCHASE_VOUCHER` AFTER INSERT ON `purchase` FOR EACH ROW BEGIN
 DECLARE       VOUCHERTYPE             VARCHAR(25);
 DECLARE       SECTORNO                INTEGER;
 DECLARE       INVOICENO               VARCHAR(25);

 DECLARE       ACC_PurchaseID          VARCHAR(32);
 DECLARE       ACC_PurchaseCode        INTEGER;

 DECLARE       ACC_PayableID           VARCHAR(32);
 DECLARE       ACC_PayableCode         INTEGER;
 
 DECLARE       ACC_CashID              VARCHAR(32);
 DECLARE       ACC_CashCode            INTEGER; 

 DECLARE       ACC_BankID             VARCHAR(32);
 DECLARE       ACC_BankCode           INTEGER;

 DECLARE       PaymentTitle            VARCHAR(80);
 DECLARE       PaymentTerm             VARCHAR(80);
 DECLARE       SupplierName            VARCHAR(80);

SELECT coa.id, coa.COA_Code, sectors.SLNo INTO ACC_PurchaseID, ACC_PurchaseCode, SectorNo FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = NEW.SectorID_id AND coa.COA_Code BETWEEN '30002' AND '30099';
SELECT coa.id, coa.COA_Code INTO ACC_PayableID, ACC_PayableCode FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = NEW.SectorID_id AND coa.COA_Code BETWEEN '20002' AND '20499';
SELECT coa.id, coa.COA_Code INTO ACC_CashID, ACC_CashCode FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = NEW.SectorID_id AND coa.COA_Code BETWEEN '10500' AND '10899';
SELECT coa.id, coa.COA_Code INTO ACC_BankID, ACC_BankCode FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = NEW.SectorID_id AND coa.COA_Code BETWEEN '11001' AND '11499';

SET @GetVoucherNo = '0';
SET VOUCHERTYPE = 'JV';
CALL `GET_VOUCHER_NO`(VOUCHERTYPE, SectorNo, @GetVoucherNo);

SET @id = uuid_v4();

 SELECT FullForm, label INTO PaymentTitle, PaymentTerm FROM PaymentTerms WHERE value = new.Payment;
 SELECT SupplierTitle INTO SupplierName FROM Suppliers WHERE id = new.SupplierID_id;

IF NEW.InvoiceNo IS NOT NULL AND TRIM(NEW.InvoiceNo) <> '' THEN
 CASE NEW.PaymentStatus
        WHEN 3 THEN
            CASE
                WHEN new.Payment BETWEEN 1 AND 4 THEN
                    INSERT INTO Voucher (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) 
                    VALUES (@id, new.SectorID_id, DATE_FORMAT(CURDATE(), '%Y%m%d'), @GetVoucherNo, 6, new.ReceiverID_id, '', CONCAT('Being product purchased worth PGK-', new.GrandTotal, ' in purchase no-', new.PurchaseNo, ' in terms of ', PaymentTerm, ' from ', SupplierName), new.PurchaseNo, 2, new.ReceiverID_id, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id);

                    INSERT INTO VoucherMap (ID, VOUCHERNO_ID, SLNO, DR, CR, COA_ID, COA_CODE, CREATEDAT, UPDATEDAT, UPDATEDBY_id, OPERATORID_ID, SUPPLIERID_ID) 
                    SELECT UUID_V4(), @id, 1, new.GrandTotal, 0, ACC_PurchaseID, ACC_PurchaseCode, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id, new.ReceiverID_id, new.SupplierID_id FROM DUAL 
                    UNION ALL 
                    SELECT UUID_V4(), @id, 2, 0, new.GrandTotal, ACC_PayableID, ACC_PayableCode, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id, new.ReceiverID_id, new.SupplierID_id FROM DUAL;

                WHEN new.Payment BETWEEN 5 AND 11 THEN 
		                INSERT INTO voucher (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) 
                    VALUES (@id, new.SectorID_id, DATE_FORMAT(CURDATE(), '%Y%m%d'), @GetVoucherNo, 6, new.ReceiverID_id, '', CONCAT('Being product purchased worth PGK-', new.GrandTotal, ' in purchase no-', new.PurchaseNo, ' in terms of ', PaymentTerm, ' from ', SupplierName), new.PurchaseNo, 2, new.ReceiverID_id, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id); 
                    
                    SET @payable_uuid = uuid_v4(); 
                    INSERT INTO VoucherMap (ID,VOUCHERNO_ID,SLNO,DR,CR,COA_ID,COA_CODE,CREATEDAT,UPDATEDAT,UPDATEDBY_id,OPERATORID_ID,SUPPLIERID_ID) 
                    SELECT uuid_v4(), @id, 1, new.GrandTotal, 0, ACC_PurchaseID, ACC_PurchaseCode, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id, new.ReceiverID_id, NEW.SupplierID_id FROM DUAL 
                    UNION ALL 
                    SELECT @payable_uuid, @id, 2, 0, new.GrandTotal, ACC_PayableID, ACC_PayableCode, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id, new.ReceiverID_id, NEW.SupplierID_id FROM DUAL; 
                    INSERT INTO OverDue (id, VoucherMapID_id, InvoiceNo_id, PurchaseNo_id, InvDate, RcvDate, PaymentDate, Maturity, STATUS, CreatedAt, UpdatedAt, UpdatedBy_id) 
                    VALUES ( uuid_v4(), @payable_uuid, null, NEW.id, NEW.RcvDate, NEW.InvDate, null, 0, 1, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id);

		           WHEN new.Payment = 13 THEN
                    INSERT INTO Voucher (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) 
                    values (@id, new.SectorID_id, date_format(curdate(), '%Y%m%d'), @GetVoucherNo, 6, new.ReceiverID_id, '', concat('Being product purchased worth PGK-' , new.GrandTotal ,' in purchase no-', new.PurchaseNo,' in terms of ' , PaymentTerm , ' from ', SupplierName), new.PurchaseNo, 2, new.ReceiverID_id, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id); 
                    
                    INSERT INTO VoucherMap (ID,VOUCHERNO_ID,SLNO,DR,CR,COA_ID,COA_CODE,CREATEDAT,UPDATEDAT,UPDATEDBY_id,OPERATORID_ID,SUPPLIERID_ID) 
                    SELECT uuid_v4(), @id, 1, new.GrandTotal, 0, ACC_PurchaseID, ACC_PurchaseCode, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id, new.ReceiverID_id, NEW.SupplierID_id FROM DUAL 
                    UNION ALL 
                    SELECT uuid_v4(), @id, 2, 0, new.GrandTotal, ACC_PayableID, ACC_PayableCode, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id, new.ReceiverID_id, NEW.SupplierID_id FROM DUAL;
            END CASE;
   
   	WHEN 2 THEN   
        CASE 
            WHEN new.Payment = 14 THEN 
                 INSERT INTO Voucher (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) 
                    values (@id, new.SectorID_id, date_format(curdate(), '%Y%m%d'), @GetVoucherNo, 6, new.ReceiverID_id, '', concat('Being product purchased worth PGK-' , new.GrandTotal ,' in purchase no-', new.PurchaseNo,' in terms of ' , PaymentTerm , ' from ', SupplierName), new.PurchaseNo, 2, new.ReceiverID_id, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id); 
                    
                    INSERT INTO VoucherMap (ID,VOUCHERNO_ID,SLNO,DR,CR,COA_ID,COA_CODE,CREATEDAT,UPDATEDAT,UPDATEDBY_id,OPERATORID_ID,SUPPLIERID_ID) 
                    SELECT uuid_v4(), @id, 1, new.GrandTotal, 0, ACC_PurchaseID, ACC_PurchaseCode, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id, new.ReceiverID_id, NEW.SupplierID_id FROM DUAL 
                    UNION ALL 
                    SELECT uuid_v4(), @id, 2, 0, new.GrandTotal, ACC_CashID, ACC_CashCode, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id, new.ReceiverID_id, NEW.SupplierID_id FROM DUAL;
            
            WHEN new.Payment BETWEEN 15 AND 18 THEN 
                INSERT INTO Voucher (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) 
                VALUES (@id, new.SectorID_id, date_format(curdate(), '%Y%m%d'), @GetVoucherNo, 6, new.ReceiverID_id, '', concat('Being product purchased worth PGK-' , new.GrandTotal ,' in purchase no-', new.PurchaseNo,' in terms of ' , PaymentTerm , ' from ', SupplierName), new.PurchaseNo, 2, new.ReceiverID_id, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id);
                
                INSERT INTO VoucherMap (ID,VOUCHERNO_ID,SLNO,DR,CR,COA_ID,COA_CODE,CREATEDAT,UPDATEDAT,UPDATEDBY_id,OPERATORID_ID,SUPPLIERID_ID) 
                SELECT uuid_v4(), @id, 1, new.GrandTotal, 0, ACC_PurchaseID, ACC_PurchaseCode, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id, new.ReceiverID_id, NEW.SupplierID_id FROM DUAL 
                UNION ALL 
                SELECT uuid_v4(), @id, 2, 0, new.GrandTotal, ACC_BankID, ACC_BankCode, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id, new.ReceiverID_id, NEW.SupplierID_id FROM DUAL;
         END CASE;

   WHEN 1 THEN 
        INSERT INTO Voucher (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) 
        VALUES (@id, new.SectorID_id, date_format(curdate(), '%Y%m%d'), @GetVoucherNo, 6, new.ReceiverID_id, '', concat('Being goods for trading worth PGK-' , new.GrandTotal ,' purchased in paid ', NEW.PaidAmount, ' & rest ', NEW.Due, ' PGK is payable to ', SupplierName, ' which purchase no-', NEW.PurchaseNo), new.PurchaseNo, 3, new.ReceiverID_id, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id);

        INSERT INTO VoucherMap (ID,VOUCHERNO_ID,SLNO,DR,CR,COA_ID,COA_CODE,CREATEDAT,UPDATEDAT,UPDATEDBY_id,OPERATORID_ID,SUPPLIERID_ID) 
        VALUES (uuid_v4(), @id, 1, new.GrandTotal, 0, ACC_PurchaseID, ACC_PurchaseCode, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id, new.ReceiverID_id, NEW.SupplierID_id), 
        (uuid_v4(), @id, 2, 0, NEW.PaidAmount, ACC_CashID, ACC_CashCode, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id, new.ReceiverID_id, NEW.SupplierID_id), 
        (uuid_v4(), @id, 3, 0, NEW.Due, ACC_PayableID, ACC_PayableCode, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id, new.ReceiverID_id, NEW.SupplierID_id);

 END CASE;
 END IF;

END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger deshbesh.PURCHASE_VOUCHER_UPDATE_INVOICE
DROP TRIGGER IF EXISTS `PURCHASE_VOUCHER_UPDATE_INVOICE`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `PURCHASE_VOUCHER_UPDATE_INVOICE` AFTER UPDATE ON `purchase` FOR EACH ROW BEGIN
 DECLARE       VOUCHERTYPE             VARCHAR(25);
 DECLARE       SECTORNO                INTEGER;
 DECLARE       INVOICENO               VARCHAR(25);

 DECLARE       ACC_PurchaseID          VARCHAR(32);
 DECLARE       ACC_PurchaseCode        INTEGER;

 DECLARE       ACC_PayableID           VARCHAR(32);
 DECLARE       ACC_PayableCode         INTEGER;
 
 DECLARE       ACC_CashID              VARCHAR(32);
 DECLARE       ACC_CashCode            INTEGER; 

 DECLARE       ACC_BankID             VARCHAR(32);
 DECLARE       ACC_BankCode           INTEGER;

 DECLARE       PaymentTitle            VARCHAR(80);
 DECLARE       PaymentTerm             VARCHAR(80);
 DECLARE       SupplierName            VARCHAR(80);

SELECT coa.id, coa.COA_Code, sectors.SLNo INTO ACC_PurchaseID, ACC_PurchaseCode, SectorNo FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = NEW.SectorID_id AND coa.COA_Code BETWEEN '30002' AND '30099';
SELECT coa.id, coa.COA_Code INTO ACC_PayableID, ACC_PayableCode FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = NEW.SectorID_id AND coa.COA_Code BETWEEN '20002' AND '20499';
SELECT coa.id, coa.COA_Code INTO ACC_CashID, ACC_CashCode FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = NEW.SectorID_id AND coa.COA_Code BETWEEN '10500' AND '10899';
SELECT coa.id, coa.COA_Code INTO ACC_BankID, ACC_BankCode FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = NEW.SectorID_id AND coa.COA_Code BETWEEN '11001' AND '11499';

SET @GetVoucherNo = '0';
SET VOUCHERTYPE = 'JV';
CALL `GET_VOUCHER_NO`(VOUCHERTYPE, SectorNo, @GetVoucherNo);

SET @id = uuid_v4();

 SELECT FullForm, label INTO PaymentTitle, PaymentTerm FROM PaymentTerms WHERE value = new.Payment;
 SELECT SupplierTitle INTO SupplierName FROM Suppliers WHERE id = new.SupplierID_id;

IF NEW.InvoiceNo != OLD.InvoiceNo AND NEW.InvoiceNo IS NOT NULL AND TRIM(NEW.InvoiceNo) <> '' THEN
 CASE NEW.PaymentStatus
        WHEN 3 THEN
            CASE
                WHEN new.Payment BETWEEN 1 AND 4 THEN
                    INSERT INTO Voucher (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) 
                    VALUES (@id, new.SectorID_id, DATE_FORMAT(CURDATE(), '%Y%m%d'), @GetVoucherNo, 6, new.ReceiverID_id, '', CONCAT('Being product purchased worth PGK-', new.GrandTotal, ' in purchase no-', new.PurchaseNo, ' in terms of ', PaymentTerm, ' from ', SupplierName), new.PurchaseNo, 2, new.ReceiverID_id, NOW(), NOW(), new.UpdatedBy_id);

                    INSERT INTO VoucherMap (ID, VOUCHERNO_ID, SLNO, DR, CR, COA_ID, COA_CODE, CREATEDAT, UPDATEDAT, UPDATEDBY_id, OPERATORID_ID, SUPPLIERID_ID) 
                    SELECT UUID_V4(), @id, 1, new.GrandTotal, 0, ACC_PurchaseID, ACC_PurchaseCode, NOW(), NOW(), new.UpdatedBy_id, new.ReceiverID_id, new.SupplierID_id FROM DUAL 
                    UNION ALL 
                    SELECT UUID_V4(), @id, 2, 0, new.GrandTotal, ACC_PayableID, ACC_PayableCode, NOW(), NOW(), new.UpdatedBy_id, new.ReceiverID_id, new.SupplierID_id FROM DUAL;

                WHEN new.Payment BETWEEN 5 AND 11 THEN 
		                INSERT INTO voucher (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) 
                    VALUES (@id, new.SectorID_id, DATE_FORMAT(CURDATE(), '%Y%m%d'), @GetVoucherNo, 6, new.ReceiverID_id, '', CONCAT('Being product purchased worth PGK-', new.GrandTotal, ' in purchase no-', new.PurchaseNo, ' in terms of ', PaymentTerm, ' from ', SupplierName), new.PurchaseNo, 2, new.ReceiverID_id, NOW(), NOW(), new.UpdatedBy_id); 
                    
                    SET @payable_uuid = uuid_v4(); 
                    INSERT INTO VoucherMap (ID,VOUCHERNO_ID,SLNO,DR,CR,COA_ID,COA_CODE,CREATEDAT,UPDATEDAT,UPDATEDBY_id,OPERATORID_ID,SUPPLIERID_ID) 
                    SELECT uuid_v4(), @id, 1, new.GrandTotal, 0, ACC_PurchaseID, ACC_PurchaseCode, NOW(), NOW(), new.UpdatedBy_id, new.ReceiverID_id, NEW.SupplierID_id FROM DUAL 
                    UNION ALL 
                    SELECT @payable_uuid, @id, 2, 0, new.GrandTotal, ACC_PayableID, ACC_PayableCode, NOW(), NOW(), new.UpdatedBy_id, new.ReceiverID_id, NEW.SupplierID_id FROM DUAL; 
                    INSERT INTO OverDue (id, VoucherMapID_id, InvoiceNo_id, PurchaseNo_id, InvDate, RcvDate, PaymentDate, Maturity, STATUS, CreatedAt, UpdatedAt, UpdatedBy_id) 
                    VALUES ( uuid_v4(), @payable_uuid, null, NEW.id, NEW.RcvDate, NEW.InvDate, null, 0, 1, NOW(), NOW(), new.UpdatedBy_id);

		           WHEN new.Payment = 13 THEN
                    INSERT INTO Voucher (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) 
                    values (@id, new.SectorID_id, date_format(curdate(), '%Y%m%d'), @GetVoucherNo, 6, new.ReceiverID_id, '', concat('Being product purchased worth PGK-' , new.GrandTotal ,' in purchase no-', new.PurchaseNo,' in terms of ' , PaymentTerm , ' from ', SupplierName), new.PurchaseNo, 2, new.ReceiverID_id, NOW(), NOW(), new.UpdatedBy_id); 
                    
                    INSERT INTO VoucherMap (ID,VOUCHERNO_ID,SLNO,DR,CR,COA_ID,COA_CODE,CREATEDAT,UPDATEDAT,UPDATEDBY_id,OPERATORID_ID,SUPPLIERID_ID) 
                    SELECT uuid_v4(), @id, 1, new.GrandTotal, 0, ACC_PurchaseID, ACC_PurchaseCode, NOW(), NOW(), new.UpdatedBy_id, new.ReceiverID_id, NEW.SupplierID_id FROM DUAL 
                    UNION ALL 
                    SELECT uuid_v4(), @id, 2, 0, new.GrandTotal, ACC_PayableID, ACC_PayableCode, NOW(), NOW(), new.UpdatedBy_id, new.ReceiverID_id, NEW.SupplierID_id FROM DUAL;
            END CASE;
   
   	WHEN 2 THEN   
        CASE 
            WHEN new.Payment = 14 THEN 
                 INSERT INTO Voucher (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) 
                    values (@id, new.SectorID_id, date_format(curdate(), '%Y%m%d'), @GetVoucherNo, 6, new.ReceiverID_id, '', concat('Being product purchased worth PGK-' , new.GrandTotal ,' in purchase no-', new.PurchaseNo,' in terms of ' , PaymentTerm , ' from ', SupplierName), new.PurchaseNo, 2, new.ReceiverID_id, NOW(), NOW(), new.UpdatedBy_id); 
                    
                    INSERT INTO VoucherMap (ID,VOUCHERNO_ID,SLNO,DR,CR,COA_ID,COA_CODE,CREATEDAT,UPDATEDAT,UPDATEDBY_id,OPERATORID_ID,SUPPLIERID_ID) 
                    SELECT uuid_v4(), @id, 1, new.GrandTotal, 0, ACC_PurchaseID, ACC_PurchaseCode, NOW(), NOW(), new.UpdatedBy_id, new.ReceiverID_id, NEW.SupplierID_id FROM DUAL 
                    UNION ALL 
                    SELECT uuid_v4(), @id, 2, 0, new.GrandTotal, ACC_CashID, ACC_CashCode, NOW(), NOW(), new.UpdatedBy_id, new.ReceiverID_id, NEW.SupplierID_id FROM DUAL;
            
            WHEN new.Payment BETWEEN 15 AND 18 THEN 
                INSERT INTO Voucher (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) 
                VALUES (@id, new.SectorID_id, date_format(curdate(), '%Y%m%d'), @GetVoucherNo, 6, new.ReceiverID_id, '', concat('Being product purchased worth PGK-' , new.GrandTotal ,' in purchase no-', new.PurchaseNo,' in terms of ' , PaymentTerm , ' from ', SupplierName), new.PurchaseNo, 2, new.ReceiverID_id, NOW(), NOW(), new.UpdatedBy_id);
                
                INSERT INTO VoucherMap (ID,VOUCHERNO_ID,SLNO,DR,CR,COA_ID,COA_CODE,CREATEDAT,UPDATEDAT,UPDATEDBY_id,OPERATORID_ID,SUPPLIERID_ID) 
                SELECT uuid_v4(), @id, 1, new.GrandTotal, 0, ACC_PurchaseID, ACC_PurchaseCode, NOW(), NOW(), new.UpdatedBy_id, new.ReceiverID_id, NEW.SupplierID_id FROM DUAL 
                UNION ALL 
                SELECT uuid_v4(), @id, 2, 0, new.GrandTotal, ACC_BankID, ACC_BankCode, NOW(), NOW(), new.UpdatedBy_id, new.ReceiverID_id, NEW.SupplierID_id FROM DUAL;
         END CASE;

   WHEN 1 THEN 
     INSERT INTO Voucher (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) 
     VALUES (@id, new.SectorID_id, date_format(curdate(), '%Y%m%d'), @GetVoucherNo, 6, new.ReceiverID_id, '', concat('Being goods for trading worth PGK-' , new.GrandTotal ,' purchased in paid ', NEW.PaidAmount, ' & rest ', NEW.Due, ' PGK is payable to ', SupplierName, ' which purchase no-', NEW.PurchaseNo), new.PurchaseNo, 3, new.ReceiverID_id, NOW(), NOW(), new.UpdatedBy_id);

     INSERT INTO VoucherMap (ID,VOUCHERNO_ID,SLNO,DR,CR,COA_ID,COA_CODE,CREATEDAT,UPDATEDAT,UPDATEDBY_id,OPERATORID_ID,SUPPLIERID_ID) 
     VALUES (uuid_v4(), @id, 1, new.GrandTotal, 0, ACC_PurchaseID, ACC_PurchaseCode, NOW(), NOW(), new.UpdatedBy_id, new.ReceiverID_id, NEW.SupplierID_id), 
     (uuid_v4(), @id, 2, 0, NEW.PaidAmount, ACC_CashID, ACC_CashCode, NOW(), NOW(), new.UpdatedBy_id, new.ReceiverID_id, NEW.SupplierID_id), 
     (uuid_v4(), @id, 3, 0, NEW.Due, ACC_PayableID, ACC_PayableCode, NOW(), NOW(), new.UpdatedBy_id, new.ReceiverID_id, NEW.SupplierID_id);

 END CASE;
 END IF;

END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger deshbesh.SALE_VOUCHER
DROP TRIGGER IF EXISTS `SALE_VOUCHER`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `SALE_VOUCHER` AFTER INSERT ON `sale` FOR EACH ROW BEGIN 
DECLARE VOUCHERTYPE VARCHAR(25);
DECLARE SECTORNO INTEGER;
DECLARE INVOICENO VARCHAR(25);
DECLARE ACC_SaleID VARCHAR(32);
DECLARE ACC_SaleCode INTEGER;
DECLARE ACC_ReceivableID VARCHAR(32);
DECLARE ACC_ReceivableCode INTEGER;
DECLARE ACC_CashID VARCHAR(32);
DECLARE ACC_CashCode INTEGER;
DECLARE ACC_BankID VARCHAR(32);
DECLARE ACC_BankCode INTEGER;
DECLARE PaymentTitle VARCHAR(80);
DECLARE PaymentTerm VARCHAR(80);
DECLARE PartyID VARCHAR(80);
DECLARE PartyName VARCHAR(80);

SELECT coa.id, coa.COA_Code, sectors.SLNo INTO ACC_SaleID, ACC_SaleCode, SectorNo FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = NEW.SectorID_id AND coa.COA_Code BETWEEN '40002' AND '40499';
SELECT coa.id, coa.COA_Code INTO ACC_ReceivableID, ACC_ReceivableCode FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = NEW.SectorID_id AND coa.COA_Code BETWEEN '11501' AND '11999';
SELECT coa.id, coa.COA_Code INTO ACC_CashID, ACC_CashCode FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = NEW.SectorID_id AND coa.COA_Code BETWEEN '10500' AND '10899';
SELECT coa.id, coa.COA_Code INTO ACC_BankID, ACC_BankCode FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = NEW.SectorID_id AND coa.COA_Code BETWEEN '11001' AND '11499';

SET @GetVoucherNo = '0';
SET VOUCHERTYPE = 'JV';
CALL `GET_VOUCHER_NO`(VOUCHERTYPE, SectorNo, @GetVoucherNo);
SET @id = uuid_v4();

SELECT FullForm, label INTO PaymentTitle, PaymentTerm
FROM PaymentTerms
WHERE value = new.Payment;

SELECT party.Title INTO PartyName
FROM myparty
JOIN party ON myparty.PartyID_id = party.id
WHERE myparty.id = NEW.PartyID_id AND myparty.SectorID_id = NEW.SectorID_id;

SET PartyID = NEW.PartyID_id;

IF NEW.PartyID_id IS NOT NULL THEN
    CASE NEW.PaymentStatus
        WHEN 3 THEN
            CASE
                WHEN new.Payment BETWEEN 1 AND 4 THEN
                    INSERT INTO Voucher (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) VALUES 
                    (@id, new.SectorID_id, date_format(curdate(), '%Y%m%d'), @GetVoucherNo, 6, new.SalesMan_id, '', concat('Being product sell worth PGK-', CAST(FORMAT(new.GrandTotal, 2) AS CHAR), ' in invoice no-', new.InvoiceNo, ' in terms of ', PaymentTerm, ' to ', PartyName), new.InvoiceNo, 2, new.SalesMan_id, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id);
                    INSERT INTO VoucherMap (ID, VOUCHERNO_ID, SLNO, DR, CR, COA_ID, COA_CODE, CREATEDAT, UPDATEDAT, UPDATEDBY_id, OPERATORID_ID, PARTYID_ID)
                    
                    SELECT uuid_v4(), @id, 1, new.GrandTotal, 0, ACC_ReceivableID, ACC_ReceivableCode, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id, new.SalesMan_id, PartyID FROM DUAL
                    UNION ALL
                    SELECT uuid_v4(), @id, 2, 0, new.GrandTotal, ACC_SaleID, ACC_SaleCode, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id, new.SalesMan_id, PartyID FROM DUAL;
                
                WHEN new.Payment BETWEEN 5 AND 11 THEN 
                    INSERT INTO voucher (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) VALUES 
                    (@id, new.SectorID_id, date_format(curdate(), '%Y%m%d'), @GetVoucherNo, 6, new.SalesMan_id, '', concat('Being product sell worth PGK-', CAST(FORMAT(new.GrandTotal, 2) AS CHAR), ' in invoice no-', new.InvoiceNo, ' in terms of ', PaymentTerm, ' to ', PartyName), new.InvoiceNo, 2, new.SalesMan_id, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id); 

                    SET @receivable_uuid = uuid_v4(); 
                    INSERT INTO VoucherMap (ID, VOUCHERNO_ID, SLNO, DR, CR, COA_ID, COA_CODE, CREATEDAT, UPDATEDAT, UPDATEDBY_id, OPERATORID_ID, PARTYID_ID) 
                     SELECT @receivable_uuid, @id, 1, new.GrandTotal, 0, ACC_ReceivableID, ACC_ReceivableCode, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id, new.SalesMan_id, PartyID FROM DUAL 
                    UNION ALL 
                     SELECT uuid_v4(), @id, 2, 0, new.GrandTotal, ACC_SaleID, ACC_SaleCode, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id, new.SalesMan_id, PartyID FROM DUAL; 

                    INSERT INTO OverDue (id, VoucherMapID_id, InvoiceNo_id, PurchaseNo_id, InvDate, RcvDate, PaymentDate, Maturity, STATUS, CreatedAt, UpdatedAt, UpdatedBy_id) VALUES 
                    (uuid_v4(), @receivable_uuid, NEW.id, NULL, NEW.Date, NEW.Date, (
                        CASE NEW.Payment 
                           WHEN 5 THEN 
                               DATE_ADD(NEW.Date, INTERVAL 7 DAY) 
                           WHEN 6 THEN 
                               DATE_ADD(NEW.Date, INTERVAL 10 DAY) 
                           WHEN 7 THEN 
                               DATE_ADD(NEW.Date, INTERVAL 30 DAY) 
                           WHEN 8 THEN 
                               DATE_ADD(NEW.Date, INTERVAL 60 DAY) 
                           WHEN 9 THEN 
                               DATE_ADD(NEW.Date, INTERVAL 90 DAY) 
                           WHEN 10 THEN 
                               LAST_DAY(NEW.Date) 
                           WHEN 11 THEN 
                               DATE_ADD(NEW.Date, INTERVAL 21 DAY) 
                           ELSE NEW.Date END),
                            0, 1, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id);

                WHEN new.Payment BETWEEN 12 AND 13 THEN
                        INSERT INTO Voucher (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id)
                        VALUES (@id, new.SectorID_id, date_format(curdate(), '%Y%m%d'), @GetVoucherNo, 6, new.SalesMan_id, '', 
                        concat('Being product sell worth PGK-', CAST(FORMAT(new.GrandTotal, 2) AS CHAR), ' in invoice no-', new.InvoiceNo, ' in terms of ', PaymentTerm, ' to ', PartyName), 
                        new.InvoiceNo, 2, new.SalesMan_id, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id);

                        INSERT INTO VoucherMap (ID, VOUCHERNO_ID, SLNO, DR, CR, COA_ID, COA_CODE, CREATEDAT, UPDATEDAT, UPDATEDBY_id, OPERATORID_ID, PARTYID_ID)
                        SELECT uuid_v4(), @id, 1, new.GrandTotal, 0, ACC_ReceivableID, ACC_ReceivableCode, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id, new.SalesMan_id, PartyID FROM DUAL
                        UNION ALL
                        SELECT uuid_v4(), @id, 2, 0, new.GrandTotal, ACC_SaleID, ACC_SaleCode, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id, new.SalesMan_id, PartyID FROM DUAL;
            END CASE;

       WHEN 2 THEN   
        CASE 
            WHEN new.Payment = 14 THEN 
                INSERT INTO Voucher (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) 
                VALUES (@id, new.SectorID_id, date_format(curdate(), '%Y%m%d'), @GetVoucherNo, 6, new.SalesMan_id, 'Cash', 
                concat('Being product sell worth PGK-', CAST(FORMAT(new.GrandTotal, 2) AS CHAR), ' in invoice no-', new.InvoiceNo, ' in terms of ', PaymentTerm, ' to ', PartyName), 
                new.InvoiceNo, 2, new.SalesMan_id, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id); 
                
                INSERT INTO VoucherMap (ID, VOUCHERNO_ID, SLNO, DR, CR, COA_ID, COA_CODE, CREATEDAT, UPDATEDAT, UPDATEDBY_id, OPERATORID_ID, PARTYID_ID) 
                SELECT uuid_v4(), @id, 1, new.GrandTotal, 0, ACC_CashID, ACC_CashCode, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id, new.SalesMan_id, PartyID 
                FROM DUAL 
                UNION ALL 
                SELECT uuid_v4(), @id, 2, 0, new.GrandTotal, ACC_SaleID, ACC_SaleCode, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id, new.SalesMan_id, PartyID 
                FROM DUAL; 
            WHEN new.Payment BETWEEN 15 AND 18 THEN 
                 INSERT INTO Voucher (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) VALUES 
                (@id, new.SectorID_id, date_format(curdate(), '%Y%m%d'), @GetVoucherNo, 6, new.SalesMan_id, '', 
                concat('Being product sell worth PGK-', CAST(FORMAT(new.GrandTotal, 2) AS CHAR), ' in invoice no-', new.InvoiceNo, ' in terms of ', PaymentTerm, ' to ', PartyName), 
                new.InvoiceNo, 2, new.SalesMan_id, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id); 
                INSERT INTO VoucherMap (ID, VOUCHERNO_ID, SLNO, DR, CR, COA_ID, COA_CODE, CREATEDAT, UPDATEDAT, UPDATEDBY_id, OPERATORID_ID, PARTYID_ID) 
                SELECT uuid_v4(), @id, 1, new.GrandTotal, 0, ACC_BankID, ACC_BankCode, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id, new.SalesMan_id, PartyID 
                FROM DUAL 
                UNION ALL 
                SELECT uuid_v4(), @id, 2, 0, new.GrandTotal, ACC_SaleID, ACC_SaleCode, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id, new.SalesMan_id, PartyID 
                FROM DUAL; 
        END CASE;

      WHEN 1 THEN 
           INSERT INTO Voucher (id, SectorID_id, Date, VoucherNo, VoucherType, Consignee, PaymentMethod, Narration, Reference, Count, OperatorID_ID, CreatedAt, UpdatedAt, UpdatedBy_id) VALUES 
           (@id, new.SectorID_id, date_format(curdate(), '%Y%m%d'), @GetVoucherNo, 6, new.SalesMan_id, CASE New.Payment WHEN 14 THEN 'Cash' ELSE 'Back' END, 
           CONCAT('Partial payment received from ', PartyName, ' for product worth ', CAST(FORMAT(new.GrandTotal, 2) AS CHAR), ', ', CAST(FORMAT(new.PaidAmount, 2) AS CHAR),' and ', CASE New.Payment WHEN 14 THEN ' paid by hand cash' 
           WHEN 15 THEN 'paid by bank' WHEN 16 THEN 'paid by cheque' WHEN 17 THEN 'paid by online' WHEN 16 THEN 'paid by card' ELSE 'N/A' END, ' rest of ', CAST(FORMAT(new.Due, 2) AS CHAR), ' remaining as due.'), 
           new.InvoiceNo, 3, new.SalesMan_id, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id); 
           
           INSERT INTO VoucherMap (ID, VOUCHERNO_ID, SLNO, DR, CR, COA_ID, COA_CODE, CREATEDAT, UPDATEDAT, UPDATEDBY_id, OPERATORID_ID, PARTYID_ID) VALUES 
           (uuid_v4(), @id, 1, NEW.PaidAmount, 0, ACC_CashID, ACC_CashCode, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id, new.SalesMan_id, PartyID), 
           (uuid_v4(), @id, 2, NEW.Due, 0, ACC_ReceivableID, ACC_ReceivableCode, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id, new.SalesMan_id, PartyID), 
           (uuid_v4(), @id, 3, 0, new.GrandTotal, ACC_SaleID, ACC_SaleCode, new.CreatedAt, new.CreatedAt, new.UpdatedBy_id, new.SalesMan_id, PartyID); 
      END CASE;
END IF;

END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger deshbesh.STOCK_TRACE_ON_PURCHASE
DROP TRIGGER IF EXISTS `STOCK_TRACE_ON_PURCHASE`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `STOCK_TRACE_ON_PURCHASE` BEFORE INSERT ON `purchasemap` FOR EACH ROW BEGIN
 DECLARE Available DECIMAL(10,2);
 SELECT stock.Qty INTO Available FROM stock JOIN productitems ON stock.ItemID_id = productitems.id AND stock.SectorID_id = NEW.SectorID_id WHERE stock.ItemID_id = NEW.ItemID_id AND stock.SectorID_id = NEW.SectorID_id;
 SET NEW.Available = Available;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger deshbesh.STOCK_TRACE_ON_PURCHASE_RETURN
DROP TRIGGER IF EXISTS `STOCK_TRACE_ON_PURCHASE_RETURN`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `STOCK_TRACE_ON_PURCHASE_RETURN` BEFORE INSERT ON `purchasemapreturn` FOR EACH ROW BEGIN
 DECLARE Available DECIMAL(10,2);
 SELECT stock.Qty INTO Available FROM stock JOIN productitems ON stock.ItemID_id = productitems.id AND stock.SectorID_id = (SELECT SectorID_id FROM purchase WHERE id = NEW.PurchaseNo_id) WHERE stock.ItemID_id = NEW.ItemID_id AND stock.SectorID_id = (SELECT SectorID_id FROM purchase WHERE id = NEW.PurchaseNo_id);
 SET NEW.Available = Available;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger deshbesh.STOCK_TRACE_ON_SALE
DROP TRIGGER IF EXISTS `STOCK_TRACE_ON_SALE`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `STOCK_TRACE_ON_SALE` BEFORE INSERT ON `salemap` FOR EACH ROW BEGIN
 DECLARE Available DECIMAL(10,2);
 SELECT stock.Qty INTO Available FROM stock JOIN productitems ON stock.ItemID_id = productitems.id AND stock.SectorID_id = NEW.SectorID_id WHERE stock.ItemID_id = NEW.ItemID_id AND stock.SectorID_id = NEW.SectorID_id;
  IF Available > 0 THEN
    SET NEW.Available = Available;
  ELSEIF NEW.Status = 100 THEN
  SET NEW.Available = NEW.Available;
  ELSE
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = NEW.InvoiceNo_id;
  END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger deshbesh.STOCK_TRACE_ON_SALE_RETURN
DROP TRIGGER IF EXISTS `STOCK_TRACE_ON_SALE_RETURN`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `STOCK_TRACE_ON_SALE_RETURN` BEFORE INSERT ON `salemapreturn` FOR EACH ROW BEGIN
 DECLARE Available DECIMAL(10,2);
 SELECT stock.Qty INTO Available FROM stock JOIN productitems ON stock.ItemID_id = productitems.id AND stock.SectorID_id = (SELECT SectorID_id FROM sale WHERE id = NEW.InvoiceNo_id) WHERE stock.ItemID_id = NEW.ItemID_id AND stock.SectorID_id = (SELECT SectorID_id FROM sale WHERE id = NEW.InvoiceNo_id);
 SET NEW.Available = Available;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger deshbesh.STOCK_UPDATE_ON_PURCHASE_RETURN
DROP TRIGGER IF EXISTS `STOCK_UPDATE_ON_PURCHASE_RETURN`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `STOCK_UPDATE_ON_PURCHASE_RETURN` AFTER INSERT ON `purchasemapreturn` FOR EACH ROW BEGIN
UPDATE stock SET 
        Qty = Qty - (NEW.Qty * NEW.UnitQty), 
        Weight = Weight - (NEW.Weight * NEW.UnitQty)
    WHERE ItemID_id = NEW.ItemID_id AND SectorID_id = (SELECT SectorID_id FROM purchase WHERE id = NEW.PurchaseNo_id);
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger deshbesh.STOCK_UPDATE_ON_PURCHASE_RETURN_DELETE
DROP TRIGGER IF EXISTS `STOCK_UPDATE_ON_PURCHASE_RETURN_DELETE`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `STOCK_UPDATE_ON_PURCHASE_RETURN_DELETE` AFTER DELETE ON `purchasemapreturn` FOR EACH ROW BEGIN
UPDATE stock SET 
        Qty = Qty + (OLD.Qty * OLD.UnitQty), 
        Weight = (OLD.Weight * OLD.UnitQty)
    WHERE ItemID_id = OLD.ItemID_id AND SectorID_id = (SELECT SectorID_id FROM purchase WHERE id = OLD.PurchaseNo_id);
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger deshbesh.STOCK_UPDATE_ON_SALE_RETURN
DROP TRIGGER IF EXISTS `STOCK_UPDATE_ON_SALE_RETURN`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `STOCK_UPDATE_ON_SALE_RETURN` AFTER INSERT ON `salemapreturn` FOR EACH ROW BEGIN
UPDATE stock SET 
        Qty = Qty + NEW.Qty, 
        Weight = Weight + NEW.Weight 
    WHERE ItemID_id = NEW.ItemID_id AND SectorID_id = (SELECT SectorID_id FROM sale WHERE id = NEW.InvoiceNo_id);
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger deshbesh.STOCK_UPDATE_ON_SALE_RETURN_DELETE
DROP TRIGGER IF EXISTS `STOCK_UPDATE_ON_SALE_RETURN_DELETE`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `STOCK_UPDATE_ON_SALE_RETURN_DELETE` AFTER DELETE ON `salemapreturn` FOR EACH ROW BEGIN
UPDATE stock SET 
        Qty = Qty - OLD.Qty, 
        Weight = Weight - OLD.Weight 
    WHERE ItemID_id = OLD.ItemID_id AND SectorID_id = (SELECT SectorID_id FROM sale WHERE id = OLD.InvoiceNo_id);
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger deshbesh.TOKS_STOK_IN
DROP TRIGGER IF EXISTS `TOKS_STOK_IN`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `TOKS_STOK_IN` BEFORE UPDATE ON `deliveryrequest` FOR EACH ROW BEGIN
		DECLARE SectorNo INTEGER;
		DECLARE CounterID VARCHAR(35);
		DECLARE PartyID VARCHAR(35);
		DECLARE salemap_qty DECIMAL(10, 2);
		DECLARE salemap_wt DECIMAL(10, 3);
		DECLARE salemap_rate DECIMAL(10, 2);
		DECLARE salemap_itemID CHAR(36);

    IF NEW.Status = 3 AND NEW.RequestedID_id <> NEW.RequestForID_id THEN
		-- Calculate PaidAmount and Due based on GrandTotal
		 SET @PaidAmount = CASE
		     WHEN NEW.PaidAmount = NEW.GrandTotal THEN NEW.GrandTotal
		     ELSE NEW.PaidAmount
		 END;
		
		 SET @Due = NEW.GrandTotal - @PaidAmount;
		
		 -- Calculate PaymentStatus based on PaidAmount and Due
		 SET @PaymentStatus = CASE
		     WHEN @PaidAmount = NEW.GrandTotal THEN 2
		     WHEN @PaidAmount > 0 AND @Due > 0 THEN 1
		     WHEN @PaidAmount = 0 AND @Due > 0 THEN 3
		     ELSE 0
		 END;
    
        SET @sale_id = uuid_v4();
        SET @GetInvoiceNo = '0';

        -- Use JOINs to fetch the required data
        SELECT SLNo INTO SectorNo FROM sectors WHERE id = NEW.RequestedID_id;
        SELECT id INTO CounterID FROM counters WHERE SectorID_id = NEW.RequestedID_id AND No = 1;

        -- Use a subquery to fetch the desired PartyID
        SELECT m.id INTO PartyID FROM myparty m JOIN party p ON m.PartyID_id = p.id WHERE p.OwnID_id = NEW.RequestForID_id AND m.SectorID_id = NEW.RequestedID_id ORDER BY m.id LIMIT 1;

        CALL `GET_INVOICE_NO`(SectorNo, 1, @GetInvoiceNo);

        INSERT INTO Sale (
            id, InvoiceNo, Date, GrandTotal, VatRate, Vat, Discount, Shipping, PaidAmount, Due, RefundAmount, Status, PaymentStatus, ItemCount, Payment, CreatedAt, UpdatedAt, SectorID_id, PartyID_id, CounterID_id, SalesMan_id, UpdatedBy_id
        )
        SELECT
            @sale_id, @GetInvoiceNo, date_format(CURDATE(), '%Y%m%d'), NEW.GrandTotal, NEW.VatRate, NEW.Vat, NEW.Discount, NEW.Shipping, @PaidAmount, @Due, NEW.RefundAmount, 100,
            @PaymentStatus, ItemCount, NEW.Payment, NOW(), NOW(), NEW.RequestedID_id, PartyID, CounterID, NEW.SalesMan_id, NEW.UpdatedBy_id
        FROM DeliveryRequest
        WHERE id = NEW.id;
        -- Set the SaleID_id in DeliveryRequest to link the records
        SET NEW.SaleID_id = @sale_id;
        
        INSERT INTO SaleMap (
            id, SLNo, UnitName, UnitQty, UnitWeight, UnitPrice, Weight, Qty, Rate, SubTotal, Available, STATUS, Remark, CreatedAt, UpdatedAt, SectorID_id, InvoiceNo_id, ItemID_id, UpdatedBy_id
        )
        SELECT
            uuid_v4(), SLNo, UnitName, UnitQty, UnitWeight, UnitPrice, Weight, Qty, Rate, SubTotal, Available, 100, Remark, NOW(), NOW(), NEW.RequestedID_id, @sale_id, ItemID_id, NEW.UpdatedBy_id
        FROM DeliveryRequestMap
        WHERE RequestID_id = NEW.id;
        
    ELSEIF NEW.Status = 3 AND NEW.RequestedID_id = NEW.RequestForID_id THEN
        CALL updateStock(NEW.id, NEW.RequestedID_id, NEW.RequestForID_id);
    END IF;

END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger deshbesh.VIA_TOKS_PURCHASE
DROP TRIGGER IF EXISTS `VIA_TOKS_PURCHASE`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `VIA_TOKS_PURCHASE` AFTER UPDATE ON `deliveryrequest` FOR EACH ROW BEGIN
		DECLARE SectorNo INTEGER;
		DECLARE CounterID VARCHAR(35);
		DECLARE SupplierID VARCHAR(35);
		DECLARE InvNo VARCHAR(35);
		DECLARE DocketNo VARCHAR(35);
		DECLARE InvDate VARCHAR(35);

    IF NEW.Status = 3 AND NEW.RequestedID_id <> NEW.RequestForID_id THEN
		 -- Calculate PaidAmount and Due based on GrandTotal
		 SET @PaidAmount = CASE
		     WHEN NEW.PaidAmount = NEW.GrandTotal THEN NEW.GrandTotal
		     ELSE NEW.PaidAmount
		 END;
		 
		 SET @Due = NEW.GrandTotal - @PaidAmount;
		 
		 -- Calculate PaymentStatus based on PaidAmount and Due
		 SET @PaymentStatus = CASE
		     WHEN @PaidAmount = NEW.GrandTotal THEN 2
		     WHEN @PaidAmount > 0 AND @Due > 0 THEN 1
		     WHEN @PaidAmount = 0 AND @Due > 0 THEN 3
		     ELSE 0
		 END;

        SET @purs_id = uuid_v4();
        SET @GetPurchaseNo = '0';

        -- Use JOINs to fetch the required data
        SELECT SLNo INTO SectorNo FROM sectors WHERE id = NEW.RequestForID_id;
        SELECT InvoiceNo, Date INTO InvNo, InvDate FROM sale WHERE id = NEW.SaleID_id;
        SELECT DeliveryNoteNo INTO DocketNo FROM deliverynote WHERE RequestID_id = NEW.id;
        
        -- Use a subquery to fetch the desired SupplierID
        SELECT id INTO SupplierID FROM suppliers WHERE OwnID_id = NEW.RequestedID_id;

        CALL `GET_PURCHASE_NO`('PN', SectorNo, @GetPurchaseNo);

        INSERT INTO Purchase (
            id, PurchaseNo, InvoiceNo, DocketNo, InvDate, RcvDate, Payment, GrandTotal, VatRate, Vat, Discount, PaidAmount, Due, RefundAmount, Count, Status, PaymentStatus, ReceiverID_id, CreatedAt, UpdatedAt, UpdatedBy_id, SectorID_id, SupplierID_id
        )
        SELECT
            @purs_id, @GetPurchaseNo, InvNo, DocketNo, InvDate, date_format(CURDATE(), '%Y%m%d'), NEW.Payment, NEW.GrandTotal, NEW.VatRate, NEW.Vat, NEW.Discount, @PaidAmount, @Due, NEW.RefundAmount, NEW.ItemCount, 100, @PaymentStatus, NEW.UpdatedBy_id, NOW(), NOW(), NEW.UpdatedBy_id, NEW.RequestForID_id, SupplierID
        FROM DeliveryRequest
        WHERE id = NEW.id;
        
        INSERT INTO PurchaseMap (
            id, SLNo, UnitName, UnitQty, Weight, Qty, Rate, Remark, SubTotal, Available, STATUS, CreatedAt, UpdatedAt, SectorID_id, PurchaseNo_id, ReceiverID_id, ItemID_id, UpdatedBy_id
        )
        SELECT
            uuid_v4(), SLNo, UnitName, UnitQty, Weight, Qty, Rate, Remark, SubTotal, Available, 100, NOW(), NOW(), NEW.RequestForID_id, @purs_id, NEW.UpdatedBy_id, ItemID_id, NEW.UpdatedBy_id
        FROM DeliveryRequestMap
        WHERE RequestID_id = NEW.id;
    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger deshbesh.YARD_STOCK_ADJUSTMENT
DROP TRIGGER IF EXISTS `YARD_STOCK_ADJUSTMENT`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `YARD_STOCK_ADJUSTMENT` BEFORE INSERT ON `deliverynotemap` FOR EACH ROW BEGIN
  DECLARE oldQty INT DEFAULT 0;
  DECLARE oldWeight INT DEFAULT 0;

  SELECT Qty, Weight INTO oldQty, oldWeight FROM yard 
  WHERE ContainerID_id = NEW.ContainerID_id AND ItemID_id = NEW.ItemID_id;

  IF oldQty >= NEW.Qty THEN
    UPDATE yard SET Qty = oldQty - NEW.Qty, Weight = oldWeight - NEW.Weight 
    WHERE ContainerID_id = NEW.ContainerID_id AND ItemID_id = NEW.ItemID_id;
  ELSE 
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Quantity in yard is less than delivery quantity';
  END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
