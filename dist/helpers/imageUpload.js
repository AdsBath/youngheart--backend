"use strict";
// import fs from 'fs';
// import multer from 'multer';
// const storage = multer.diskStorage({
//   destination: 'uploads',
//   filename: function (req, file, cb) {
//     // Extract the file extension
//     const ext = file.originalname.split('.').pop();
//     // Generate a unique filename using the current timestamp and a random number
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     // Construct the unique filename by combining the original filename, a dash, and the unique suffix
//     const filename =
//       file.originalname.replace('.' + ext, '') + '-' + uniqueSuffix + '.' + ext;
//     cb(null, filename);
//     // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     // cb(null, file.originalname + '-' + uniqueSuffix);
//   },
// });
// export const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1000000, // 1MB
//   },
//   fileFilter(req, file, callback) {
//     const allowedFileTypes = ['image/jpeg', 'image/png']; // Add more types if needed
//     if (!allowedFileTypes.includes(file.mimetype)) {
//       // Reject file upload
//       callback(new Error('Only JPEG and PNG files are allowed'));
//     } else {
//       // Accept file upload
//       callback(null, true);
//     }
//   },
// });
// // Function to remove an image file
// const removeImage = (filePath: fs.PathLike) => {
//   fs.unlink(filePath, err => {
//     if (err) {
//       console.error('Error deleting image:', err);
//     } else {
//       console.log('Image deleted successfully');
//     }
//   });
// };
// export { removeImage };
