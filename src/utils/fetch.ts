import NodeFetchCache, { MemoryCache } from 'node-fetch-cache';

export const fetch = NodeFetchCache.create({
    cache: new MemoryCache({ ttl: 3600000 }),
    shouldCacheResponse: (response) => response.ok
});