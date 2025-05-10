-- Delete data in the correct order to handle foreign key constraints

-- First delete from tables with foreign keys to other tables
DELETE FROM [EventParticipant];
DELETE FROM [Comment];
DELETE FROM [Post];
DELETE FROM [Report];
DELETE FROM [ServiceRequest];
DELETE FROM [Notification];
DELETE FROM [FacilityReservation];
DELETE FROM [RentPayment];
DELETE FROM [Document];
DELETE FROM [Feedback];
DELETE FROM [Event];

-- Then delete from tables that others reference
DELETE FROM [Announcement];
DELETE FROM [User]; -- User is a reserved keyword in SQL, so using square brackets

PRINT 'All data has been deleted from tables without dropping the tables.';

-- Now add the admin user
INSERT INTO [User] (
    [username],
    [firstname],
    [lastname],
    [user_password],
    [email],
    [role],
    [status],
    [date_created]
)
VALUES (
    'admin',         -- username
    'Admin',              -- firstname
    'User',               -- lastname
    'admin123',           -- password
    'admin@example.com',  -- email
    'admin',              -- role
    'active',             -- status
    CAST(GETDATE() AS DATE)  -- date_created (as DateOnly)
);

PRINT 'Admin user has been added successfully.';

-- Reset and add required Facility records
-- Enable IDENTITY_INSERT to explicitly set IDs
SET IDENTITY_INSERT [Facility] ON;

-- Create facilities if they don't exist
IF NOT EXISTS (SELECT 1 FROM Facility WHERE facility_id = 1)
BEGIN
    INSERT INTO [Facility] (facility_id, name, description, image_path, overall_rating, cleanliness_rating, equipment_rating, staff_rating, value_rating, review_count)
    VALUES (1, 'Function Hall', 'Elegant event space perfect for weddings, conferences, and celebrations with capacity up to 500 guests.', '/images/function-hall.jpg', 0, 0, 0, 0, 0, 0);
END

IF NOT EXISTS (SELECT 1 FROM Facility WHERE facility_id = 2)
BEGIN
    INSERT INTO [Facility] (facility_id, name, description, image_path, overall_rating, cleanliness_rating, equipment_rating, staff_rating, value_rating, review_count)
    VALUES (2, 'Sport Court', 'Professional-grade court suitable for basketball, volleyball, badminton, and other indoor sports.', '/images/sports-court.jpg', 0, 0, 0, 0, 0, 0);
END

IF NOT EXISTS (SELECT 1 FROM Facility WHERE facility_id = 3)
BEGIN
    INSERT INTO [Facility] (facility_id, name, description, image_path, overall_rating, cleanliness_rating, equipment_rating, staff_rating, value_rating, review_count)
    VALUES (3, 'Swimming Pool', '50-meter competition pool with diving boards, lap lanes, and separate children''s wading area.', '/images/swimming-pool.jpg', 0, 0, 0, 0, 0, 0);
END

IF NOT EXISTS (SELECT 1 FROM Facility WHERE facility_id = 4)
BEGIN
    INSERT INTO [Facility] (facility_id, name, description, image_path, overall_rating, cleanliness_rating, equipment_rating, staff_rating, value_rating, review_count)
    VALUES (4, 'Fitness Gym', 'Fully equipped fitness center with cardio machines, free weights, and group exercise studios.', '/images/gym.jpg', 0, 0, 0, 0, 0, 0);
END

-- Turn off IDENTITY_INSERT when done
SET IDENTITY_INSERT [Facility] OFF;

PRINT 'Facility records have been created/updated.'; 