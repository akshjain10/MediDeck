
-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Create product visibility settings table
CREATE TABLE public.product_visibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES "Product"(id),
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create product categories for better filtering
CREATE TABLE public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for admin tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_visibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- Admin users can manage their own records
CREATE POLICY "Admin users can view their own data" ON public.admin_users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Product visibility can be managed by admin users
CREATE POLICY "Admin can manage product visibility" ON public.product_visibility
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id::text = auth.uid()::text AND is_active = true
    )
  );

-- Product categories can be managed by admin users
CREATE POLICY "Admin can manage categories" ON public.product_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id::text = auth.uid()::text AND is_active = true
    )
  );

-- Create function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = user_id AND is_active = true
  );
$$;

-- Insert default admin user (password: admin123 - should be changed in production)
INSERT INTO public.admin_users (email, password_hash, name) 
VALUES ('admin@example.com', '$2b$10$rOx8kZXXp9HYHmXz4YJ4xeXp4YJ4xeXp4YJ4xeXp4YJ4xeXp4YJ4xe', 'Admin User');
