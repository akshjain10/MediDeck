import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.VITE_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('Product')
      .select('*')
      .eq('visibility', true);

    if (error) {
      throw error;
    }

    // Transform the data to match the frontend interface
    const transformedProducts = (data || []).map((item: any) => ({
      id: item.id,
      brandName: item.Name || '',
      name: item.Salt || '',
      company: item.Company || '',
      packing: item.Packing || '',
      mrp: item.MRP || 0,
      image: 'photo-1581091226825-a6a2a5aee158',
      category: item.Category || 'General',
      salt: item.Salt || '',
      stockAvailable: item['Stock Available'] || false,
      isVisible: item.visibility || false,
      newArrivals: item.newArrivals || false
    }));

    return NextResponse.json({
      success: true,
      data: transformedProducts
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch products' 
      },
      { status: 500 }
    );
  }
}