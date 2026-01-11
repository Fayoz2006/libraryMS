-- Add policy to deny anonymous access to profiles table
CREATE POLICY "Deny anonymous access to profiles"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Add policy to deny anonymous access to user_roles table
CREATE POLICY "Deny anonymous access to user_roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() IS NOT NULL);