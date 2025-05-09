-- Check if the Notification table exists
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Notification')
BEGIN
    PRINT 'The Notification table exists.';
    
    -- Print the table structure
    PRINT 'Notification table columns:';
    SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'Notification';
    
    -- Check if there are any records
    DECLARE @count INT;
    SELECT @count = COUNT(*) FROM Notification;
    PRINT 'Number of records in Notification table: ' + CAST(@count AS VARCHAR);
END
ELSE
BEGIN
    PRINT 'The Notification table does NOT exist.';
END

-- List all tables in the database
PRINT 'All tables in the database:';
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'; 