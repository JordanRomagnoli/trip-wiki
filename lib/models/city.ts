import { createClient } from '../supabase/server'
import { City, Itinerary } from '../types'

function mapCity(city: any): City {
  return {
    ...city,
    itineraries: city.itineraries?.map((it: any) => ({
      ...it,
      poiIds: it.poi_ids,
    })),
  } as City
}

export async function getAllCities(filters?: { category?: string, itineraryId?: string }): Promise<City[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('cities')
    .select('*, pois(*), itineraries(*)')

  if (filters?.category && filters.category !== 'all') {
    query = query.eq('pois.category', filters.category)
  }

  if (filters?.itineraryId) {
    // First get the itinerary to know which POIs to include
    const { data: itinerary } = await supabase
      .from('itineraries')
      .select('poi_ids')
      .eq('id', filters.itineraryId)
      .single()

    if (itinerary) {
      query = query.in('pois.id', itinerary.poi_ids)
    }
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching cities:', error)
    return []
  }

  return (data as any[]).map(mapCity)
}

export async function getCityById(id: string, filters?: { category?: string, itineraryId?: string }): Promise<City | null> {
  const supabase = await createClient()
  
  let query = supabase
    .from('cities')
    .select('*, pois(*), itineraries(*)')
    .eq('id', id)

  if (filters?.category && filters.category !== 'all') {
    query = query.eq('pois.category', filters.category)
  }

  if (filters?.itineraryId) {
    const { data: itinerary } = await supabase
      .from('itineraries')
      .select('poi_ids')
      .eq('id', filters.itineraryId)
      .single()

    if (itinerary) {
      query = query.in('pois.id', itinerary.poi_ids)
    }
  }

  const { data, error } = await query.single()

  if (error) {
    console.error(`Error fetching city ${id}:`, error)
    return null
  }

  return mapCity(data)
}

export async function createItinerary(cityId: string, name: string, poiIds: string[]): Promise<Itinerary | null> {
  const supabase = await createClient()
  const id = Math.random().toString(36).substring(2, 11) // Simple ID generation

  const { data, error } = await supabase
    .from('itineraries')
    .insert({
      id,
      city_id: cityId,
      name,
      poi_ids: poiIds,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating itinerary:', error)
    return null
  }

  return {
    ...data,
    poiIds: data.poi_ids,
  } as Itinerary
}
