CREATE DEFINER = `root` @`localhost` TRIGGER `STOCK_UPDATE_ON_PURCHASE_RETURN_DELETE`
AFTER
    DELETE ON `purchasemapreturn` FOR EACH ROW BEGIN
UPDATE
    stock
SET
    Qty = Qty + (OLD.Qty * OLD.UnitQty),
    Weight = (OLD.Weight * OLD.UnitQty)
WHERE
    ItemID_id = OLD.ItemID_id
    AND SectorID_id = (
        SELECT
            SectorID_id
        FROM
            purchase
        WHERE
            id = OLD.PurchaseNo_id
    );

END