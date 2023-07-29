import supabase from './supabase';

export async function createGuest(newGuest) {
  const { data, error } = await supabase
    .from('guests')
    .insert([newGuest])
    .select()
    .single();
  if (error) {
    console.error(error);
    throw new Error('Cabins could not be loaded');
  }

  return data;
}
