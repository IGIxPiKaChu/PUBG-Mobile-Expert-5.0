import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/db';
import { pubgUpdates } from '../../shared/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = getDb();
    const { year, search } = req.query;

    let query;

    if (search && typeof search === 'string') {
      const allUpdates = await db.select().from(pubgUpdates);
      const lowerQuery = search.toLowerCase();
      const filtered = allUpdates.filter(update => 
        update.versionName.toLowerCase().includes(lowerQuery) ||
        update.majorFeatures.some((f: string) => f.toLowerCase().includes(lowerQuery)) ||
        update.weaponChanges?.some((w: string) => w.toLowerCase().includes(lowerQuery)) ||
        update.mapChanges?.some((m: string) => m.toLowerCase().includes(lowerQuery))
      );
      return res.status(200).json(filtered);
    }

    if (year && typeof year === 'string') {
      const updates = await db.select().from(pubgUpdates).where(eq(pubgUpdates.year, year));
      return res.status(200).json(updates);
    }

    const allUpdates = await db.select().from(pubgUpdates);
    return res.status(200).json(allUpdates);

  } catch (error) {
    console.error('Error fetching PUBG updates:', error);
    return res.status(500).json({ error: 'Failed to fetch updates' });
  }
}
