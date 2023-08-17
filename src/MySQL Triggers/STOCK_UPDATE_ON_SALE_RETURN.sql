CREATE DEFINER = `root` @`localhost` TRIGGER `STOCK_UPDATE_ON_SALE_RETURN`
AFTER
INSERT
    ON `salemapreturn` FOR EACH ROW BEGIN
UPDATE
    stock
SET
    Qty = Qty + NEW.Qty,
    Weight = Weight + NEW.Weight
WHERE
    ItemID_id = NEW.ItemID_id
    AND SectorID_id = (
        SELECT
            SectorID_id
        FROM
            sale
        WHERE
            id = NEW.InvoiceNo_id
    );

END