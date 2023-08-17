CREATE DEFINER = `root` @`localhost` TRIGGER `DELIVERY_ORDER_STOCK_AVAILABILITY` BEFORE
INSERT
    ON `deliveryordermap` FOR EACH ROW BEGIN DECLARE Available DECIMAL(10, 2);

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
            id = NEW.OrderNo_id
    )
WHERE
    stock.ItemID_id = NEW.ItemID_id
    AND stock.SectorID_id = (
        SELECT
            SectorID_id
        FROM
            sale
        WHERE
            id = NEW.OrderNo_id
    );

SET
    NEW.Available = Available;

END