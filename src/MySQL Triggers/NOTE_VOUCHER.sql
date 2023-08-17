CREATE DEFINER = `root` @`localhost` TRIGGER `NOTE_VOUCHER`
AFTER
INSERT
    ON `note` FOR EACH ROW BEGIN DECLARE VOUCHERTYPE VARCHAR(25);

DECLARE SectorNo INTEGER;

DECLARE INVOICENO VARCHAR(25);

DECLARE ACC_ReturnInwardID VARCHAR(32);

DECLARE ACC_ReturnInwardCode INTEGER;

DECLARE ACC_PurchaseID VARCHAR(32);

DECLARE ACC_PurchaseCode INTEGER;

DECLARE ACC_ReceivableID VARCHAR(32);

DECLARE ACC_ReceivableCode INTEGER;

DECLARE ACC_PayableID VARCHAR(32);

DECLARE ACC_PayableCode INTEGER;

DECLARE ACC_CashID VARCHAR(32);

DECLARE ACC_CashCode INTEGER;

DECLARE ACC_BankID VARCHAR(32);

DECLARE ACC_BankCode INTEGER;

DECLARE PartyID VARCHAR(80);

DECLARE PartyName VARCHAR(80);

SET
    @GetVoucherNo = '0';

SET
    VOUCHERTYPE = 'JV';

SET
    @id = uuid_v4();

SELECT
    InvoiceNo INTO InvoiceNo
FROM
    sale
WHERE
    id = new.InvoiceNo_id;

SELECT
    party.id,
    party.Title INTO PartyID,
    PartyName
FROM
    myparty
    JOIN party ON myparty.PartyID_id = party.id
WHERE
    myparty.id = NEW.PartyID_id
    AND myparty.SectorID_id = NEW.SectorID_id;

IF NEW.PartyID_id IS NOT NULL
AND NEW.NoteType = 2 THEN
SELECT
    coa.id,
    coa.COA_Code,
    sectors.SLNo INTO ACC_ReturnInwardID,
    ACC_ReturnInwardCode,
    SectorNo
FROM
    coa
    INNER JOIN sectors ON coa.SectorID_id = sectors.id
WHERE
    sectors.id = NEW.SectorID_id
    AND coa.COA_Code BETWEEN '40501'
    AND '40999';

SELECT
    coa.id,
    coa.COA_Code INTO ACC_ReceivableID,
    ACC_ReceivableCode
FROM
    coa
    INNER JOIN sectors ON coa.SectorID_id = sectors.id
WHERE
    sectors.id = NEW.SectorID_id
    AND coa.COA_Code BETWEEN '11501'
    AND '11999';

CALL `GET_VOUCHER_NO`(VOUCHERTYPE, SectorNo, @GetVoucherNo);

INSERT INTO
    Voucher (
        id,
        SectorID_id,
        Date,
        VoucherNo,
        VoucherType,
        Consignee,
        PaymentMethod,
        Narration,
        Reference,
        Count,
        OperatorID_ID,
        CreatedAt,
        UpdatedAt,
        UpdatedBy_id
    )
VALUES
    (
        @id,
        new.SectorID_id,
        date_format(curdate(), '%Y%m%d'),
        @GetVoucherNo,
        6,
        new.Rep_id,
        '',
        NEW.Details,
        new.NoteNo,
        2,
        new.Rep_id,
        new.CreatedAt,
        new.CreatedAt,
        new.UpdatedBy_id
    );

INSERT INTO
    VoucherMap (
        ID,
        VOUCHERNO_ID,
        SLNO,
        DR,
        CR,
        COA_ID,
        COA_CODE,
        CREATEDAT,
        UPDATEDAT,
        UPDATEDBY_id,
        OPERATORID_ID,
        PARTYID_ID
    )
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
FROM
    DUAL
UNION
ALL
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
FROM
    DUAL;

ELSEIF NEW.SupplierID_id IS NOT NULL
AND NEW.NoteType = 3 THEN
SELECT
    coa.id,
    coa.COA_Code INTO ACC_PayableID,
    ACC_PayableCode
FROM
    coa
    INNER JOIN sectors ON coa.SectorID_id = sectors.id
WHERE
    sectors.id = NEW.SectorID_id
    AND coa.COA_Code BETWEEN '20002'
    AND '20499';

SELECT
    coa.id,
    coa.COA_Code,
    sectors.SLNo INTO ACC_PurchaseID,
    ACC_PurchaseCode,
    SectorNo
FROM
    coa
    INNER JOIN sectors ON coa.SectorID_id = sectors.id
WHERE
    sectors.id = NEW.SectorID_id
    AND coa.COA_Code BETWEEN '30002'
    AND '30499';

CALL `GET_VOUCHER_NO`(VOUCHERTYPE, SectorNo, @GetVoucherNo);

INSERT INTO
    Voucher (
        id,
        SectorID_id,
        Date,
        VoucherNo,
        VoucherType,
        Consignee,
        PaymentMethod,
        Narration,
        Reference,
        Count,
        OperatorID_ID,
        CreatedAt,
        UpdatedAt,
        UpdatedBy_id
    )
VALUES
    (
        @id,
        new.SectorID_id,
        date_format(curdate(), '%Y%m%d'),
        @GetVoucherNo,
        6,
        new.Rep_id,
        '',
        NEW.Details,
        new.NoteNo,
        2,
        new.Rep_id,
        new.CreatedAt,
        new.CreatedAt,
        new.UpdatedBy_id
    );

INSERT INTO
    VoucherMap (
        ID,
        VOUCHERNO_ID,
        SLNO,
        DR,
        CR,
        COA_ID,
        COA_CODE,
        CREATEDAT,
        UPDATEDAT,
        UPDATEDBY_id,
        OPERATORID_ID,
        SUPPLIERID_ID
    )
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
FROM
    DUAL
UNION
ALL
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
FROM
    DUAL;

ELSEIF NEW.PartyID_id IS NULL
AND NEW.NoteType = 1 THEN
SELECT
    coa.id,
    coa.COA_Code,
    sectors.SLNo INTO ACC_ReturnInwardID,
    ACC_ReturnInwardCode,
    SectorNo
FROM
    coa
    INNER JOIN sectors ON coa.SectorID_id = sectors.id
WHERE
    sectors.id = NEW.SectorID_id
    AND coa.COA_Code BETWEEN '40501'
    AND '40999';

SELECT
    coa.id,
    coa.COA_Code INTO ACC_CashID,
    ACC_CashCode
FROM
    coa
    INNER JOIN sectors ON coa.SectorID_id = sectors.id
WHERE
    sectors.id = NEW.SectorID_id
    AND coa.COA_Code BETWEEN '10500'
    AND '10999';

CALL `GET_VOUCHER_NO`(VOUCHERTYPE, SectorNo, @GetVoucherNo);

INSERT INTO
    Voucher (
        id,
        SectorID_id,
        Date,
        VoucherNo,
        VoucherType,
        Consignee,
        PaymentMethod,
        Narration,
        Reference,
        Count,
        OperatorID_ID,
        CreatedAt,
        UpdatedAt,
        UpdatedBy_id
    )
VALUES
    (
        @id,
        new.SectorID_id,
        date_format(curdate(), '%Y%m%d'),
        @GetVoucherNo,
        6,
        new.Rep_id,
        '',
        NEW.Details,
        new.NoteNo,
        2,
        new.Rep_id,
        new.CreatedAt,
        new.CreatedAt,
        new.UpdatedBy_id
    );

INSERT INTO
    VoucherMap (
        ID,
        VOUCHERNO_ID,
        SLNO,
        DR,
        CR,
        COA_ID,
        COA_CODE,
        CREATEDAT,
        UPDATEDAT,
        UPDATEDBY_id,
        OPERATORID_ID,
        PARTYID_ID
    )
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
FROM
    DUAL
UNION
ALL
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
FROM
    DUAL;

ELSEIF NEW.SupplierID_id IS NOT NULL
AND NEW.NoteType = 1 THEN
SELECT
    coa.id,
    coa.COA_Code INTO ACC_CashID,
    ACC_CashCode
FROM
    coa
    INNER JOIN sectors ON coa.SectorID_id = sectors.id
WHERE
    sectors.id = NEW.SectorID_id
    AND coa.COA_Code BETWEEN '10500'
    AND '10999';

SELECT
    coa.id,
    coa.COA_Code,
    sectors.SLNo INTO ACC_PurchaseID,
    ACC_PurchaseCode,
    SectorNo
FROM
    coa
    INNER JOIN sectors ON coa.SectorID_id = sectors.id
WHERE
    sectors.id = NEW.SectorID_id
    AND coa.COA_Code BETWEEN '30002'
    AND '30499';

CALL `GET_VOUCHER_NO`(VOUCHERTYPE, SectorNo, @GetVoucherNo);

INSERT INTO
    Voucher (
        id,
        SectorID_id,
        Date,
        VoucherNo,
        VoucherType,
        Consignee,
        PaymentMethod,
        Narration,
        Reference,
        Count,
        OperatorID_ID,
        CreatedAt,
        UpdatedAt,
        UpdatedBy_id
    )
VALUES
    (
        @id,
        new.SectorID_id,
        date_format(curdate(), '%Y%m%d'),
        @GetVoucherNo,
        6,
        new.Rep_id,
        '',
        NEW.Details,
        new.NoteNo,
        2,
        new.Rep_id,
        new.CreatedAt,
        new.CreatedAt,
        new.UpdatedBy_id
    );

INSERT INTO
    VoucherMap (
        ID,
        VOUCHERNO_ID,
        SLNO,
        DR,
        CR,
        COA_ID,
        COA_CODE,
        CREATEDAT,
        UPDATEDAT,
        UPDATEDBY_id,
        OPERATORID_ID,
        SUPPLIERID_ID
    )
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
FROM
    DUAL
UNION
ALL
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
FROM
    DUAL;

END IF;

END