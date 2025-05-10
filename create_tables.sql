-- SQL Script to drop and recreate all tables with proper relationships
-- Use this to reset the database structure if you're having foreign key issues

-- Disable foreign key constraints first
EXEC sp_MSforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT all"

-- Drop all constraints first
DECLARE @sql NVARCHAR(MAX) = N'';

-- Generate DROP CONSTRAINT statements for all foreign keys
SELECT @sql += N'
ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id)) + '.' + QUOTENAME(OBJECT_NAME(parent_object_id)) + 
' DROP CONSTRAINT ' + QUOTENAME(name) + ';'
FROM sys.foreign_keys;

-- Execute the DROP CONSTRAINT statements
EXEC sp_executesql @sql;

-- Now drop all tables in the correct order
IF OBJECT_ID('dbo.[EventParticipant]', 'U') IS NOT NULL DROP TABLE dbo.[EventParticipant];
IF OBJECT_ID('dbo.[Event]', 'U') IS NOT NULL DROP TABLE dbo.[Event];
IF OBJECT_ID('dbo.[Feedback]', 'U') IS NOT NULL DROP TABLE dbo.[Feedback];
IF OBJECT_ID('dbo.[Comment]', 'U') IS NOT NULL DROP TABLE dbo.[Comment];
IF OBJECT_ID('dbo.[Post]', 'U') IS NOT NULL DROP TABLE dbo.[Post];
IF OBJECT_ID('dbo.[Report]', 'U') IS NOT NULL DROP TABLE dbo.[Report];
IF OBJECT_ID('dbo.[FacilityReservation]', 'U') IS NOT NULL DROP TABLE dbo.[FacilityReservation];
IF OBJECT_ID('dbo.[Facility]', 'U') IS NOT NULL DROP TABLE dbo.[Facility];
IF OBJECT_ID('dbo.[ServiceRequest]', 'U') IS NOT NULL DROP TABLE dbo.[ServiceRequest];
IF OBJECT_ID('dbo.[Document]', 'U') IS NOT NULL DROP TABLE dbo.[Document];
IF OBJECT_ID('dbo.[Notification]', 'U') IS NOT NULL DROP TABLE dbo.[Notification];
IF OBJECT_ID('dbo.[RentPayment]', 'U') IS NOT NULL DROP TABLE dbo.[RentPayment];
IF OBJECT_ID('dbo.[Announcement]', 'U') IS NOT NULL DROP TABLE dbo.[Announcement];
IF OBJECT_ID('dbo.[User]', 'U') IS NOT NULL DROP TABLE dbo.[User];

-- Now recreate tables in the correct order (parent tables first)

-- User table
CREATE TABLE dbo.[User] (
    [user_id] INT PRIMARY KEY IDENTITY(1,1),
    [username] NVARCHAR(100) NOT NULL,
    [firstname] NVARCHAR(100) NULL,
    [lastname] NVARCHAR(100) NULL,
    [user_password] NVARCHAR(255) NULL,
    [email] NVARCHAR(255) NULL,
    [address] NVARCHAR(255) NULL,
    [role] NVARCHAR(50) NULL,
    [contact_no] NVARCHAR(50) NULL,
    [status] NVARCHAR(50) NULL,
    [date_created] DATE NULL
);

-- Announcement table
CREATE TABLE dbo.[Announcement] (
    [announcement_id] INT PRIMARY KEY IDENTITY(1,1),
    [title] NVARCHAR(200) NOT NULL,
    [content] NVARCHAR(MAX) NOT NULL,
    [date_posted] DATETIME2 NOT NULL,
    [is_active] BIT NOT NULL DEFAULT 1
);

-- Facility table
CREATE TABLE dbo.[Facility] (
    [facility_id] INT PRIMARY KEY IDENTITY(1,1),
    [name] NVARCHAR(100) NOT NULL,
    [description] NVARCHAR(MAX) NULL,
    [image_path] NVARCHAR(255) NULL,
    [overall_rating] DECIMAL(3,1) DEFAULT 0.0,
    [review_count] INT DEFAULT 0,
    [cleanliness_rating] DECIMAL(3,1) DEFAULT 0.0,
    [equipment_rating] DECIMAL(3,1) DEFAULT 0.0,
    [staff_rating] DECIMAL(3,1) DEFAULT 0.0,
    [value_rating] DECIMAL(3,1) DEFAULT 0.0
);

-- Post table
CREATE TABLE dbo.[Post] (
    [post_id] INT PRIMARY KEY IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [title] NVARCHAR(200) NOT NULL,
    [content] NVARCHAR(MAX) NOT NULL,
    [created_date] DATETIME2 NOT NULL,
    [updated_date] DATETIME2 NULL,
    CONSTRAINT [FK_Post_User] FOREIGN KEY ([user_id]) REFERENCES dbo.[User]([user_id]) ON DELETE NO ACTION
);

-- Comment table
CREATE TABLE dbo.[Comment] (
    [comment_id] INT PRIMARY KEY IDENTITY(1,1),
    [post_id] INT NOT NULL,
    [author_id] INT NOT NULL,
    [content] NVARCHAR(MAX) NOT NULL,
    [created_date] DATETIME2 NOT NULL,
    [updated_date] DATETIME2 NULL,
    CONSTRAINT [FK_Comment_Post] FOREIGN KEY ([post_id]) REFERENCES dbo.[Post]([post_id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Comment_User] FOREIGN KEY ([author_id]) REFERENCES dbo.[User]([user_id]) ON DELETE NO ACTION
);

-- Report table
CREATE TABLE dbo.[Report] (
    [report_id] INT PRIMARY KEY IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [title] NVARCHAR(200) NOT NULL,
    [description] NVARCHAR(MAX) NOT NULL,
    [status] NVARCHAR(50) NOT NULL,
    [created_date] DATETIME2 NOT NULL,
    CONSTRAINT [FK_Report_User] FOREIGN KEY ([user_id]) REFERENCES dbo.[User]([user_id]) ON DELETE NO ACTION
);

-- Service Request table
CREATE TABLE dbo.[ServiceRequest] (
    [request_id] INT PRIMARY KEY IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [service_type] NVARCHAR(100) NOT NULL,
    [description] NVARCHAR(MAX) NOT NULL,
    [status] NVARCHAR(50) NOT NULL,
    [price] DECIMAL(10,2) NULL,
    [request_date] DATETIME2 NOT NULL,
    [scheduled_date] DATETIME2 NULL,
    [completion_date] DATETIME2 NULL,
    CONSTRAINT [FK_ServiceRequest_User] FOREIGN KEY ([user_id]) REFERENCES dbo.[User]([user_id]) ON DELETE NO ACTION
);

-- Feedback table
CREATE TABLE dbo.[Feedback] (
    [feedback_id] INT PRIMARY KEY IDENTITY(1,1),
    [facility_id] INT NOT NULL,
    [user_id] INT NOT NULL,
    [overall_rating] DECIMAL(3,1) NOT NULL,
    [cleanliness_rating] DECIMAL(3,1) NOT NULL,
    [equipment_rating] DECIMAL(3,1) NOT NULL,
    [staff_rating] DECIMAL(3,1) NOT NULL,
    [value_rating] DECIMAL(3,1) NOT NULL,
    [title] NVARCHAR(200) NOT NULL,
    [comment] NVARCHAR(MAX) NOT NULL,
    [photos] NVARCHAR(MAX) NULL,
    [created_date] DATETIME2 NOT NULL,
    [updated_date] DATETIME2 NULL,
    CONSTRAINT [FK_Feedback_User] FOREIGN KEY ([user_id]) REFERENCES dbo.[User]([user_id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Feedback_Facility] FOREIGN KEY ([facility_id]) REFERENCES dbo.[Facility]([facility_id]) ON DELETE NO ACTION
);

-- Notification table
CREATE TABLE dbo.[Notification] (
    [notification_id] INT PRIMARY KEY IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [title] NVARCHAR(200) NOT NULL,
    [message] NVARCHAR(MAX) NOT NULL,
    [is_read] BIT NOT NULL DEFAULT 0,
    [created_date] DATETIME2 NOT NULL,
    CONSTRAINT [FK_Notification_User] FOREIGN KEY ([user_id]) REFERENCES dbo.[User]([user_id]) ON DELETE CASCADE
);

-- Facility Reservation table
CREATE TABLE dbo.[FacilityReservation] (
    [reservation_id] INT PRIMARY KEY IDENTITY(1,1),
    [facility_id] INT NOT NULL,
    [user_id] INT NOT NULL,
    [reservation_date] DATETIME2 NOT NULL,
    [start_time] DATETIME2 NOT NULL,
    [end_time] DATETIME2 NOT NULL,
    [price] DECIMAL(10,2) NOT NULL,
    [status] NVARCHAR(50) NOT NULL,
    [purpose] NVARCHAR(255) NULL,
    [guests] INT NULL,
    CONSTRAINT [FK_FacilityReservation_Facility] FOREIGN KEY ([facility_id]) REFERENCES dbo.[Facility]([facility_id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_FacilityReservation_User] FOREIGN KEY ([user_id]) REFERENCES dbo.[User]([user_id]) ON DELETE NO ACTION
);

-- Rent Payment table
CREATE TABLE dbo.[RentPayment] (
    [payment_id] INT PRIMARY KEY IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [amount] DECIMAL(10,2) NOT NULL,
    [payment_date] DATETIME2 NOT NULL,
    [due_date] DATETIME2 NOT NULL,
    [status] NVARCHAR(50) NOT NULL,
    [payment_method] NVARCHAR(100) NULL,
    [reference_number] NVARCHAR(100) NULL,
    CONSTRAINT [FK_RentPayment_User] FOREIGN KEY ([user_id]) REFERENCES dbo.[User]([user_id]) ON DELETE NO ACTION
);

-- Document table
CREATE TABLE dbo.[Document] (
    [document_id] INT PRIMARY KEY IDENTITY(1,1),
    [uploader_id] INT NOT NULL,
    [title] NVARCHAR(200) NOT NULL,
    [file_path] NVARCHAR(255) NOT NULL,
    [file_type] NVARCHAR(50) NULL,
    [file_size] INT NULL,
    [upload_date] DATETIME2 NOT NULL,
    [description] NVARCHAR(MAX) NULL,
    CONSTRAINT [FK_Document_User] FOREIGN KEY ([uploader_id]) REFERENCES dbo.[User]([user_id]) ON DELETE NO ACTION
);

-- Event table
CREATE TABLE dbo.[Event] (
    [event_id] INT PRIMARY KEY IDENTITY(1,1),
    [title] NVARCHAR(200) NOT NULL,
    [description] NVARCHAR(MAX) NOT NULL,
    [event_date] DATETIME2 NOT NULL,
    [location] NVARCHAR(255) NOT NULL,
    [organizer_id] INT NOT NULL,
    [max_participants] INT NULL,
    CONSTRAINT [FK_Event_User] FOREIGN KEY ([organizer_id]) REFERENCES dbo.[User]([user_id]) ON DELETE NO ACTION
);

-- Event Participant table
CREATE TABLE dbo.[EventParticipant] (
    [participant_id] INT PRIMARY KEY IDENTITY(1,1),
    [event_id] INT NOT NULL,
    [user_id] INT NOT NULL,
    [registration_date] DATETIME2 NOT NULL,
    [status] NVARCHAR(50) NOT NULL,
    CONSTRAINT [FK_EventParticipant_Event] FOREIGN KEY ([event_id]) REFERENCES dbo.[Event]([event_id]) ON DELETE CASCADE,
    CONSTRAINT [FK_EventParticipant_User] FOREIGN KEY ([user_id]) REFERENCES dbo.[User]([user_id]) ON DELETE NO ACTION
);

-- Seed initial data (just an example for facility data)
INSERT INTO dbo.[Facility] ([name], [description], [image_path], [overall_rating], [review_count], [cleanliness_rating], [equipment_rating], [staff_rating], [value_rating])
VALUES 
('Function Hall', 'A spacious hall perfect for events and gatherings', '/images/function-hall.jpg', 4.8, 124, 4.6, 4.4, 4.5, 4.3),
('Sports Court', 'Multi-purpose sports court for basketball and other activities', '/images/sports-court.jpg', 4.6, 87, 4.5, 4.3, 4.4, 4.7),
('Swimming Pool', 'Olympic-sized swimming pool with lifeguards', '/images/swimming-pool.jpg', 4.9, 156, 4.8, 4.7, 4.9, 4.8),
('Gym Facility', 'Fully equipped gym with modern exercise equipment', '/images/gym.jpg', 4.7, 203, 4.6, 4.8, 4.7, 4.5);

-- Insert a test user to ensure relationships work
INSERT INTO dbo.[User] ([username], [firstname], [lastname], [user_password], [email], [role], [status])
VALUES ('testuser', 'Test', 'User', 'password123', 'test@example.com', 'homeowner', 'active');

-- Insert admin user
INSERT INTO dbo.[User] ([username], [firstname], [lastname], [user_password], [email], [role], [status], [date_created])
VALUES ('admin-Edem', 'Admin', 'User', 'kimperor', 'admin@example.com', 'admin', 'active', GETDATE()); 