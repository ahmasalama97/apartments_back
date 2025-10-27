import { uploadApartmentImage } from './apartmentUpload.js';

export const handleApartmentUpload = (req, res, next) => {
    // If request is not multipart/form-data, skip multer and continue (allow JSON requests)
    const contentType = req.headers['content-type'] || '';
    if (!contentType.startsWith('multipart/form-data')) {
        return next();
    }

    uploadApartmentImage(req, res, (err) => {
        if (err) {
            console.error('Upload error:', err);
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    error: 'File size too large. Maximum size is 5MB'
                });
            }
            if (err.message === 'Not an image! Please upload an image file.') {
                return res.status(400).json({
                    error: 'Please upload only image files'
                });
            }
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({
                    error: 'Wrong field name for image. Please use "image" as the field name',
                    help: 'Make sure your form field for the image is named "image"'
                });
            }
            return res.status(400).json({
                error: err.message
            });
        }
        next();
    });
};