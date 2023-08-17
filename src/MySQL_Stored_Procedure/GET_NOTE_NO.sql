CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_NOTE_NO`(
	IN `NoteType` VARCHAR(5),
	IN `SectorNo` INT,
	OUT `GetNoteNo` VARCHAR(255)
)
LANGUAGE SQL
NOT DETERMINISTIC
CONTAINS SQL
SQL SECURITY DEFINER
COMMENT ''
BEGIN
DECLARE Sector VARCHAR(9);

SET Sector = CONCAT(NoteType, SUBSTR(CONCAT(RPAD('0', 3, 0),SectorNo),-3,3));

SELECT MAX(SUBSTR(Note.NoteNo,3,14)) INTO GetNoteNo FROM Note INNER JOIN sectors ON Note.SectorID_id = sectors.id WHERE sectors.SLNo = SectorNo;
      IF GetNoteNo IS NULL THEN
        BEGIN
          SELECT concat(concat(Sector, date_format(curdate(), '%y%m%d')), '0001') INTO GetNoteNo FROM Dual;
        END;
      ELSE
        BEGIN
          IF SUBSTR(GetNoteNo,1,9) = concat(SUBSTR(Sector,3,5), date_format(curdate(), '%y%m%d')) THEN
              SELECT CONCAT(CONCAT(SUBSTR(Sector,1,2), SUBSTR(GetNoteNo,1,9)),  SUBSTR(CONCAT(RPAD('0', 4, 0), CAST(MAX(SUBSTR(CONCAT(SUBSTR(Sector,1,2), GetNoteNo),11,15))+1 AS CHAR(30) )),-4,4)) INTO GetNoteNo FROM Note INNER JOIN sectors ON Note.SectorID_id = sectors.id WHERE sectors.SLNo = SectorNo; 
          ELSE 
            SET GetNoteNo ='000000000000000'; 
            SELECT CONCAT(CONCAT(Sector, date_format(curdate(), '%y%m%d')), SUBSTR(CONCAT(RPAD('0', 4, 0),CAST(MAX(SUBSTR(SUBSTR(Sector,1,2) || GetNoteNo,11,15))+1 AS CHAR(20))),-4,4)) INTO GetNoteNo FROM Note INNER JOIN sectors ON Note.SectorID_id = sectors.id WHERE sectors.SLNo = SectorNo;
          END IF;
        END;
      END IF;
END