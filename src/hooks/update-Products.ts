import { supabaseAdmin } from '@/integrations/supabase-admin'

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('product_visibility')
      .upsert(req.body)
      .select()
      .single()

    if (error) throw error
    return res.status(200).json(data)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}