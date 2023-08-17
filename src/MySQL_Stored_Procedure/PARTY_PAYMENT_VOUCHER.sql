CREATE DEFINER=`root`@`localhost` PROCEDURE `PARTY_PAYMENT_VOUCHER`(
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
LANGUAGE SQL
NOT DETERMINISTIC
CONTAINS SQL
SQL SECURITY DEFINER
COMMENT ''
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
 SELECT party.Title INTO PartyName FROM myparty JOIN party ON myparty.PartyID_id = party.id WHERE myparty.PartyID_id = PartyIDParam AND myparty.SectorID_id = SectorIDParam;
 

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

END