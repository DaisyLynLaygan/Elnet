@echo off
echo Running script to delete all data and add admin user...

sqlcmd -S "(localdb)\mssqllocaldb" -d "HomeOwnerContext-62e5969a-7f62-421f-8ff5-4fad4059ba16" -i DeleteAllDataAndAddAdmin.sql

echo Done.
pause 