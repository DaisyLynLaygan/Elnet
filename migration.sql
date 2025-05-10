IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [Announcement] (
    [announcement_id] int NOT NULL IDENTITY,
    [title] nvarchar(max) NOT NULL,
    [content] nvarchar(max) NULL,
    [start_date] datetime2 NULL,
    [end_date] datetime2 NULL,
    [priority] nvarchar(max) NULL,
    [status] nvarchar(max) NULL,
    [author] nvarchar(max) NULL,
    CONSTRAINT [PK_Announcement] PRIMARY KEY ([announcement_id])
);

CREATE TABLE [User] (
    [user_id] int NOT NULL IDENTITY,
    [username] nvarchar(max) NOT NULL,
    [firstname] nvarchar(max) NULL,
    [lastname] nvarchar(max) NULL,
    [user_password] nvarchar(max) NULL,
    [email] nvarchar(max) NULL,
    [address] nvarchar(max) NULL,
    [role] nvarchar(max) NULL,
    [contact_no] nvarchar(max) NULL,
    [status] nvarchar(max) NULL,
    [date_created] date NULL,
    CONSTRAINT [PK_User] PRIMARY KEY ([user_id])
);

CREATE TABLE [Post] (
    [post_id] int NOT NULL IDENTITY,
    [content] nvarchar(max) NULL,
    [created_date] datetime2 NULL,
    [updated_date] datetime2 NULL,
    [ImagePath] nvarchar(max) NULL,
    [user_id] int NULL,
    CONSTRAINT [PK_Post] PRIMARY KEY ([post_id]),
    CONSTRAINT [FK_Post_User_user_id] FOREIGN KEY ([user_id]) REFERENCES [User] ([user_id]) ON DELETE NO ACTION
);

CREATE TABLE [Report] (
    [report_id] int NOT NULL IDENTITY,
    [report_type] nvarchar(max) NULL,
    [report_facility] nvarchar(max) NULL,
    [report_severity] nvarchar(max) NULL,
    [report_description] nvarchar(max) NULL,
    [created_date] datetime2 NULL,
    [updated_date] datetime2 NULL,
    [user_id] int NULL,
    CONSTRAINT [PK_Report] PRIMARY KEY ([report_id]),
    CONSTRAINT [FK_Report_User_user_id] FOREIGN KEY ([user_id]) REFERENCES [User] ([user_id]) ON DELETE NO ACTION
);

CREATE TABLE [ServiceRequest] (
    [request_id] int NOT NULL IDENTITY,
    [user_id] int NOT NULL,
    [service_type] nvarchar(max) NOT NULL,
    [service_icon] nvarchar(max) NOT NULL,
    [price] decimal(10,2) NOT NULL,
    [frequency] nvarchar(max) NOT NULL,
    [scheduled_date] datetime2 NOT NULL,
    [scheduled_time] nvarchar(max) NOT NULL,
    [status] nvarchar(max) NOT NULL,
    [payment_status] nvarchar(max) NOT NULL,
    [notes] nvarchar(max) NOT NULL,
    [date_created] datetime2 NOT NULL,
    CONSTRAINT [PK_ServiceRequest] PRIMARY KEY ([request_id]),
    CONSTRAINT [FK_ServiceRequest_User_user_id] FOREIGN KEY ([user_id]) REFERENCES [User] ([user_id]) ON DELETE NO ACTION
);

CREATE TABLE [Comment] (
    [comment_id] int NOT NULL IDENTITY,
    [content] nvarchar(max) NULL,
    [created_date] datetime2 NULL,
    [updated_date] datetime2 NULL,
    [author_id] int NULL,
    [post_id] int NULL,
    CONSTRAINT [PK_Comment] PRIMARY KEY ([comment_id]),
    CONSTRAINT [FK_Comment_Post_post_id] FOREIGN KEY ([post_id]) REFERENCES [Post] ([post_id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Comment_User_author_id] FOREIGN KEY ([author_id]) REFERENCES [User] ([user_id]) ON DELETE NO ACTION
);

CREATE INDEX [IX_Comment_author_id] ON [Comment] ([author_id]);

CREATE INDEX [IX_Comment_post_id] ON [Comment] ([post_id]);

CREATE INDEX [IX_Post_user_id] ON [Post] ([user_id]);

CREATE INDEX [IX_Report_user_id] ON [Report] ([user_id]);

CREATE INDEX [IX_ServiceRequest_user_id] ON [ServiceRequest] ([user_id]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250429121755_AddServiceRequestTable', N'9.0.3');

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250429123351_InitialCreate', N'9.0.3');

DECLARE @var sysname;
SELECT @var = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Feedback]') AND [c].[name] = N'value_rating');
IF @var IS NOT NULL EXEC(N'ALTER TABLE [Feedback] DROP CONSTRAINT [' + @var + '];');
ALTER TABLE [Feedback] ALTER COLUMN [value_rating] decimal(3,1) NOT NULL;

DECLARE @var1 sysname;
SELECT @var1 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Feedback]') AND [c].[name] = N'staff_rating');
IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [Feedback] DROP CONSTRAINT [' + @var1 + '];');
ALTER TABLE [Feedback] ALTER COLUMN [staff_rating] decimal(3,1) NOT NULL;

DECLARE @var2 sysname;
SELECT @var2 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Feedback]') AND [c].[name] = N'overall_rating');
IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [Feedback] DROP CONSTRAINT [' + @var2 + '];');
ALTER TABLE [Feedback] ALTER COLUMN [overall_rating] decimal(3,1) NOT NULL;

DECLARE @var3 sysname;
SELECT @var3 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Feedback]') AND [c].[name] = N'equipment_rating');
IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [Feedback] DROP CONSTRAINT [' + @var3 + '];');
ALTER TABLE [Feedback] ALTER COLUMN [equipment_rating] decimal(3,1) NOT NULL;

DECLARE @var4 sysname;
SELECT @var4 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Feedback]') AND [c].[name] = N'cleanliness_rating');
IF @var4 IS NOT NULL EXEC(N'ALTER TABLE [Feedback] DROP CONSTRAINT [' + @var4 + '];');
ALTER TABLE [Feedback] ALTER COLUMN [cleanliness_rating] decimal(3,1) NOT NULL;

DECLARE @var5 sysname;
SELECT @var5 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Facility]') AND [c].[name] = N'value_rating');
IF @var5 IS NOT NULL EXEC(N'ALTER TABLE [Facility] DROP CONSTRAINT [' + @var5 + '];');
ALTER TABLE [Facility] ALTER COLUMN [value_rating] decimal(3,1) NOT NULL;

DECLARE @var6 sysname;
SELECT @var6 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Facility]') AND [c].[name] = N'staff_rating');
IF @var6 IS NOT NULL EXEC(N'ALTER TABLE [Facility] DROP CONSTRAINT [' + @var6 + '];');
ALTER TABLE [Facility] ALTER COLUMN [staff_rating] decimal(3,1) NOT NULL;

DECLARE @var7 sysname;
SELECT @var7 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Facility]') AND [c].[name] = N'overall_rating');
IF @var7 IS NOT NULL EXEC(N'ALTER TABLE [Facility] DROP CONSTRAINT [' + @var7 + '];');
ALTER TABLE [Facility] ALTER COLUMN [overall_rating] decimal(3,1) NOT NULL;

DECLARE @var8 sysname;
SELECT @var8 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Facility]') AND [c].[name] = N'equipment_rating');
IF @var8 IS NOT NULL EXEC(N'ALTER TABLE [Facility] DROP CONSTRAINT [' + @var8 + '];');
ALTER TABLE [Facility] ALTER COLUMN [equipment_rating] decimal(3,1) NOT NULL;

DECLARE @var9 sysname;
SELECT @var9 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Facility]') AND [c].[name] = N'cleanliness_rating');
IF @var9 IS NOT NULL EXEC(N'ALTER TABLE [Facility] DROP CONSTRAINT [' + @var9 + '];');
ALTER TABLE [Facility] ALTER COLUMN [cleanliness_rating] decimal(3,1) NOT NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250430113744_AddFeedbackAndFacilityModels', N'9.0.3');

CREATE TABLE [Notification] (
    [notification_id] int NOT NULL IDENTITY,
    [user_id] int NOT NULL,
    [title] nvarchar(max) NOT NULL,
    [message] nvarchar(max) NOT NULL,
    [created_date] datetime2 NOT NULL,
    [is_read] bit NOT NULL,
    [type] nvarchar(max) NOT NULL,
    [reference_id] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Notification] PRIMARY KEY ([notification_id]),
    CONSTRAINT [FK_Notification_User_user_id] FOREIGN KEY ([user_id]) REFERENCES [User] ([user_id]) ON DELETE CASCADE
);

CREATE INDEX [IX_Feedback_facility_id] ON [Feedback] ([facility_id]);

CREATE INDEX [IX_Notification_user_id] ON [Notification] ([user_id]);

ALTER TABLE [Feedback] ADD CONSTRAINT [FK_Feedback_Facility_facility_id] FOREIGN KEY ([facility_id]) REFERENCES [Facility] ([facility_id]) ON DELETE CASCADE;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250509125700_AddNotificationsTable', N'9.0.3');

ALTER TABLE [ServiceRequest] ADD [staffNotes] nvarchar(max) NOT NULL DEFAULT N'';

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250509132125_AddStaffNotesToServiceRequest', N'9.0.3');

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[ServiceRequest]') AND name = 'staffNotes') BEGIN ALTER TABLE [ServiceRequest] ADD [staffNotes] nvarchar(max) NOT NULL DEFAULT '' END

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250509132734_AddStaffNotesToServiceRequestTable', N'9.0.3');

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250509134553_CreateNotificationTable', N'9.0.3');

CREATE TABLE [FacilityReservation] (
    [reservation_id] int NOT NULL IDENTITY,
    [user_id] int NOT NULL,
    [facility_id] int NOT NULL,
    [reservation_date] datetime2 NOT NULL,
    [reservation_time] nvarchar(max) NOT NULL,
    [duration_hours] int NOT NULL,
    [guest_count] int NOT NULL,
    [purpose] nvarchar(max) NOT NULL,
    [total_amount] decimal(18,2) NOT NULL,
    [status] nvarchar(max) NOT NULL,
    [payment_status] nvarchar(max) NOT NULL,
    [notes] nvarchar(max) NULL,
    [staff_notes] nvarchar(max) NULL,
    [created_date] datetime2 NOT NULL,
    [updated_date] datetime2 NULL,
    CONSTRAINT [PK_FacilityReservation] PRIMARY KEY ([reservation_id]),
    CONSTRAINT [FK_FacilityReservation_Facility_facility_id] FOREIGN KEY ([facility_id]) REFERENCES [Facility] ([facility_id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_FacilityReservation_User_user_id] FOREIGN KEY ([user_id]) REFERENCES [User] ([user_id]) ON DELETE NO ACTION
);

CREATE INDEX [IX_FacilityReservation_facility_id] ON [FacilityReservation] ([facility_id]);

CREATE INDEX [IX_FacilityReservation_user_id] ON [FacilityReservation] ([user_id]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250509141250_AddFacilityReservation', N'9.0.3');

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250509141400_AddFacilityReservationsTable', N'9.0.3');

DECLARE @var10 sysname;
SELECT @var10 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FacilityReservation]') AND [c].[name] = N'notes');
IF @var10 IS NOT NULL EXEC(N'ALTER TABLE [FacilityReservation] DROP CONSTRAINT [' + @var10 + '];');
ALTER TABLE [FacilityReservation] DROP COLUMN [notes];

DECLARE @var11 sysname;
SELECT @var11 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FacilityReservation]') AND [c].[name] = N'updated_date');
IF @var11 IS NOT NULL EXEC(N'ALTER TABLE [FacilityReservation] DROP CONSTRAINT [' + @var11 + '];');
ALTER TABLE [FacilityReservation] DROP COLUMN [updated_date];

EXEC sp_rename N'[FacilityReservation].[total_amount]', N'price', 'COLUMN';

EXEC sp_rename N'[FacilityReservation].[created_date]', N'date_created', 'COLUMN';

DECLARE @var12 sysname;
SELECT @var12 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FacilityReservation]') AND [c].[name] = N'staff_notes');
IF @var12 IS NOT NULL EXEC(N'ALTER TABLE [FacilityReservation] DROP CONSTRAINT [' + @var12 + '];');
UPDATE [FacilityReservation] SET [staff_notes] = N'' WHERE [staff_notes] IS NULL;
ALTER TABLE [FacilityReservation] ALTER COLUMN [staff_notes] nvarchar(max) NOT NULL;
ALTER TABLE [FacilityReservation] ADD DEFAULT N'' FOR [staff_notes];

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250509141900_AddFacilityReservations', N'9.0.3');

ALTER TABLE [ServiceRequest] ADD [staff_id] int NULL;

CREATE TABLE [FacilityReservation] (
    [reservation_id] int NOT NULL IDENTITY,
    [user_id] int NOT NULL,
    [facility_id] int NOT NULL,
    [reservation_date] datetime2 NOT NULL,
    [reservation_time] nvarchar(max) NOT NULL,
    [duration_hours] int NOT NULL,
    [guest_count] int NOT NULL,
    [purpose] nvarchar(max) NOT NULL,
    [total_amount] decimal(10,2) NOT NULL,
    [status] nvarchar(max) NOT NULL,
    [payment_status] nvarchar(max) NOT NULL,
    [notes] nvarchar(max) NULL,
    [staff_notes] nvarchar(max) NULL,
    [created_date] datetime2 NOT NULL,
    [updated_date] datetime2 NULL,
    [staff_id] int NULL,
    [date_created] datetime2 NOT NULL,
    [price] decimal(10,2) NOT NULL,
    CONSTRAINT [PK_FacilityReservation] PRIMARY KEY ([reservation_id]),
    CONSTRAINT [FK_FacilityReservation_Facility_facility_id] FOREIGN KEY ([facility_id]) REFERENCES [Facility] ([facility_id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_FacilityReservation_User_user_id] FOREIGN KEY ([user_id]) REFERENCES [User] ([user_id]) ON DELETE NO ACTION
);

CREATE INDEX [IX_FacilityReservation_facility_id] ON [FacilityReservation] ([facility_id]);

CREATE INDEX [IX_FacilityReservation_user_id] ON [FacilityReservation] ([user_id]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250509164529_AddCompatibilityFields', N'9.0.3');

DECLARE @var13 sysname;
SELECT @var13 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceRequest]') AND [c].[name] = N'staff_id');
IF @var13 IS NOT NULL EXEC(N'ALTER TABLE [ServiceRequest] DROP CONSTRAINT [' + @var13 + '];');
ALTER TABLE [ServiceRequest] DROP COLUMN [staff_id];

DECLARE @var14 sysname;
SELECT @var14 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FacilityReservation]') AND [c].[name] = N'created_date');
IF @var14 IS NOT NULL EXEC(N'ALTER TABLE [FacilityReservation] DROP CONSTRAINT [' + @var14 + '];');
ALTER TABLE [FacilityReservation] DROP COLUMN [created_date];

DECLARE @var15 sysname;
SELECT @var15 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FacilityReservation]') AND [c].[name] = N'notes');
IF @var15 IS NOT NULL EXEC(N'ALTER TABLE [FacilityReservation] DROP CONSTRAINT [' + @var15 + '];');
ALTER TABLE [FacilityReservation] DROP COLUMN [notes];

DECLARE @var16 sysname;
SELECT @var16 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FacilityReservation]') AND [c].[name] = N'staff_id');
IF @var16 IS NOT NULL EXEC(N'ALTER TABLE [FacilityReservation] DROP CONSTRAINT [' + @var16 + '];');
ALTER TABLE [FacilityReservation] DROP COLUMN [staff_id];

DECLARE @var17 sysname;
SELECT @var17 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FacilityReservation]') AND [c].[name] = N'total_amount');
IF @var17 IS NOT NULL EXEC(N'ALTER TABLE [FacilityReservation] DROP CONSTRAINT [' + @var17 + '];');
ALTER TABLE [FacilityReservation] DROP COLUMN [total_amount];

DECLARE @var18 sysname;
SELECT @var18 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FacilityReservation]') AND [c].[name] = N'updated_date');
IF @var18 IS NOT NULL EXEC(N'ALTER TABLE [FacilityReservation] DROP CONSTRAINT [' + @var18 + '];');
ALTER TABLE [FacilityReservation] DROP COLUMN [updated_date];

CREATE TABLE [RentPayment] (
    [payment_id] int NOT NULL IDENTITY,
    [user_id] int NOT NULL,
    [amount] decimal(10,2) NOT NULL,
    [due_date] datetime2 NOT NULL,
    [status] nvarchar(max) NOT NULL,
    [payment_date] datetime2 NULL,
    [payment_method] nvarchar(max) NULL,
    [transaction_id] nvarchar(max) NULL,
    [date_created] datetime2 NOT NULL,
    CONSTRAINT [PK_RentPayment] PRIMARY KEY ([payment_id]),
    CONSTRAINT [FK_RentPayment_User_user_id] FOREIGN KEY ([user_id]) REFERENCES [User] ([user_id]) ON DELETE NO ACTION
);

CREATE INDEX [IX_RentPayment_user_id] ON [RentPayment] ([user_id]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250510001350_AddRentPaymentsTable', N'9.0.3');

COMMIT;
GO

