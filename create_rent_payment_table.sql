-- Create RentPayment table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'RentPayment')
BEGIN
    CREATE TABLE [RentPayment] (
        [payment_id] int NOT NULL IDENTITY,
        [user_id] int NOT NULL,
        [amount] decimal(18,2) NOT NULL,
        [due_date] datetime2 NOT NULL,
        [status] nvarchar(max) NOT NULL,
        [payment_date] datetime2 NULL,
        [payment_method] nvarchar(max) NULL,
        [transaction_id] nvarchar(max) NULL,
        [date_created] datetime2 NOT NULL,
        CONSTRAINT [PK_RentPayment] PRIMARY KEY ([payment_id]),
        CONSTRAINT [FK_RentPayment_User_user_id] FOREIGN KEY ([user_id]) REFERENCES [User] ([user_id]) ON DELETE NO ACTION
    );

    -- Create index on user_id
    CREATE INDEX [IX_RentPayment_user_id] ON [RentPayment] ([user_id]);
    
    PRINT 'RentPayment table created successfully!';
END
ELSE
BEGIN
    PRINT 'RentPayment table already exists!';
END 