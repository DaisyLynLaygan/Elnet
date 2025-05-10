@echo off
echo ===== WARNING: This will DELETE ALL existing Event data! =====
echo This script will drop and recreate the Event and EventParticipant tables.
echo Any existing data in these tables will be permanently deleted.
echo Event images in the wwwroot/uploads/events folder will also be deleted.
echo.
set /p continue="Do you want to continue? (Y/N): "

if /i "%continue%" NEQ "Y" (
    echo Operation cancelled.
    goto :end
)

echo.
echo ===== Dropping and recreating Event tables =====
echo.

sqlcmd -S "(localdb)\mssqllocaldb" -d "HomeOwnerContext-62e5969a-7f62-421f-8ff5-4fad4059ba16" -i SQL\CreateEventTables.sql

echo.
echo ===== Setting up event uploads directory =====

:: Check if uploads directory exists, create if not
if not exist "wwwroot\uploads" (
    mkdir "wwwroot\uploads"
    echo Created wwwroot\uploads directory.
)

:: Check if events directory exists
if not exist "wwwroot\uploads\events" (
    mkdir "wwwroot\uploads\events"
    echo Created wwwroot\uploads\events directory.
) else (
    :: Clear existing event images
    del /Q "wwwroot\uploads\events\*.*"
    echo Cleared existing event images.
)

echo.
echo ===== Script execution complete =====
echo Event tables have been reset. No sample data has been inserted.
echo Event uploads directory is ready at wwwroot\uploads\events
echo.

:end
pause 