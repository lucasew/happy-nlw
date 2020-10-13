import express from 'express'

export type ExpressHandler = (request: express.Request, response: express.Response) => Promise<void>
export type ControllerInput = {
    index?: ExpressHandler[],
    create?: ExpressHandler[],
    delete?: ExpressHandler[],
    list?: ExpressHandler[]
}

function ControllerToRouter(input: ControllerInput) {
    const router = express.Router()
    if (input.create) {
        router.post("/", ...input.create)
    }
    if (input.delete) {
        router.delete("/:id", ...input.delete)
    }
    if (input.index) {
        router.get("/:id", ...input.index)
    }
    if (input.list) {
        router.get("/", ...input.list)
    }
    return router
}

export default ControllerToRouter