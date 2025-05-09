IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[ServiceRequest]') AND name = 'staffNotes')
BEGIN
    ALTER TABLE [ServiceRequest] ADD [staffNotes] nvarchar(max) NOT NULL DEFAULT ''
    PRINT 'Column [staffNotes] added to [ServiceRequest] table.'
END
ELSE
BEGIN
    PRINT 'Column [staffNotes] already exists in [ServiceRequest] table.'
END 