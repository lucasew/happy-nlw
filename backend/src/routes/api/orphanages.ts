import Joi from 'joi'
import {getRepository} from 'typeorm'
import Returner from '../../helpers/Returner'
import ControllerToRouter, { ExpressHandler } from '../../helpers/ControllerToRouter'

import OrphanageModel from '../../models/Orphanage'
import OrphanageView from '../../views/Orphanage'
import uploader from '../../helpers/Uploader'
import {basename} from 'path'

const createRequestValidator = {
    body: Joi.object({
        name: Joi.string(),
        latitude: Joi.number(),
        longitude: Joi.number(),
        about: Joi.string(),
        instructions: Joi.string(),
        opening_hours: Joi.string(),
        open_on_weekends: Joi.boolean(),
        images: Joi.any().strip()
    })
}

const paramsIdRequestValidator = {
    params: Joi.object({
        id: Joi.number().integer().positive()
    })
}

export default ControllerToRouter({
    create: [
        uploader.array('images') as ExpressHandler,
        async (request, response) => {
            const reexportedData = Returner.assertSchema(request, createRequestValidator)    
            console.log(reexportedData)
            if (request.files.length == 0) {
                Returner.errorCode(400, "bad request: add at least one image")
            }
            const orphanagesRepository = getRepository(OrphanageModel)
            const files = request.files as Express.Multer.File[]
            const images = files.map(file => {
                return {
                    path: basename(file.path)
                }
            })
            const orphanage = orphanagesRepository.create({
                ...reexportedData.body,
                images
            })
            const result = await orphanagesRepository.save(orphanage) as unknown as OrphanageModel
            const viewResult = OrphanageView.render(result)
            Returner.json(viewResult, 201)
        }
    ],
    list: [
        async (request, response) => {
            const orphanagesRepository = getRepository(OrphanageModel)
            const orphanages = await orphanagesRepository.find({
                relations: ['images']
            })
            const viewedOrphanages = OrphanageView.renderMany(orphanages)
            Returner.json(viewedOrphanages)
        }
    ],
    index: [
        async (request, response) => {
            Returner.assertSchema(request, paramsIdRequestValidator)
            const {id} = request.params
            const orphanagesRepository = getRepository(OrphanageModel)
            const orphanage = await orphanagesRepository.findOneOrFail(id, {
                relations: ['images']
            })
                .catch(() => Returner.errorCode(404, "not found"))
            const viewedOrphanage = OrphanageView.render(orphanage)
            Returner.json(viewedOrphanage)
        }
    ]
})
