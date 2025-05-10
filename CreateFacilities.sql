-- Check if the Facility table exists
IF OBJECT_ID('Facility', 'U') IS NOT NULL
BEGIN
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
    
    PRINT 'Required facilities have been added to the database.';
END
ELSE
BEGIN
    PRINT 'Facility table not found. Please run database migration first.';
END 