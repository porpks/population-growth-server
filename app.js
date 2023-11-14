import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import { db } from './utils/db.js'

dotenv.config()

async function init() {
    const app = express()
    const port = process.env.PORT || 4000

    app.use(cors())
    app.use(bodyParser.json())

    app.get('/', async (req, res) => {
        let year = req.query.year
        let region = req.query.region
        if (!year) {
            res.status(401).json({ message: `please request with parameter 'year'` })
            return
        }
        if (!region) {
            res.status(401).json({ message: `please request with parameter 'region'` })
            return
        }

        region = 'World,' + region
        const regionString = region.split(',').map(region => `'${region}'`).join(',')

        let data
        try {
            const result = await db.query(`SELECT country_name, population, region FROM population WHERE year = ${year} AND region IN (${regionString}) ORDER BY population DESC LIMIT 13`);
            data = result.rows;

        } catch (error) {
            console.error("Database Error:", error);
            throw error;
        }

        res.json({ data })

    })

    app.get('*', (req, res) => {
        res.status(404).send('Not found')
    })

    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`)
    })
}

init()