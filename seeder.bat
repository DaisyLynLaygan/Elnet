@echo off
echo Seeding data to the database...

sqlcmd -E -S "(localdb)\MSSQLLocalDB" -Q "IF EXISTS (SELECT name FROM sys.databases WHERE name = 'HomeOwnerContext-62e5969a-7f62-421f-8ff5-4fad4059ba16') BEGIN USE [HomeOwnerContext-62e5969a-7f62-421f-8ff5-4fad4059ba16]; IF NOT EXISTS (SELECT TOP 1 * FROM [Facility]) BEGIN INSERT INTO [Facility] ([name], [description], [image_path], [overall_rating], [review_count], [cleanliness_rating], [equipment_rating], [staff_rating], [value_rating]) VALUES ('Function Hall', 'A spacious hall perfect for events and gatherings', '/images/function-hall.jpg', 4.8, 124, 4.6, 4.4, 4.5, 4.3), ('Sports Court', 'Multi-purpose sports court for basketball and other activities', '/images/sports-court.jpg', 4.6, 87, 4.5, 4.3, 4.4, 4.7), ('Swimming Pool', 'Olympic-sized swimming pool with lifeguards', '/images/swimming-pool.jpg', 4.9, 156, 4.8, 4.7, 4.9, 4.8), ('Gym Facility', 'Fully equipped gym with modern exercise equipment', '/images/gym.jpg', 4.7, 203, 4.6, 4.8, 4.7, 4.5); END; END"

echo Facility data seeded successfully!
pause 