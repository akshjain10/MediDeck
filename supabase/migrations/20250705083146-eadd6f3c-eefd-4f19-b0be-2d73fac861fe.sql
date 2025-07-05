
-- Create admin authentication table if it doesn't exist (it already exists, so this is just for reference)
-- The admin_users table already exists with proper structure

-- Create a function to handle admin authentication
CREATE OR REPLACE FUNCTION public.authenticate_admin(
  admin_email text,
  admin_password text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_record record;
  password_match boolean;
BEGIN
  -- Get admin record
  SELECT * INTO admin_record
  FROM public.admin_users
  WHERE email = admin_email AND is_active = true;
  
  -- Check if admin exists
  IF admin_record IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Invalid credentials');
  END IF;
  
  -- For demo purposes, we'll use plain text password comparison
  -- In production, you should use proper password hashing
  password_match := (admin_record.password_hash = admin_password);
  
  IF password_match THEN
    RETURN json_build_object(
      'success', true, 
      'admin_id', admin_record.id,
      'name', admin_record.name,
      'email', admin_record.email
    );
  ELSE
    RETURN json_build_object('success', false, 'message', 'Invalid credentials');
  END IF;
END;
$$;

-- Insert a default admin user for testing (if not exists)
INSERT INTO public.admin_users (email, password_hash, name)
VALUES ('admin@example.com', 'admin123', 'Admin User')
ON CONFLICT (email) DO NOTHING;

-- Create product visibility management policies
-- The product_visibility table already exists with proper RLS policies

-- Create a function to get product statistics
CREATE OR REPLACE FUNCTION public.get_product_statistics()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_products integer;
  visible_products integer;
  hidden_products integer;
  company_stats json;
  category_stats json;
BEGIN
  -- Get total product counts
  SELECT COUNT(*) INTO total_products FROM public."Product";
  
  SELECT COUNT(*) INTO visible_products 
  FROM public."Product" p
  LEFT JOIN public.product_visibility pv ON p.id = pv.product_id
  WHERE pv.is_visible IS NULL OR pv.is_visible = true;
  
  SELECT COUNT(*) INTO hidden_products 
  FROM public."Product" p
  INNER JOIN public.product_visibility pv ON p.id = pv.product_id
  WHERE pv.is_visible = false;
  
  -- Get company-wise statistics
  SELECT json_agg(json_build_object('company', "Company", 'count', count))
  INTO company_stats
  FROM (
    SELECT "Company", COUNT(*) as count
    FROM public."Product"
    WHERE "Company" IS NOT NULL
    GROUP BY "Company"
    ORDER BY count DESC
    LIMIT 10
  ) company_counts;
  
  -- Get category-wise statistics
  SELECT json_agg(json_build_object('category', "Category", 'count', count))
  INTO category_stats
  FROM (
    SELECT "Category", COUNT(*) as count
    FROM public."Product"
    WHERE "Category" IS NOT NULL
    GROUP BY "Category"
    ORDER BY count DESC
  ) category_counts;
  
  RETURN json_build_object(
    'total_products', total_products,
    'visible_products', visible_products,
    'hidden_products', hidden_products,
    'company_stats', COALESCE(company_stats, '[]'::json),
    'category_stats', COALESCE(category_stats, '[]'::json)
  );
END;
$$;
