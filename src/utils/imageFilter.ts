import { HttpException } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common/enums";

export default function imageFilter(req, file : Express.Multer.File, cb : (error : HttpException, acceptFile : boolean) => void) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: 'Only image files are allowed!',
        }, 400), false);
    }
    cb(null, true);
};
