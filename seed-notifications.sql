-- Insert some sample notifications
-- Replace user_id values with actual user IDs from your database if needed

-- Check if the user with ID 1 exists
IF EXISTS (SELECT 1 FROM [User] WHERE [user_id] = 1)
BEGIN
    -- Service request notifications
    INSERT INTO [Notification] ([user_id], [title], [message], [created_date], [is_read], [type], [reference_id])
    VALUES 
    (1, 'Service Request Approved', 'Your service request for plumbing repairs has been approved.', GETDATE(), 0, 'service_request', '1'),
    (1, 'Service Request Completed', 'Your service request for electrical repairs has been completed. Please provide feedback.', DATEADD(HOUR, -3, GETDATE()), 0, 'service_request', '2'),
    (1, 'Payment Confirmation', 'Your payment of $75.00 for the lawn maintenance service has been received.', DATEADD(DAY, -1, GETDATE()), 0, 'payment', '101'),
    (1, 'Community Announcement', 'The community pool will be closed for maintenance this weekend.', DATEADD(DAY, -2, GETDATE()), 1, 'announcement', 'A1');
    
    PRINT 'Sample notifications inserted successfully.';
END
ELSE
BEGIN
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

-- Add notifications for other users if needed
-- INSERT INTO [Notification] ([user_id], [title], [message], [created_date], [is_read], [type], [reference_id])
-- VALUES (2, 'Service Request Update', 'Your service request is scheduled for tomorrow.', GETDATE(), 0, 'service_request', '3'); 