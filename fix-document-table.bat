@echo off
echo Fixing Document table structure...
sqlcmd -S "(localdb)\mssqllocaldb" -d "HomeOwnerContext-62e5969a-7f62-421f-8ff5-4fad4059ba16" -i fix-document-table.sql
echo SQL script execution completed. 