CREATE DEFINER=`root`@`localhost` EVENT `COUNTER_SHUFFLE`
	ON SCHEDULE
		EVERY 1 DAY STARTS '2023-02-28'
	ON COMPLETION NOT PRESERVE
	ENABLE
	COMMENT ''
	DO UPDATE counters AS t1
INNER JOIN (
  SELECT SectorID_id, GROUP_CONCAT(StaffID_id ORDER BY RAND() SEPARATOR '-') AS shuffled_bets
  FROM (
    SELECT SectorID_id, StaffID_id
    FROM counters
    WHERE No != 1 AND StaffID_id IS NOT NULL
  ) AS temp
  GROUP BY SectorID_id
) AS t2
ON t1.SectorID_id = t2.SectorID_id
SET t1.StaffID_id = 
  CASE 
    WHEN t2.shuffled_bets IS NOT NULL THEN 
      SUBSTRING_INDEX(SUBSTRING_INDEX(t2.shuffled_bets, '-', t1.No - 1), '-', -1)
    ELSE t1.StaffID_id
  END
WHERE t1.No != 1
AND t1.StaffID_id IS NOT NULL