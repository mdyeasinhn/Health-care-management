import multer from "multer";
import path from "path";

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'diepqypex',
    api_key: '992165345858327',
    api_secret: 'cCArBANK5gfIS9u-d36zsQ8TgZI' // Click 'View API Keys' above to copy your API secret
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, path.join(process.cwd(), 'uploads'))
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage });



const uploadToCloudinary = async (file: any) => {
    // Upload an image
    cloudinary.uploader
        .upload(
            file.path, {
            public_id: 'shoes',
        },
            function (error, result) { console.log(result); }
        );
}

export const fileUploader = {
    upload,
    uploadToCloudinary
}