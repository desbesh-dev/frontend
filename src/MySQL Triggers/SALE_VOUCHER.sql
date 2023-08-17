BEGIN 
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
SELECT coa.id, coa.COA_Code INTO ACC_CashID, ACC_CashCode FROM coa INNER JOIN sectors ON coa.SectorID_id = sectors.id WHERE sectors.id = NEW.SectorID_id AND coa.COA_Code BETWEEN '10500' AND '10999';
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

END