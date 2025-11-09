import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from './_lib/db';
import { pubgUpdates, insertPubgUpdateSchema } from '../shared/schema';
import { z } from 'zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const password = req.headers['x-admin-password'] as string;
    const expectedPassword = process.env.ADMIN_PASSWORD;

    if (!expectedPassword) {
      console.error('ADMIN_PASSWORD environment variable is not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    if (!password) {
      return res.status(401).json({ error: 'Admin password required' });
    }

    if (password !== expectedPassword) {
      return res.status(401).json({ error: 'Invalid admin password' });
    }

    const { updates } = req.body;

    if (!Array.isArray(updates)) {
      return res.status(400).json({ error: 'Updates must be an array' });
    }

    const updatesSchema = z.array(insertPubgUpdateSchema);
    const validatedUpdates = updatesSchema.parse(updates);

    const db = getDb();

    for (const update of validatedUpdates) {
      await db.insert(pubgUpdates)
        .values(update)
        .onConflictDoUpdate({
          target: pubgUpdates.id,
          set: {
            versionName: update.versionName,
            releaseDate: update.releaseDate,
            year: update.year,
            majorFeatures: update.majorFeatures,
            weaponChanges: update.weaponChanges,
            mapChanges: update.mapChanges,
            vehicleChanges: update.vehicleChanges,
            metaSummary: update.metaSummary,
          }
        });
    }

    return res.status(200).json({ 
      success: true, 
      message: `Successfully uploaded ${validatedUpdates.length} updates` 
    });

  } catch (error) {
    console.error('Error uploading PUBG data:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data format', details: error.errors });
    }
    return res.status(500).json({ error: 'Failed to upload PUBG data' });
  }
}
