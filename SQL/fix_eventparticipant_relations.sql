-- Fix the EventParticipant relationships to avoid 'user_id1' collision

-- First, drop existing constraints
IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_EventParticipant_User' AND parent_object_id = OBJECT_ID('EventParticipant'))
BEGIN
    ALTER TABLE [EventParticipant] DROP CONSTRAINT [FK_EventParticipant_User];
    PRINT 'Dropped FK_EventParticipant_User constraint.';
END

-- Clear existing data to ensure no constraints are violated
DELETE FROM [EventParticipant];
PRINT 'All data cleared from EventParticipant table.';

-- Now recreate the constraint with explicit names
ALTER TABLE [EventParticipant] 
ADD CONSTRAINT [FK_EventParticipant_User_UserId] 
FOREIGN KEY ([user_id]) REFERENCES [User]([user_id]) ON DELETE CASCADE;
PRINT 'Created FK_EventParticipant_User_UserId constraint.';

PRINT 'EventParticipant relationship configuration completed successfully.'; 