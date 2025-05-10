@echo off
echo Creating/Updating FacilityReservation table...
sqlcmd -S "(localdb)\mssqllocaldb" -d "HomeOwnerContext-62e5969a-7f62-421f-8ff5-4fad4059ba16" -i create-facility-reservation-table.sql
echo Script execution completed.
pause 