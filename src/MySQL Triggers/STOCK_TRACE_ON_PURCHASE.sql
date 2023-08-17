CREATE DEFINER = `root` @`localhost` TRIGGER `STOCK_TRACE_ON_PURCHASE` BEFORE
INSERT
    ON `purchasemap` FOR EACH ROW BEGIN DECLARE Available DECIMAL(10, 2);

SELECT
    stock.Qty INTO Available
FROM
    stock
    JOIN productitems ON stock.ItemID_id = productitems.id
    AND stock.SectorID_id = NEW.SectorID_id
WHERE
    stock.ItemID_id = NEW.ItemID_id
    AND stock.SectorID_id = NEW.SectorID_id;

SET
    NEW.Available = Available;

END