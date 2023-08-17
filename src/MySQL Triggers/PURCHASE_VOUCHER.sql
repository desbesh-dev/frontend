BEGIN
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
SELECT coa.id, coa.COA_Code INTO ACC_CashID, ACC_CashCode FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = NEW.SectorID_id AND coa.COA_Code BETWEEN '10500' AND '10999';
SELECT coa.id, coa.COA_Code INTO ACC_BankID, ACC_BankCode FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = NEW.SectorID_id AND coa.COA_Code BETWEEN '11001' AND '11499';

SET @GetVoucherNo = '0';
SET VOUCHERTYPE = 'JV';
CALL `GET_VOUCHER_NO`(VOUCHERTYPE, SectorNo, @GetVoucherNo);

SET @id = uuid_v4();

 SELECT FullForm, label INTO PaymentTitle, PaymentTerm FROM PaymentTerms WHERE value = new.Payment;
 SELECT SupplierTitle INTO SupplierName FROM Suppliers WHERE id = new.SupplierID_id;
 
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

 END IF;

END