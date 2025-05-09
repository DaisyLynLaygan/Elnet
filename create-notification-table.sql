-- Direct SQL script to create the Notification table
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Notification')
BEGIN
    PRINT 'Creating Notification table...';
    
    CREATE TABLE [Notification] (
        [notification_id] INT NOT NULL IDENTITY(1,1),
        [user_id] INT NOT NULL,
        [title] NVARCHAR(MAX) NOT NULL,
        [message] NVARCHAR(MAX) NOT NULL,
        [created_date] DATETIME2 NOT NULL,
        [is_read] BIT NOT NULL DEFAULT 0,
        [type] NVARCHAR(50) NOT NULL,
        [reference_id] NVARCHAR(50) NULL,
        CONSTRAINT [PK_Notification] PRIMARY KEY ([notification_id]),
        CONSTRAINT [FK_Notification_User_user_id] FOREIGN KEY ([user_id]) REFERENCES [User] ([user_id]) ON DELETE CASCADE
    );
    
    PRINT 'Notification table created successfully.';
    
    -- Insert some sample notifications
    PRINT 'Adding sample notifications...';
    
    -- Get the first user from the User table
    DECLARE @firstUserId INT;
    SELECT TOP 1 @firstUserId = [user_id] FROM [User] ORDER BY [user_id];
    
    IF @firstUserId IS NOT NULL
    BEGIN
        -- Service request notifications for the first available user
        INSERT INTO [Notification] ([user_id], [title], [message], [created_date], [is_read], [type], [reference_id])
        VALUES 
        (@firstUserId, 'Service Request Approved', 'Your service request for plumbing repairs has been approved.', GETDATE(), 0, 'service_request', '1'),
        (@firstUserId, 'Service Request Completed', 'Your service request for electrical repairs has been completed. Please provide feedback.', DATEADD(HOUR, -3, GETDATE()), 0, 'service_request', '2'),
        (@firstUserId, 'Payment Confirmation', 'Your payment of $75.00 for the lawn maintenance service has been received.', DATEADD(DAY, -1, GETDATE()), 0, 'payment', '101'),
        (@firstUserId, 'Community Announcement', 'The community pool will be closed for maintenance this weekend.', DATEADD(DAY, -2, GETDATE()), 1, 'announcement', 'A1');
        
        PRINT 'Sample notifications inserted for user ID: ' + CAST(@firstUserId AS VARCHAR);
    END
    ELSE
    BEGIN
        PRINT 'No users found in the User table. Please create a user first.';
    END
END
ELSE
BEGIN
    PRINT 'The Notification table already exists.';
END 