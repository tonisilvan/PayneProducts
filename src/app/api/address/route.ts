import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get('input');

  if (!input || input.length < 3) {
    return NextResponse.json([]);
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&types=address&key=${GOOGLE_API_KEY}&language=es&components=country:es|country:pt`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.predictions) {
      return NextResponse.json(
        data.predictions.map((p: any) => ({
          description: p.description,
          place_id: p.place_id,
        }))
      );
    }

    return NextResponse.json([]);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
