import express from 'express'
import NodeFetchCache, { MemoryCache } from 'node-fetch-cache';

const router = express.Router()
const fetch = NodeFetchCache.create({
    cache: new MemoryCache({ ttl: 3600000 }),
    shouldCacheResponse: (response) => response.ok
});

router.route('/:id')
    .get(async (req, res) => {
        const { id } = req.params

        fetch('https://kenkoooo.com/atcoder/resources/problem-models.json')
            .then((response) => response.json())
            .then((response) => {
                res.setHeader('Cache-Control', 'max-age: 3600')
                if (!response[id.toLowerCase()] && !response[id.toUpperCase()]) {
                    res.status(404).send()
                    return
                }

                if (response[id.toLowerCase()]) {
                    res.send(response[id.toLowerCase()])
                } else {
                    res.send(response[id.toUpperCase()])
                }
            }).catch((err) => res.status(500).send())
    })

export default router