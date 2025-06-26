import maxmind, { type CityResponse } from 'maxmind'
import type { NextRequest } from 'next/server'

const DB_PATH = 'public/iott/data/GeoLite2-City.mmdb'

export async function GET(req: NextRequest) {
  const ip = req?.nextUrl?.searchParams.get('ip')
  if (!ip) {
    return new Response('IP address is required', { status: 400 })
  }

  const lookup = await maxmind.open<CityResponse>(DB_PATH)
  if (!lookup) {
    return new Response('GeoIP database not loaded', { status: 500 })
  }

  const geoData = lookup.get(ip)
  if (!geoData) {
    return new Response('No geolocation data found', { status: 404 })
  }

  return Response.json({
    region_name: geoData.subdivisions?.[0]?.names?.en || null,
    country_code: geoData.country?.iso_code || null,
    country: geoData.country?.names?.en || null,
    city: geoData.city?.names?.en || null,
    continent: geoData.continent?.names?.en || null,
    latitude: geoData.location?.latitude || null,
    longitude: geoData.location?.longitude || null,
  })
}
