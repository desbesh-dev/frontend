CREATE DEFINER = `root` @`localhost` TRIGGER `STOCK_TRACE_ON_SALE_RETURN` BEFORE
INSERT
    ON `salemapreturn` FOR EACH ROW BEGIN DECLARE Available DECIMAL(10, 2);

SELECT
    stock.Qty INTO Available
FROM
    stock
    JOIN productitems ON stock.ItemID_id = productitems.id
    AND stock.SectorID_id = (
        SELECT
            SectorID_id
        FROM
            sale
        WHERE
            id = NEW.InvoiceNo_id
    )
WHERE
    stock.ItemID_id = NEW.ItemID_id
    AND stock.SectorID_id = (
        SELECT
            SectorID_id
        FROM
            sale
        WHERE
            id = NEW.InvoiceNo_id
    );

SET
    NEW.Available = Available;

END