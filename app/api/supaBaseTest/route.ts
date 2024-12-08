import { NextResponse } from 'next/server';
import { supabase } from '../../helpers/SupaBaseConnect';

export async function GET() {
    const { data, error } = await supabase.from('scene_Table')
                                            .select('scene')
                                            .order('created_at', { ascending: false }) // Neuesten Zustand laden
                                            .limit(1);
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { data, error } = await supabase.from('scene_Table').insert([body]);
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
}
