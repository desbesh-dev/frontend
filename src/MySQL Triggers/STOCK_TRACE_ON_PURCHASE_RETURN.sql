CREATE DEFINER = `root` @`localhost` TRIGGER `STOCK_TRACE_ON_PURCHASE_RETURN` BEFORE
INSERT
    ON `purchasemapreturn` FOR EACH ROW BEGIN DECLARE Available DECIMAL(10, 2);

SELECT
    stock.Qty INTO Available
FROM
    stock
    JOIN productitems ON stock.ItemID_id = productitems.id
    AND stock.SectorID_id = (
        SELECT
            SectorID_id
        FROM
            purchase
        WHERE
            id = NEW.PurchaseNo_id
    )
WHERE
    stock.ItemID_id = NEW.ItemID_id
    AND stock.SectorID_id = (
        SELECT
            SectorID_id
        FROM
            purchase
        WHERE
            id = NEW.PurchaseNo_id
    );

SET
    NEW.Available = Available;

END