@echo off
echo Running script to add facility records...

sqlcmd -S "(localdb)\mssqllocaldb" -d "HomeOwnerContext-62e5969a-7f62-421f-8ff5-4fad4059ba16" -i CreateFacilities.sql

echo Done.
pause 