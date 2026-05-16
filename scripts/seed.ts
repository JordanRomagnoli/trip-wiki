import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { CITIES } from './data'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

// Use Service Role key if available to bypass RLS, otherwise fallback to Anon key
const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey)

async function seed() {
  console.log('Starting seed process...')

  for (const city of CITIES) {
    console.log(`Inserting city: ${city.name}...`)
    
    // Insert City
    const { error: cityError } = await supabase
      .from('cities')
      .upsert({
        id: city.id,
        name: city.name,
        center: city.center,
        zoom: city.zoom
      })

    if (cityError) {
      console.error(`Error inserting city ${city.name}:`, cityError)
      continue
    }

    // Insert POIs
    console.log(`Inserting POIs for ${city.name}...`)
    const poisToInsert = city.pois.map(poi => ({
      id: poi.id,
      city_id: city.id,
      name: poi.name,
      description: poi.description,
      coordinates: poi.coordinates,
      category: poi.category,
      visited: poi.visited || false
    })).filter(poi => poi.id !== '') // Filter out empty IDs

    const { error: poiError } = await supabase
      .from('pois')
      .upsert(poisToInsert)

    if (poiError) {
      console.error(`Error inserting POIs for ${city.name}:`, poiError)
    }

    // Insert Itineraries
    if (city.itineraries && city.itineraries.length > 0) {
      console.log(`Inserting itineraries for ${city.name}...`)
      const itinerariesToInsert = city.itineraries.map(it => ({
        id: it.id,
        city_id: city.id,
        name: it.name,
        poi_ids: it.poiIds
      }))

      const { error: itError } = await supabase
        .from('itineraries')
        .upsert(itinerariesToInsert)

      if (itError) {
        console.error(`Error inserting itineraries for ${city.name}:`, itError)
      }
    }
  }

  console.log('Seed process completed!')
}

seed().catch(err => {
  console.error('Seed script failed:', err)
  process.exit(1)
})
