-- Drop foreign key constraints that reference Document table
DECLARE @sql NVARCHAR(MAX) = '';
SELECT @sql = @sql + 'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id)) + '.' + QUOTENAME(OBJECT_NAME(parent_object_id)) + ' DROP CONSTRAINT ' + QUOTENAME(name) + ';'
FROM sys.foreign_keys
WHERE referenced_object_id = OBJECT_ID('Document');

EXEC sp_executesql @sql;

-- Drop existing Document table
IF OBJECT_ID('Document', 'U') IS NOT NULL
    DROP TABLE [Document];

-- Create Document table with correct schema
CREATE TABLE [Document] (
    [document_id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(255) NOT NULL,
    [file_path] NVARCHAR(MAX) NOT NULL,
    [file_type] NVARCHAR(50) NULL,
    [file_size] BIGINT NOT NULL,
    [description] NVARCHAR(MAX) NULL,
    [visibility] NVARCHAR(50) NOT NULL,
    [allow_download] BIT NOT NULL DEFAULT 1,
    [apply_watermark] BIT NOT NULL DEFAULT 0,
    [upload_date] DATETIME2 NOT NULL,
    [expiration_date] DATETIME2 NULL,
    [category] NVARCHAR(100) NULL,
    [uploader_id] INT NOT NULL,
    [download_count] INT NOT NULL DEFAULT 0,
    [view_count] INT NOT NULL DEFAULT 0,
    CONSTRAINT [PK_Document] PRIMARY KEY ([document_id]),
    CONSTRAINT [FK_Document_User_uploader_id] FOREIGN KEY ([uploader_id]) REFERENCES [User] ([user_id]) ON DELETE NO ACTION
);

-- Create index on uploader_id
CREATE INDEX [IX_Document_uploader_id] ON [Document] ([uploader_id]);

-- Create index on visibility
CREATE INDEX [IX_Document_visibility] ON [Document] ([visibility]);

-- Create index on category
CREATE INDEX [IX_Document_category] ON [Document] ([category]);

-- Create index on upload_date
CREATE INDEX [IX_Document_upload_date] ON [Document] ([upload_date]); 