-- Sample notifications for testing
-- Insert some notifications
INSERT INTO NOTIFICATIONS (MESSAGE, TYPE, DATA) VALUES 
('New episodes of Breaking Bad are now available!', 'movie_update', '{"movie_id": 1, "show_title": "Breaking Bad"}'),
('Administrator has posted an important notice about the platform', 'admin_notice', '{"priority": "high"}'),
('Someone replied to your comment on The Wire', 'comment_reply', '{"comment_id": 123, "show_title": "The Wire"}'),
('Your favorite show The Sopranos has been updated with new content', 'movie_update', '{"movie_id": 2, "show_title": "The Sopranos"}'),
('New season of your watchlisted show is now streaming', 'movie_update', '{"movie_id": 3, "show_title": "Stranger Things"}');

-- You'll need to manually insert USER_NOTIFICATIONS records for specific users
-- Replace USER_ID with actual user IDs from your database
-- To find your user ID, run: SELECT u.USER_ID FROM PERSON p JOIN USER u ON p.PERSON_ID = u.PERSON_ID WHERE p.EMAIL = 'your_email@example.com';

-- Example (replace 1 with your actual USER_ID):
-- INSERT INTO USER_NOTIFICATIONS (USER_ID, NOTIF_ID, IS_READ) VALUES 
-- (1, 1, FALSE),
-- (1, 2, FALSE), 
-- (1, 3, TRUE),
-- (1, 4, FALSE),
-- (1, 5, FALSE);
