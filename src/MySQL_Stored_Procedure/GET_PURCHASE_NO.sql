CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_PURCHASE_NO`(
	IN `InvoiceType` VARCHAR(5),
	IN `SectorNo` INT,
	OUT `GetPurchaseNo` VARCHAR(255)
)
LANGUAGE SQL
NOT DETERMINISTIC
CONTAINS SQL
SQL SECURITY DEFINER
COMMENT ''
BEGIN
DECLARE Sector VARCHAR(9);

SET Sector = CONCAT(InvoiceType, SUBSTR(CONCAT(RPAD('0', 3, 0),SectorNo),-3,3));

SELECT MAX(SUBSTR(purchase.PurchaseNo,3,14)) INTO GetPurchaseNo FROM purchase INNER JOIN sectors ON purchase.SectorID_id = sectors.id WHERE sectors.SLNo = SectorNo;
      IF GetPurchaseNo IS NULL THEN
        BEGIN
          SELECT concat(concat(Sector, date_format(curdate(), '%y%m%d')), '0001') INTO GetPurchaseNo FROM Dual;
        END;
      ELSE
        BEGIN
          IF SUBSTR(GetPurchaseNo,1,9) = concat(SUBSTR(Sector,3,5), date_format(curdate(), '%y%m%d')) THEN
              SELECT CONCAT(CONCAT(SUBSTR(Sector,1,2), SUBSTR(GetPurchaseNo,1,9)),  SUBSTR(CONCAT(RPAD('0', 4, 0), CAST(MAX(SUBSTR(CONCAT(SUBSTR(Sector,1,2), GetPurchaseNo),11,15))+1 AS CHAR(30) )),-4,4)) INTO GetPurchaseNo FROM purchase INNER JOIN sectors ON purchase.SectorID_id = sectors.id WHERE sectors.SLNo = SectorNo; 
          ELSE 
            SET GetPurchaseNo ='000000000000000'; 
            SELECT CONCAT(CONCAT(Sector, date_format(curdate(), '%y%m%d')), SUBSTR(CONCAT(RPAD('0', 4, 0),CAST(MAX(SUBSTR(SUBSTR(Sector,1,2) || GetPurchaseNo,11,15))+1 AS CHAR(20))),-4,4)) INTO GetPurchaseNo FROM purchase INNER JOIN sectors ON purchase.SectorID_id = sectors.id WHERE sectors.SLNo = SectorNo;
          END IF;
        END;
      END IF;
END