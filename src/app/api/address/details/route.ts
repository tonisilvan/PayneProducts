import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get('placeId');

  if (!placeId) {
    return NextResponse.json({ error: 'placeId required' }, { status: 400 });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&key=${GOOGLE_API_KEY}&fields=address_components,formatted_address&language=es`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.result) {
      const components = data.result.address_components || [];

      const streetNumber = components.find((c: any) => c.types.includes('street_number'))?.long_name || '';
      const route = components.find((c: any) => c.types.includes('route'))?.long_name || '';
      const postalCode = components.find((c: any) => c.types.includes('postal_code'))?.long_name || '';
      const city = components.find((c: any) => c.types.includes('locality'))?.long_name || '';
      const province = components.find((c: any) => c.types.includes('administrative_area_level_2'))?.long_name ||
        components.find((c: any) => c.types.includes('administrative_area_level_1'))?.long_name || '';
      const country = components.find((c: any) => c.types.includes('country'))?.long_name || '';

      return NextResponse.json({
        address: `${route} ${streetNumber}`.trim(),
        postalCode,
        city,
        province,
        country,
      });
    }

    return NextResponse.json({ address: '', postalCode: '', city: '', province: '', country: '' });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch details' }, { status: 500 });
  }
}
