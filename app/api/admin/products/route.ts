import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!;

const admin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await admin.from('Product').select('*');
    
    if (error) throw error;
    
    const sanitizedProducts = (data || []).map(p => ({
      ...p,
      MRP: p.MRP ?? 0,
    }));
    
    return NextResponse.json({
      success: true,
      data: sanitizedProducts
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'add':
        const productWithDefaults = {
          ...data,
          id: data.id || Math.random().toString(36).substr(2, 9),
          visibility: true,
        };
        const { error: addError } = await admin.from('Product').insert([productWithDefaults]);
        if (addError) throw addError;
        break;

      case 'update':
        const { originalId, changes } = data;
        
        if (changes.id && changes.id !== originalId) {
          // Check if new ID already exists
          const { data: existing } = await admin
            .from('Product')
            .select('id')
            .eq('id', changes.id)
            .maybeSingle();

          if (existing) {
            throw new Error(`Product with ID ${changes.id} already exists`);
          }

          // Create new record with updated ID
          const { error: createError } = await admin
            .from('Product')
            .insert({
              ...changes,
              id: changes.id
            });

          if (createError) throw createError;

          // Delete old record
          const { error: deleteError } = await admin
            .from('Product')
            .delete()
            .eq('id', originalId);

          if (deleteError) throw deleteError;
        } else {
          // Normal update if ID isn't changing
          const { error: updateError } = await admin
            .from('Product')
            .update(changes)
            .eq('id', originalId);

          if (updateError) throw updateError;
        }
        break;

      case 'delete':
        const { ids } = data;
        const { error: deleteError } = await admin
          .from('Product')
          .delete()
          .in('id', ids);

        if (deleteError) throw deleteError;
        break;

      case 'updateVisibility':
        const { changes: visChanges } = data;
        const updates = Object.entries(visChanges).map(([id, visibility]) =>
          admin.from('Product').update({ visibility }).eq('id', id)
        );
        const results = await Promise.all(updates);
        const error = results.find(res => res.error);
        if (error) throw error.error;
        break;

      case 'updateNewArrivals':
        const { changes: newArrivalChanges } = data;
        const newArrivalUpdates = Object.entries(newArrivalChanges).map(([id, newArrivals]) =>
          admin.from('Product').update({ newArrivals }).eq('id', id)
        );
        const newArrivalResults = await Promise.all(newArrivalUpdates);
        const newArrivalError = newArrivalResults.find(res => res.error);
        if (newArrivalError) throw newArrivalError.error;
        break;

      default:
        throw new Error('Invalid action');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}