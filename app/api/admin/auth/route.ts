import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.VITE_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const { data, error } = await supabase.rpc('authenticate_admin', {
      admin_email: email,
      admin_password: password
    });

    if (error) {
      throw error;
    }

    if (data.success) {
      return NextResponse.json({
        success: true,
        admin: {
          admin_id: data.admin_id,
          name: data.name,
          email: data.email
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: data.message
      }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}