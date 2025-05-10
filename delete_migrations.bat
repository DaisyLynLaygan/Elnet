@echo off
echo Deleting migration files...

rem Delete migrations in the Migrations folder
if exist Migrations (
    echo Deleting files in Migrations folder...
    del /q Migrations\*.cs
    rd /s /q Migrations
)

rem Delete migrations in the Data/Migrations folder
if exist Data\Migrations (
    echo Deleting files in Data\Migrations folder...
    del /q Data\Migrations\*.cs
    rd /s /q Data\Migrations
)

rem Create new Migrations directory
mkdir Migrations
mkdir Data\Migrations

echo Migration files deleted successfully!

rem Drop the database using sqlcmd
echo Dropping the existing database...
sqlcmd -E -S "(localdb)\MSSQLLocalDB" -Q "DROP DATABASE IF EXISTS [HomeOwnerContext-62e5969a-7f62-421f-8ff5-4fad4059ba16];"

echo All tasks completed! Now run:
echo 1. dotnet ef migrations add InitialCreate
echo 2. dotnet ef database update
echo.
pause 