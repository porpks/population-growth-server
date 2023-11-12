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
        const data = { totalPopulation: {}, population: {} }

        for (let year = 1950; year <= 2021; year++) {
            // const subData = { year };

            try {
                const result = await db.query("SELECT country_name, population, region FROM population WHERE year = $1 AND region IS NOT NULL ORDER BY population DESC LIMIT 13", [year]);

                data.totalPopulation[year] = result.rows[0].population
                result.rows.shift()
                data.population[year] = result.rows;

                // data.push(subData);
            } catch (error) {
                console.error("Database Error:", error);
                throw error; // Propagate the error to the calling function
            }
        }

        res.json({ data: data })

    })

    app.get('/test', async (req, res) => {
        let year = req.query.year
        let data
        try {
            const result = await db.query("SELECT country_name, population, region FROM population WHERE year = $1 AND region IS NOT NULL ORDER BY population DESC LIMIT 13", [year]);

            data = result.rows;

        } catch (error) {
            console.error("Database Error:", error);
            throw error;
        }

        res.json({ data })
    });


    app.get('*', (req, res) => {
        res.status(404).send('Not found')
    })

    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`)
    })
}

init()