import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { version } from '../package.json'

const app = express()
const port = 8080

app.use(express.json())
app.use(cors())

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000,
    message: "Too many requests, please try again later."
}))

app.get('/', (req, res) => {
    res.send({
        timestamp: new Date().toISOString(),
        version: version
    })
})

app.use('/contest', require(`./routes/contest`).default)

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
