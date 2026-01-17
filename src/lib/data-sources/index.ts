/**
 * Data Sources Index
 * 
 * Unified interface for all external data sources
 */

// API-Football (MLS stats, standings, fixtures)
export * from './api-football';

// Transfermarkt (player valuations)
export * from './transfermarkt';

// MLS Salaries (MLSPA data)
export * from './mls-salaries';

// Re-export cache utilities
export { getCached, setCache, clearCache, getCacheInfo } from '../cache/file-cache';

