@echo off
echo ELNET DATABASE RESET AND FIX TOOL
echo =================================
echo.
echo This tool will:
echo 1. Delete all migrations and drop the database
echo 2. Create new migrations and database
echo 3. Fix missing columns in tables
echo 4. Seed facility data
echo.
echo IMPORTANT: Make sure your application is not running!
echo.
pause

echo.
echo Step 1: Deleting migrations and dropping database...
call delete_migrations.bat

echo.
echo Step 2: Creating new migrations and database...
call generate_models.bat

echo.
echo Step 3: Fixing missing columns in tables...
call fix_serviceRequest.bat

echo.
echo Step 4: Seeding facility data...
call seeder.bat

echo.
echo ALL DONE! Your database has been reset and fixed.
echo You can now run your application.
echo.
pause