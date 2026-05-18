'use server';

import { redirect } from 'next/navigation';
import { poiController } from './controllers/poiController';
import { createClient } from './supabase/server';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect('/');
}

export async function signupAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  console.log(error);


  if (error) {
    return { error: error.message };
  }

  redirect('/');
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function createItineraryAction(cityId: string, name: string, poiIds: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Non autorizzato. Devi effettuare il login.');
  }

  return await poiController.createItinerary(cityId, name, poiIds);
}

export async function createPoiAction(poi: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Non autorizzato. Devi effettuare il login.');
  }

  return await poiController.createPoi(poi);
}

