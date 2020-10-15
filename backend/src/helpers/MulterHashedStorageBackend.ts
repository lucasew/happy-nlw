import mkdirp from 'mkdirp';
import multer from 'multer';
import {createHash, randomBytes} from 'crypto';
import {promisify} from 'util';
import {join} from 'path';
import fs from 'fs';

class MulterHashedStorageBackend implements multer.StorageEngine {
    private basePath: string;

    constructor(basePath: string) {
        mkdirp(basePath)
        this.basePath = basePath;
    }

    appendFileToBase(filename: string) {
        return join(this.basePath, filename)
    }

    async _handleFile(req: Express.Request, file: Express.Multer.File, cb: (error?: any, info?: Partial<Express.Multer.File>) => void) {
        try {
            const tempName = await promisify(randomBytes)(64).then(b => b.toString('hex'))
            const tempFileName = this.appendFileToBase(tempName)
            const tempFile = fs.createWriteStream(tempFileName)
            const hasher = createHash('sha256')
            file.stream.pipe(tempFile)
            file.stream.pipe(hasher)
            await new Promise((resolve, reject) => {
                file.stream.on('error', reject)
                file.stream.on('end', resolve)
            })
            const hash = hasher.digest('hex')
            const bytesWritten = tempFile.bytesWritten
            tempFile.close()
            const extension = file.originalname.split('.').pop()
            const newFileName = this.appendFileToBase(`${hash}.${extension}`)
            await promisify(fs.rename)(tempFileName, newFileName)
            cb(null, {
                path: newFileName,
                size: bytesWritten
            })
        } catch (e) {
            cb(e)
        }
    }

    async _removeFile(req: Express.Request, file: Express.Multer.File, cb: (error?: any, info?: Partial<Express.Multer.File>) => void) {
        fs.unlink(file.path, cb)
    }
}

export default MulterHashedStorageBackend

