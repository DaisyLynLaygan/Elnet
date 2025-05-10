@echo off
echo Deleting all data from database tables without dropping them...

REM Create a temporary SQL file
echo -- Delete data in the correct order to handle foreign key constraints > delete_data.sql
echo. >> delete_data.sql
echo -- First delete from tables with foreign keys to other tables >> delete_data.sql
echo DELETE FROM EventParticipant; >> delete_data.sql
echo DELETE FROM Comment; >> delete_data.sql
echo DELETE FROM Post; >> delete_data.sql
echo DELETE FROM Report; >> delete_data.sql
echo DELETE FROM ServiceRequest; >> delete_data.sql
echo DELETE FROM Notification; >> delete_data.sql
echo DELETE FROM FacilityReservation; >> delete_data.sql
echo DELETE FROM RentPayment; >> delete_data.sql
echo DELETE FROM Document; >> delete_data.sql
echo DELETE FROM Feedback; >> delete_data.sql
echo DELETE FROM Event; >> delete_data.sql
echo. >> delete_data.sql
echo -- Then delete from tables that others reference >> delete_data.sql
echo DELETE FROM Facility; >> delete_data.sql
echo DELETE FROM Announcement; >> delete_data.sql
echo DELETE FROM User; >> delete_data.sql
echo. >> delete_data.sql
echo PRINT 'All data has been deleted from tables without dropping the tables.'; >> delete_data.sql

REM Execute the SQL file
sqlcmd -S "(localdb)\mssqllocaldb" -d "HomeOwnerContext-62e5969a-7f62-421f-8ff5-4fad4059ba16" -i delete_data.sql

REM Delete the temporary file
del delete_data.sql

echo Done.
pause 