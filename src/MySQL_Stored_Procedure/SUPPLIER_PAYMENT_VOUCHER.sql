CREATE DEFINER=`root`@`localhost` PROCEDURE `SUPPLIER_PAYMENT_VOUCHER`(
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
LANGUAGE SQL
NOT DETERMINISTIC
CONTAINS SQL
SQL SECURITY DEFINER
COMMENT ''
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
 
 SELECT coa.id, coa.COA_Code, sectors.SLNo INTO ACC_PursID, ACC_PursCode, SectorNo FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = SectorIDParam AND coa.COA_Code BETWEEN '30002' AND '30499';
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

END