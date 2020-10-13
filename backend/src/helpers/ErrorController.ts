import {ErrorRequestHandler} from 'express';

const handler: ErrorRequestHandler = (err, request, response, next) => {
    let {status, message, data, joi} = err
    if (joi !== undefined) {
        return response.status(400).json({
            error: joi
        })
    }
    if (message !== undefined) {
        console.error(err)
        if (status === undefined) {
            status = 500
        }
        return response.status(status).json({
            error: message
        })
    }
    if (data !== undefined) {
        if (status === undefined) {
            status = 200
        }
        return response.status(status).json({
            data
        })
    }
}

export default handler