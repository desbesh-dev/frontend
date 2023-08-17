CREATE DEFINER = `root` @`localhost` TRIGGER `STOCK_UPDATE_ON_PURCHASE_RETURN`
AFTER
INSERT
    ON `purchasemapreturn` FOR EACH ROW BEGIN
UPDATE
    stock
SET
    Qty = Qty - (NEW.Qty * NEW.UnitQty),
    Weight = Weight - (NEW.Weight * NEW.UnitQty)
WHERE
    ItemID_id = NEW.ItemID_id
    AND SectorID_id = (
        SELECT
            SectorID_id
        FROM
            purchase
        WHERE
            id = NEW.PurchaseNo_id
    );

END