CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_INVOICE_NO`(
	IN `SectorNo` INT,
	IN `CounterNo` INT,
	OUT `GetInvoiceNo` VARCHAR(25)
)
LANGUAGE SQL
NOT DETERMINISTIC
CONTAINS SQL
SQL SECURITY DEFINER
COMMENT ''
BEGIN 
DECLARE Sector VARCHAR(9); 
SET Sector = CONCAT(SUBSTR(CONCAT(RPAD('0', 3, 0),SectorNo),-3,3), SUBSTR(CONCAT(RPAD('0', 2, 0),CounterNo),-2,2)); 

SELECT MAX(sale.InvoiceNo) INTO GetInvoiceNo FROM sale INNER JOIN sectors ON sale.SectorID_id = sectors.id INNER JOIN counters ON sale.CounterID_id = counters.id WHERE sectors.SLNo = SectorNo AND counters.No=CounterNo; 
		IF GetInvoiceNo IS NULL THEN 
        BEGIN 
          SELECT concat(concat(Sector, date_format(curdate(), '%y%m%d')), '0001') INTO GetInvoiceNo FROM DUAL; 
        END; 
      ELSE 
        BEGIN 
          IF SUBSTR(GetInvoiceNo,1,11) = concat(SUBSTR(Sector,1,5), date_format(curdate(), '%y%m%d')) THEN 
            SELECT CONCAT(SUBSTR(GetInvoiceNo,1,11),  SUBSTR(CONCAT(RPAD('0', 4, 0), CAST(MAX(SUBSTR(CONCAT(SUBSTR(Sector,1,2), GetInvoiceNo),11,15))+1 AS CHAR(30) )),-4,4)) INTO GetInvoiceNo FROM sale INNER JOIN sectors ON sale.SectorID_id = sectors.id INNER JOIN counters ON sale.CounterID_id = counters.id WHERE sectors.SLNo = SectorNo AND counters.No=CounterNo; 
			 ELSE 
            SET GetInvoiceNo ='000000000000000'; 
            SELECT CONCAT(CONCAT(Sector, date_format(curdate(), '%y%m%d')), SUBSTR(CONCAT(RPAD('0', 4, 0),CAST(MAX(SUBSTR(SUBSTR(Sector,1,2) || GetInvoiceNo,11,15))+1 AS CHAR(20))),-4,4)) INTO GetInvoiceNo FROM sale INNER JOIN sectors ON sale.SectorID_id = sectors.id INNER JOIN counters ON sale.CounterID_id = counters.id WHERE sectors.SLNo = SectorNo AND counters.No=CounterNo; 
          END IF; 
        END; 
      END IF; 
END