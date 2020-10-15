import express from 'express';
import 'express-async-errors'
import morgan from 'morgan'
import cors from 'cors'
import ErrorHandler from './helpers/ErrorController'
import Returner from './helpers/Returner';
import {createConnection} from 'typeorm'
import routes from './routes'

const app = express()

console.log("Iniciando...")

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

createConnection()

app.use(routes)

app.use(() => {
    Returner.errorCode(404, "Route not found")
})

app.use(ErrorHandler)

export default app