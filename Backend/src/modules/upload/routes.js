import { Router } from 'express';
import upload from './controller';
import middleware from '../../middlewares/auth-handler';

const multer = require('multer');

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const uploader = multer({ storage });

router.post('/', middleware(), uploader.single('file'), upload);

export default router;
