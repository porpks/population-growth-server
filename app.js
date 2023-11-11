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

        if (!year) {
            res.status(401).json({ message: "plesse input the year" })
            return
        }
        else if (year < 1950 || year > 2021) {
            res.status(404).json({ message: `year ${year} not found` })
            return
        }

        try {
            const data = await db.query("select country_name,population,region from population where year = $1 and region is not null limit 12", [year])

            res.json({ data: data.rows })

        } catch (error) {
            console.error("Database Error:", error);
            res.json({ "Database Error:": error })
        }
    })

    app.get('*', (req, res) => {
        res.status(404).send('Not found')
    })

    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`)
    })
}

init()