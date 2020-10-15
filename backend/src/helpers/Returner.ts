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
    assertSchema(request: express.Request, schema: Record<string, Joi.Schema>) {
        const that = this
        let reexportedValue: Record<string,any> = {}
        Object.keys(schema).map(key => {
            const castRequest = request as Record<string, any>
            const {error, value} = schema[key].validate(castRequest[key])
            reexportedValue[key] = value
            if (error !== undefined) {
                that.badRequest(`bad request in ${key}: ${error}`)
            }
        })
        return reexportedValue
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
