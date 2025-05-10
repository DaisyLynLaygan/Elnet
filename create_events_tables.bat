@echo off
echo ===== Creating Event and EventParticipant tables =====

REM Get connection information from user
set /p server="Enter SQL Server name (e.g. localhost\SQLEXPRESS): "
set /p database="Enter database name: "
set /p username="Enter SQL username (press Enter to use Windows authentication): "

if "%username%"=="" (
    REM Using Windows Authentication
    echo Using Windows Authentication to connect to %server% and database %database%
    sqlcmd -S %server% -d %database% -i "SQL\CreateEventTables.sql" -E
) else (
    REM Using SQL Authentication
    set /p password="Enter SQL password: "
    echo Using SQL Authentication with username %username% to connect to %server% and database %database%
    sqlcmd -S %server% -d %database% -U %username% -P %password% -i "SQL\CreateEventTables.sql"
)

echo.
echo ===== Script execution complete =====
echo.

pause 