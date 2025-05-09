@echo off
echo Running SQL script to seed notifications...
sqlcmd -S "(localdb)\mssqllocaldb" -d "HomeOwnerContext-62e5969a-7f62-421f-8ff5-4fad4059ba16" -i seed-notifications.sql
echo SQL script execution completed.
pause 