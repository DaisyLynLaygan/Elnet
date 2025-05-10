@echo off
echo Running database reset script...

REM Use SQL Server Express LocalDB
set server_name=(localdb)\MSSQLLocalDB
set database_name=HomeOwnerContext-62e5969a-7f62-421f-8ff5-4fad4059ba16

REM Run the SQL script using sqlcmd with Windows Authentication
sqlcmd -S %server_name% -d %database_name% -E -i create_tables.sql

echo.
if %ERRORLEVEL% == 0 (
    echo Database reset completed successfully!
) else (
    echo Error occurred while resetting database. Check the error message above.
)

echo.
pause 