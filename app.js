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
            const subData = { year };

            try {
                const result = await db.query("SELECT country_name, population, region FROM population WHERE year = $1 AND region IS NOT NULL ORDER BY population DESC LIMIT 13", [year]);

                subData.totalPopulation = result.rows[0].population
                result.rows.shift()
                subData.population = result.rows;

                data.push(subData);
            } catch (error) {
                console.error("Database Error:", error);
                throw error; // Propagate the error to the calling function
            }
        }

        res.json({ data })

    })

    // app.get('/', async (req, res) => {
    //     try {
    //         const data = await fetchDataFromDatabase();
    //         res.json({ data });
    //     } catch (error) {
    //         console.error("Database Error:", error);
    //         res.json({ "Database Error:": error });
    //     }
    // });

    // async function fetchDataFromDatabase() {
    //     const data = [];

    //     for (let year = 1950; year <= 2021; year++) {
    //         const subData = { year };

    //         try {
    //             const result = await db.query("SELECT country_name, population, region FROM population WHERE year = $1 AND region IS NOT NULL ORDER BY population DESC LIMIT 13", [year]);

    //             subData.totalPopulation = result.rows[0].population
    //             result.rows.shift()
    //             subData.population = result.rows;

    //             data.push(subData);
    //         } catch (error) {
    //             console.error("Database Error:", error);
    //             throw error; // Propagate the error to the calling function
    //         }
    //     }

    //     return data;
    // }


    app.get('*', (req, res) => {
        res.status(404).send('Not found')
    })

    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`)
    })
}

init()