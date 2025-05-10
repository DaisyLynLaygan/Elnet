@echo off
echo Creating new migration and database...

rem Add a new migration called InitialCreate with specific context
echo Adding new migration...
dotnet ef migrations add InitialCreate --context HomeOwnerContext

rem Update the database with the new migration
echo Updating database...
dotnet ef database update --context HomeOwnerContext

echo Database creation completed!

rem Add admin user to the database
echo Adding admin user...
sqlcmd -E -S "(localdb)\MSSQLLocalDB" -Q "IF EXISTS (SELECT name FROM sys.databases WHERE name = 'HomeOwnerContext-62e5969a-7f62-421f-8ff5-4fad4059ba16') BEGIN INSERT INTO [HomeOwnerContext-62e5969a-7f62-421f-8ff5-4fad4059ba16].[dbo].[User] ([username], [firstname], [lastname], [user_password], [email], [role], [status]) VALUES ('admin-Edem', 'Admin', 'User', 'kimperor', 'admin@example.com', 'admin', 'active'); END"

echo All tasks completed successfully!
pause 