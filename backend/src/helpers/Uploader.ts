import multer from 'multer';
import {join} from 'path'
import MulterHashedStorageBackend from './MulterHashedStorageBackend';

const uploader = multer({
    storage: new MulterHashedStorageBackend(join(__dirname, '..','..', 'data', 'uploads'))
})

export default uploader
