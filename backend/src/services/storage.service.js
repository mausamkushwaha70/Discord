import dotenv from "dotenv";
config.dotenv();
import Imagekit from "imagekit";

const storageInstance = new Imagekit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privatekey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndPoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const sendFile = async (file, fileName) => {
    let obj = {
        file,
        fileName,
        folderName: "Discord",
    };

    return storageInstance.upload(obj);
};
