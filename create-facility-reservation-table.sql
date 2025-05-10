-- Direct SQL script to create/update the FacilityReservation table
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'FacilityReservation')
BEGIN
    PRINT 'Creating FacilityReservation table...';
    
    CREATE TABLE [FacilityReservation] (
        [reservation_id] INT NOT NULL IDENTITY(1,1),
        [user_id] INT NOT NULL,
        [facility_id] INT NOT NULL,
        [reservation_date] DATETIME2 NOT NULL,
        [reservation_time] NVARCHAR(MAX) NOT NULL,
        [duration_hours] INT NOT NULL,
        [guest_count] INT NOT NULL,
        [purpose] NVARCHAR(MAX) NOT NULL,
        [price] DECIMAL(18,2) NOT NULL,
        [status] NVARCHAR(MAX) NOT NULL,
        [payment_status] NVARCHAR(MAX) NOT NULL,
        [date_created] DATETIME2 NOT NULL,
        [staff_notes] NVARCHAR(MAX) NULL,
        CONSTRAINT [PK_FacilityReservation] PRIMARY KEY ([reservation_id]),
        CONSTRAINT [FK_FacilityReservation_User_user_id] FOREIGN KEY ([user_id]) REFERENCES [User] ([user_id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_FacilityReservation_Facility_facility_id] FOREIGN KEY ([facility_id]) REFERENCES [Facility] ([facility_id]) ON DELETE NO ACTION
    );
    
    PRINT 'FacilityReservation table created successfully.';
END
ELSE
BEGIN
    PRINT 'FacilityReservation table already exists. Updating schema if needed...';
    
    -- Check if the staff_notes column exists; if not, add it
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'FacilityReservation' AND COLUMN_NAME = 'staff_notes')
    BEGIN
        ALTER TABLE [FacilityReservation] ADD [staff_notes] NVARCHAR(MAX) NULL;
        PRINT 'Added staff_notes column.';
    END
    
    -- Check if date_created column exists; if not, add it and rename created_date if it exists
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'FacilityReservation' AND COLUMN_NAME = 'date_created')
    BEGIN
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'FacilityReservation' AND COLUMN_NAME = 'created_date')
        BEGIN
            EXEC sp_rename 'FacilityReservation.created_date', 'date_created', 'COLUMN';
            PRINT 'Renamed created_date to date_created.';
        END
        ELSE
        BEGIN
            ALTER TABLE [FacilityReservation] ADD [date_created] DATETIME2 NOT NULL DEFAULT GETDATE();
            PRINT 'Added date_created column.';
        END
    END
    
    -- Check if price column exists; if not, add it and rename total_amount if it exists
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'FacilityReservation' AND COLUMN_NAME = 'price')
    BEGIN
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'FacilityReservation' AND COLUMN_NAME = 'total_amount')
        BEGIN
            EXEC sp_rename 'FacilityReservation.total_amount', 'price', 'COLUMN';
            PRINT 'Renamed total_amount to price.';
        END
        ELSE
        BEGIN
            ALTER TABLE [FacilityReservation] ADD [price] DECIMAL(18,2) NOT NULL DEFAULT 0;
            PRINT 'Added price column.';
        END
    END
    
    -- Remove updated_date column if it exists
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'FacilityReservation' AND COLUMN_NAME = 'updated_date')
    BEGIN
        -- SQL Server doesn't allow dropping columns directly in IF statements, so we use dynamic SQL
        DECLARE @sql NVARCHAR(MAX) = N'ALTER TABLE [FacilityReservation] DROP COLUMN [updated_date]';
        EXEC sp_executesql @sql;
        PRINT 'Removed updated_date column.';
    END
    
    -- Remove notes column if it exists
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'FacilityReservation' AND COLUMN_NAME = 'notes')
    BEGIN
        -- SQL Server doesn't allow dropping columns directly in IF statements, so we use dynamic SQL
        DECLARE @sql2 NVARCHAR(MAX) = N'ALTER TABLE [FacilityReservation] DROP COLUMN [notes]';
        EXEC sp_executesql @sql2;
        PRINT 'Removed notes column.';
    END
    
    PRINT 'FacilityReservation table updated successfully.';
END 