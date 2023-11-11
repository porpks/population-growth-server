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
        // let year = req.query.year
        const data = []

        for (let year = 1950; year <= 2021; year++) {
            const subdata = {}

            try {
                subdata.year = year

                const totalResult = await db.query("select population from population where year = $1 and country_name = $2", [year, 'World'])
                subdata.totalPopulation = totalResult.rows[0].population

                const result = await db.query("select country_name,population,region from population where year = $1 and region is not null order by population desc limit 12", [year])
                subdata.population = result.rows

                data.push(subdata);

            } catch (error) {
                console.error("Database Error:", error);
                res.json({ "Database Error:": error })
            }
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