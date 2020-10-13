import { createView } from ".";
import ImageModel from '../models/Image'

const Image = createView<ImageModel>(function(obj) {
    const {
        path,
        id
    } = obj
    return {
        id,
        url: `/static/${path}`
    }
})

export default Image