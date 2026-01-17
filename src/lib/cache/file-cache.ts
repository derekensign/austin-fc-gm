/**
 * Simple file-based cache for development
 * In production, you'd use Redis or a database
 */

import { promises as fs } from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), '.cache');

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // milliseconds
}

async function ensureCacheDir() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch {
    // Directory exists
  }
}

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    await ensureCacheDir();
    const filePath = path.join(CACHE_DIR, `${key}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    const entry: CacheEntry<T> = JSON.parse(content);
    
    // Check if cache is still valid
    if (Date.now() - entry.timestamp < entry.ttl) {
      return entry.data;
    }
    
    // Cache expired
    return null;
  } catch {
    return null;
  }
}

export async function setCache<T>(key: string, data: T, ttlMs: number = 3600000): Promise<void> {
  await ensureCacheDir();
  const filePath = path.join(CACHE_DIR, `${key}.json`);
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
    ttl: ttlMs,
  };
  await fs.writeFile(filePath, JSON.stringify(entry, null, 2));
}

export async function clearCache(key?: string): Promise<void> {
  await ensureCacheDir();
  if (key) {
    const filePath = path.join(CACHE_DIR, `${key}.json`);
    try {
      await fs.unlink(filePath);
    } catch {
      // File doesn't exist
    }
  } else {
    // Clear all cache
    const files = await fs.readdir(CACHE_DIR);
    for (const file of files) {
      if (file.endsWith('.json')) {
        await fs.unlink(path.join(CACHE_DIR, file));
      }
    }
  }
}

export async function getCacheInfo(): Promise<{ key: string; age: number; ttl: number }[]> {
  await ensureCacheDir();
  const files = await fs.readdir(CACHE_DIR);
  const info: { key: string; age: number; ttl: number }[] = [];
  
  for (const file of files) {
    if (file.endsWith('.json')) {
      try {
        const content = await fs.readFile(path.join(CACHE_DIR, file), 'utf-8');
        const entry = JSON.parse(content);
        info.push({
          key: file.replace('.json', ''),
          age: Date.now() - entry.timestamp,
          ttl: entry.ttl,
        });
      } catch {
        // Skip invalid cache files
      }
    }
  }
  
  return info;
}

