import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { parse } from 'path';

export const storage = diskStorage({
  destination: './upload',
  filename: (req, file: any | undefined, cb) => {
    const filename: string = uuidv4();
    const ext: string = parse(file.originalname).ext;
    cb(null, `${filename}${ext}`);
  },
});
