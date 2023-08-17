CREATE DEFINER=`root`@`localhost` TRIGGER `PURCHASE_PRICE_SYNC_WITH_STOCK` AFTER UPDATE ON `stock` FOR EACH ROW BEGIN
 IF NEW.Cost <> OLD.Cost THEN
    UPDATE packagepricing SET PurchasePrice=NEW.Cost WHERE SectorID_id=NEW.SectorID_id AND ItemID_id=NEW.ItemID_id;
  END IF;
END