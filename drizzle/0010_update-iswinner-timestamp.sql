-- Custom SQL migration file, put your code below! --
CREATE OR REPLACE FUNCTION update_changetimestamp_column()
RETURNS TRIGGER AS $$
BEGIN
   IF NEW."isWinner" THEN
     NEW."isWinnerLastUpdate" = now(); 
   ELSE 
     NEW."isWinnerLastUpdate" = null;
   END IF;
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER updateTimestampOnIsWinner BEFORE UPDATE
    ON "aposcar_nominations" FOR EACH ROW EXECUTE PROCEDURE 
    update_changetimestamp_column();