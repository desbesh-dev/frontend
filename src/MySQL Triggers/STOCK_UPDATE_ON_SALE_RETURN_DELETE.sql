CREATE DEFINER = `root` @`localhost` TRIGGER `STOCK_UPDATE_ON_SALE_RETURN_DELETE`
AFTER
    DELETE ON `salemapreturn` FOR EACH ROW BEGIN
UPDATE
    stock
SET
    Qty = Qty - OLD.Qty,
    Weight = Weight - OLD.Weight
WHERE
    ItemID_id = OLD.ItemID_id
    AND SectorID_id = (
        SELECT
            SectorID_id
        FROM
            sale
        WHERE
            id = OLD.InvoiceNo_id
    );

END