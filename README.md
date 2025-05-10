# Document Management System - Database Setup

This project includes a document management system with role-based visibility controls. To set up the required database tables, follow these steps:

## Setting Up Database Tables Directly with SQL

1. Edit the `run_sql_script.bat` file to match your SQL Server configuration:
   - Update the `server` value (e.g., `localhost\SQLEXPRESS`)
   - Update the `database` name (default is `HomeOwner`)
   - Update the `username` and `password` for your SQL Server

2. Run the `run_sql_script.bat` file by double-clicking it or running it from a command prompt.

3. The script will create the following tables:
   - `DocumentFolder` - For organizing documents in folders
   - `Document` - For storing document metadata
   - `DocumentAccessLog` - For tracking document access history

4. Create the required directory for document storage:
   ```
   wwwroot/uploads/documents
   ```

## Alternative Setup Using SQL Server Management Studio

If you prefer to use SQL Server Management Studio:

1. Open SQL Server Management Studio and connect to your database server
2. Open the `create_document_tables.sql` file
3. Execute the script against your database

## Troubleshooting

If you encounter the error "Invalid object name 'Document'" when accessing the application, it means the Document tables haven't been created in the database. Run the SQL script to create them.

## Document System Features

- **Role-based visibility**: Documents can be set as visible to admin, staff, or homeowner
- **Access logging**: All document views and downloads are tracked
- **Folder organization**: Documents can be organized in folders
- **Security settings**: Control if documents can be downloaded or require watermarks
- **Access stats**: View detailed statistics about document access

## Database Relationships

- Documents belong to a User (uploader)
- Documents can belong to a Folder
- Folders can have a parent Folder
- Access logs track which User accessed which Document 