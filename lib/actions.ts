'use server';

import { poiController } from './controllers/poiController';

export async function createItineraryAction(cityId: string, name: string, poiIds: string[]) {
  return await poiController.createItinerary(cityId, name, poiIds);
}

export async function createPoiAction(poi: any) {
  return await poiController.createPoi(poi);
}
