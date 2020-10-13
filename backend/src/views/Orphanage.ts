import OrphanageModel from '../models/Orphanage'
import ImageView from './Image'
import {createView} from './index'

const Orphanage = createView<OrphanageModel>(function (obj) {
    const {
        id,
        name,
        latitude,
        longitude,
        about,
        instructions,
        opening_hours,
        open_on_weekends,
        images
    } = obj
    return {
        id,
        name,
        latitude,
        longitude,
        about,
        instructions,
        opening_hours,
        open_on_weekends,
        images: ImageView.renderMany(images)
    }
})

export default Orphanage