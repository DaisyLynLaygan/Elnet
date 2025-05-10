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
DELETE FROM [Facility];
DELETE FROM [Announcement];
DELETE FROM [User]; -- User is a reserved keyword in SQL, so using square brackets

PRINT 'All data has been deleted from tables without dropping the tables.'; 