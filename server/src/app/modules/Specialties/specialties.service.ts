import { Request } from "express"
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";

const insertIntoDB= async(req:Request) =>{
    const file = req.file;
    if(file){
        const updloadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.icon = updloadToCloudinary?.secure_url
    }

    const result = await prisma.specialties.create({
        data : req.body
    })
    return result;
}

export const SpecialtiesServices ={
    insertIntoDB,
}