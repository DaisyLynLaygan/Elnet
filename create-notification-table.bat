@echo off
echo Creating Notification table...
sqlcmd -S "(localdb)\mssqllocaldb" -d "HomeOwnerContext-62e5969a-7f62-421f-8ff5-4fad4059ba16" -i create-notification-table.sql
echo Script execution completed.
pause 