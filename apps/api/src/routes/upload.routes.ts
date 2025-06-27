import { Router } from 'express';
import { upload, uploadImage, uploadMultipleImages, deleteImage, getUploadedImages } from '../controllers/upload.controller';

const router = Router();

// Get list of uploaded images
router.get('/images', getUploadedImages);

// Single image upload
router.post('/image', upload.single('image'), uploadImage);

// Multiple images upload
router.post('/images', upload.array('images', 10), uploadMultipleImages);

// Delete image
router.delete('/image/:filename', deleteImage);

export default router; 