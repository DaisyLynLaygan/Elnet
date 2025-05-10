@echo off
echo Fixing EventParticipant relationships...
sqlcmd -S (localdb)\mssqllocaldb -d HomeOwnerContext-62e5969a-7f62-421f-8ff5-4fad4059ba16 -i SQL\fix_eventparticipant_relations.sql
echo.
echo Operation completed. Press any key to exit.
pause > nul 