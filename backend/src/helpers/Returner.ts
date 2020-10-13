import Joi from 'joi'
import express from 'express'

interface RequestSchema {
    body?: Joi.Schema
    params?: Joi.Schema
}

const Returner = {
    json(data: any, customStatus?: number) {
        let status = customStatus ? customStatus : 200
        throw {
            data,
            status
        }
    },
    errorString(message: string) {
        throw {
            message
        }
    },
    badRequest(message: string) {
        throw {
            status: 400,
            message
        }
    },
    errorCode(code: number, message: string) {
        throw {
            status: code,
            message
        }
    },
    assertSchema(request: express.Request, schema: RequestSchema) {
        if (schema.body !== undefined) {
            const {error} = schema.body.validate(request.body)
            if (error !== undefined) {
                this.badRequest(`bad request in body: ${error}`)
            }
        }
        if (schema.params !== undefined) {
            const {error} = schema.params.validate(request.params)
            if (error !== undefined) {
                this.badRequest(`bad request in params: ${error}`)
            }
        }
    },
    assertCondition(fn: () => boolean, message: string, code?: number) {
        const result = Promise.resolve(fn())
        if (!result) {
            const status = code ? code : 500
            this.errorCode(status, message)
        }
    }
}

export default Returner