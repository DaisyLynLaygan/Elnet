-- Clear existing data if tables exist
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'EventParticipant')
BEGIN
    DELETE FROM [EventParticipant];
    PRINT 'All data cleared from EventParticipant table.';
END

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Event')
BEGIN
    DELETE FROM [Event];
    PRINT 'All data cleared from Event table.';
END

-- Drop and recreate EventParticipant table if it exists
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'EventParticipant')
BEGIN
    DROP TABLE [EventParticipant];
    PRINT 'EventParticipant table dropped.';
END

-- Drop and recreate Event table if it exists
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Event')
BEGIN
    DROP TABLE [Event];
    PRINT 'Event table dropped.';
END

-- Create Event table
CREATE TABLE [Event] (
    [event_id] INT IDENTITY(1,1) PRIMARY KEY,
    [title] NVARCHAR(255) NOT NULL,
    [event_date] DATETIME NOT NULL,
    [start_time] NVARCHAR(10) NOT NULL,
    [end_time] NVARCHAR(10) NOT NULL,
    [location] NVARCHAR(255) NOT NULL,
    [description] NVARCHAR(MAX) NULL,
    [organizer] NVARCHAR(255) NULL,
    [contact_email] NVARCHAR(255) NULL,
    [capacity] INT NOT NULL,
    [rsvp_count] INT NOT NULL DEFAULT 0,
    [image_url] NVARCHAR(MAX) NULL,
    [is_featured] BIT NOT NULL DEFAULT 0,
    [tags] NVARCHAR(255) NULL,
    [created_at] DATETIME NOT NULL DEFAULT GETDATE(),
    [updated_at] DATETIME NULL
);

PRINT 'Event table created successfully.';

-- Create EventParticipant table
CREATE TABLE [EventParticipant] (
    [participant_id] INT IDENTITY(1,1) PRIMARY KEY,
    [event_id] INT NOT NULL,
    [user_id] INT NOT NULL,
    [participant_type] NVARCHAR(50) NOT NULL,
    [registered_at] DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [FK_EventParticipant_Event] FOREIGN KEY ([event_id]) REFERENCES [Event]([event_id]) ON DELETE CASCADE,
    CONSTRAINT [FK_EventParticipant_User] FOREIGN KEY ([user_id]) REFERENCES [User]([user_id]) ON DELETE CASCADE
);

PRINT 'EventParticipant table created successfully.';
PRINT 'Setup complete. No sample data has been inserted.' 