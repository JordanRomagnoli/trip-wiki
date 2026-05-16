import { createItinerary, getAllCities, getCityById } from '../models/city'
import { updatePoiVisited } from '../models/poi'
import { City } from '../types'

/**
 * Controller for handling Points of Interest and Cities logic.
 */
export const poiController = {
  /**
   * Fetches all cities with their nested POIs and itineraries.
   */
  async getInitialData(filters?: { category?: string, itineraryId?: string }): Promise<City[]> {
    try {
      const cities = await getAllCities(filters)
      return cities
    } catch (error) {
      console.error('Controller error fetching initial data:', error)
      return []
    }
  },

  /**
   * Fetches a specific city by its ID.
   */
  async getCity(id: string): Promise<City | null> {
    return await getCityById(id)
  },

  /**
   * Toggles the visited status of a POI.
   * This can be called from a Server Action.
   */
  async toggleVisited(poiId: string, visited: boolean): Promise<void> {
    await updatePoiVisited(poiId, visited)
  },

  /**
   * Creates a new itinerary.
   */
  async createItinerary(cityId: string, name: string, poiIds: string[]): Promise<any> {
    return await createItinerary(cityId, name, poiIds)
  },

  /**
   * Creates a new POI.
   */
  async createPoi(poi: any): Promise<any> {
    return await import('../models/poi').then(m => m.createPoi(poi))
  }
}
