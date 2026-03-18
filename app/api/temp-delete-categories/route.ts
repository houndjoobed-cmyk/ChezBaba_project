// Route dépréciée — retourne 410 Gone
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json(
        { error: "Cette route a été supprimée." },
        { status: 410 }
    );
}
