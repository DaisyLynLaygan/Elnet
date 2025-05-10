# Event Management Database Setup

This directory contains SQL scripts for setting up the Event and EventParticipant tables in the HomeOwner application.

## Usage

### Option 1: Using the Batch File

1. Ensure SQL Server is installed on your system
2. Make sure the `SQL` directory exists with the `CreateEventTables.sql` script inside it
3. Run the `create_events_tables.bat` file in the root directory
4. Follow the prompts to enter your SQL Server details
5. The script will create the tables and insert sample data if they don't exist

### Option 2: Manual Execution

1. Open SQL Server Management Studio or your preferred SQL client
2. Connect to your database server
3. Open the `CreateEventTables.sql` script
4. Execute the script against your HomeOwner database

## Script Explanation

The `CreateEventTables.sql` script:

1. Creates the `Event` table with the following columns:
   - event_id (primary key)
   - title
   - event_date
   - start_time
   - end_time
   - location
   - description
   - organizer
   - contact_email
   - capacity
   - rsvp_count
   - image_url
   - is_featured
   - tags
   - created_at
   - updated_at

2. Creates the `EventParticipant` table with the following columns:
   - participant_id (primary key)
   - event_id (foreign key referencing Event)
   - user_id (foreign key referencing User)
   - participant_type
   - registered_at

3. Inserts sample event data if the Event table is empty
4. Inserts sample participant data if the EventParticipant table is empty (using existing users from the User table)

## Important Notes

- The script will not overwrite existing tables
- Sample data is only inserted if the tables are empty
- Participant data relies on existing users in the User table with 'homeowner', 'staff', and 'admin' roles 