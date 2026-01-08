import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret});
});

const uploadOnCloudinary = async (filePath, folderName) => {
    try {
        if (!localFilePath) return null;

        // Upload file to Cloudinary
        const responce = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto",
        });
        // file has been uploaded sucessfully
        console.log("File uploaded to Cloudinary:", responce.url);
        return responce.url;
    }
    catch (error) {
        fs.unlinkSync(localFilePath); // remove file from server if upload fails
        return null
        
    }

};


export { uploadOnCloudinary };