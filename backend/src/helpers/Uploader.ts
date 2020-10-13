import { request } from 'express';
import multer from 'multer';
import path from 'path'
import {createHash} from 'crypto'

const multerConfig  = {
    storage: multer.diskStorage({
        destination: path.join(__dirname, '..','..', 'data', 'uploads'),
        filename: (request, file, cb) => {
            const hasher = createHash('sha256')
            const extension = file.originalname.split('.').pop()
            file.stream.pipe(hasher)
            const hash = hasher.digest('hex')
            const filename = `${hash}.${extension}`
            cb(null, filename)
        }
    })
}

const uploader = multer(multerConfig)

export default uploader