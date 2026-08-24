import dotenv from "dotenv";
dotenv.config();
import Imagekit from "imagekit";

const storageInstance = new Imagekit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const sendFile = async (file, fileName) => {
    let obj = {
        file,
        fileName,
        folderName: "Discord",
    };

    return await storageInstance.upload(obj);
};
