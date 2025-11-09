import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from './_lib/db';
import { playerProfiles, insertPlayerProfileSchema } from '../shared/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const querySchema = z.object({
  id: z.string().uuid().optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = getDb();

  if (req.method === 'GET') {
    try {
      const queryValidation = querySchema.safeParse(req.query);
      
      if (!queryValidation.success) {
        return res.status(400).json({ 
          error: 'Invalid query parameters',
          details: queryValidation.error.errors 
        });
      }

      const { id } = queryValidation.data;

      if (id) {
        const profile = await db.select().from(playerProfiles).where(eq(playerProfiles.id, id));
        if (profile.length === 0) {
          return res.status(404).json({ error: 'Profile not found' });
        }
        return res.status(200).json(profile[0]);
      }

      const allProfiles = await db.select().from(playerProfiles);
      return res.status(200).json(allProfiles);

    } catch (error) {
      console.error('Error fetching profile:', error);
      return res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }

  if (req.method === 'POST') {
    try {
      const validatedProfile = insertPlayerProfileSchema.parse(req.body);
      const newProfile = await db.insert(playerProfiles).values(validatedProfile).returning();
      return res.status(201).json(newProfile[0]);

    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: 'Invalid profile data', details: error });
      }
      console.error('Error creating profile:', error);
      return res.status(500).json({ error: 'Failed to create profile' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Profile ID is required' });
      }

      const partialSchema = insertPlayerProfileSchema.partial();
      const validatedUpdates = partialSchema.parse(req.body);

      const updatedProfile = await db.update(playerProfiles)
        .set(validatedUpdates)
        .where(eq(playerProfiles.id, id))
        .returning();

      if (updatedProfile.length === 0) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      return res.status(200).json(updatedProfile[0]);

    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: 'Invalid profile data', details: error });
      }
      console.error('Error updating profile:', error);
      return res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
