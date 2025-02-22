import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

const uploadOnCloudinary = async function (filePath) {
    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    try {
        if (!filePath) {
            return null
        }

        const response = await cloudinary.uploader.upload(
            filePath,
            {
                resource_type: "auto",
            }
        )
        console.log(`File uploaded on cloudinary, src: ${response.url}`);
        
        fs.unlinkSync(filePath)
        return response
    } catch (err) {
        console.log("clouderny error:", err);
        
        fs.unlinkSync(filePath)
        return null
    }   
}

const deleteFromCloudinary = async function (publicId) {
    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    try {
        const result = await cloudinary.uploader.destroy(publicId)
        console.log("Success delete cloudinary", publicId);
        return result
    } catch (err) {
        console.log("Error delete cloudinary:", err);
        return null
    }
}

export { uploadOnCloudinary, deleteFromCloudinary }