import { v4 as uuidv4 } from 'uuid';


// This function generates a unique name for a given file.
export default function editFileName(_: any, file: Express.Multer.File, callback: (error: Error, filename: string) => void) {
    const randomName = uuidv4() + '-' + file.originalname;
    callback(null, randomName);
}