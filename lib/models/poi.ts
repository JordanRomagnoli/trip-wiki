import { createClient } from '../supabase/server'
import { POI } from '../types'

export async function getPoisByCityId(cityId: string): Promise<POI[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('pois')
    .select('*')
    .eq('city_id', cityId)

  if (error) {
    console.error(`Error fetching POIs for city ${cityId}:`, error)
    return []
  }

  return data as POI[]
}

export async function updatePoiVisited(id: string, visited: boolean): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('pois')
    .update({ visited })
    .eq('id', id)

  if (error) {
    console.error(`Error updating POI ${id}:`, error)
  }
}
export async function createPoi(poi: Omit<POI, 'id' | 'visited' | 'created_at'>): Promise<POI | null> {
  const supabase = await createClient()
  const id = Math.random().toString(36).substring(2, 11)

  const { data, error } = await supabase
    .from('pois')
    .insert({
      id,
      ...poi,
      visited: false,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating POI:', error)
    return null
  }

  return data as POI
}
