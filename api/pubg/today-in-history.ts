import type { VercelRequest, VercelResponse} from '@vercel/node';
import { getDb } from '../_lib/db';
import { pubgUpdates } from '../../shared/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = getDb();
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    const allUpdates = await db.select().from(pubgUpdates);
    const filtered = allUpdates.filter(update => {
      const releaseDate = new Date(update.releaseDate);
      return releaseDate.getMonth() + 1 === month && releaseDate.getDate() === day;
    });
    
    return res.status(200).json(filtered.length > 0 ? filtered : [allUpdates[0]]);

  } catch (error) {
    console.error('Error fetching today in history:', error);
    return res.status(500).json({ error: 'Failed to fetch today in history' });
  }
}
