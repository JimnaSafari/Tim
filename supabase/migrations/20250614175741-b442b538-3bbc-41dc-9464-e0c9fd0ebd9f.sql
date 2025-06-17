
-- Create the avatars storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for the avatars bucket to allow authenticated users to upload
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload an avatar" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Anyone can update their own avatar" ON storage.objects
FOR UPDATE USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can delete their own avatar" ON storage.objects
FOR DELETE USING (bucket_id = 'avatars');
