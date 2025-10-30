-- ============================================================================
-- Verify BuyaReco Schema Status
-- Run this to check what tables and columns exist
-- ============================================================================

-- Check all tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check users table columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'users'
ORDER BY ordinal_position;

-- Check if recommendations tables exist
SELECT
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'recommendation_requests') as requests_exists,
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'suggestions') as suggestions_exists,
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'messages') as messages_exists,
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications') as notifications_exists,
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'saved_places') as saved_places_exists;

-- Check suggestions table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'suggestions'
ORDER BY ordinal_position;
