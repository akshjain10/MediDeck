import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.VITE_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    
    const { data: product, error } = await supabase
      .from('Product')
      .select('*')
      .eq('id', productId)
      .eq('visibility', true)
      .single();

    if (error || !product) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head>
            <meta property="og:title" content="Product Not Found" />
            <meta property="og:description" content="This product is not available" />
            <meta property="og:image" content="${request.nextUrl.origin}/images/products/default.webp" />
            <meta property="og:url" content="${request.nextUrl.origin}/products/${productId}" />
          </head>
          <body>
            <script>window.location.href = "${request.nextUrl.origin}/products/${productId}";</script>
          </body>
        </html>`,
        {
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }

    const imageUrl = `${request.nextUrl.origin}/images/products/${productId}.webp`;
    
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <meta property="og:title" content="${product.Name} by ${product.Company}" />
          <meta property="og:description" content="MRP ₹${product.MRP} - Available now!" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="og:url" content="${request.nextUrl.origin}/products/${productId}" />
          <meta property="og:type" content="product" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${product.Name} by ${product.Company}" />
          <meta name="twitter:description" content="MRP ₹${product.MRP} - Available now!" />
          <meta name="twitter:image" content="${imageUrl}" />
        </head>
        <body>
          <script>window.location.href = "${request.nextUrl.origin}/products/${productId}";</script>
        </body>
      </html>`,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}