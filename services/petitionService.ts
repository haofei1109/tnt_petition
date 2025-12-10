import { Petition } from '../types';

export const getPetitions = async (): Promise<Petition[]> => {
  const res = await fetch('/api/petitions');
  if (!res.ok) throw new Error('Failed to fetch petitions');
  const data = await res.json();
  return data.petitions;
};

export const createPetition = async (petition: Petition): Promise<void> => {
  const res = await fetch('/api/petitions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(petition),
  });
  if (!res.ok) throw new Error('Failed to create petition');
};

export const signPetition = async (petitionId: string, signature: any): Promise<void> => {
  const res = await fetch('/api/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ petitionId, signature }),
  });
  if (!res.ok) throw new Error('Failed to sign petition');
};
