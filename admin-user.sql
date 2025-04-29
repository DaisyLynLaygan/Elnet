INSERT INTO [User] (
    [username],
    [firstname],
    [lastname],
    [user_password],
    [email],
    [role],
    [status],
    [date_created]
)
VALUES (
    'admin-Edem',           -- username
    'Admin',               -- firstname
    'User',               -- lastname
    'kimperor',           -- password
    'admin@example.com',  -- email
    'admin',              -- role
    'active',            -- status
    GETDATE()            -- date_created
); 