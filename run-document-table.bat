@echo off
echo Running SQL script to create Document table...
sqlcmd -S "(localdb)\mssqllocaldb" -d "HomeOwner" -i create-document-table.sql
echo SQL script execution completed. 