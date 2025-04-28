import { Request } from "express"
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";
import { IFile } from "../../interfaces/file";
import { Specialties } from "@prisma/client";

const insertIntoDB= async(req:Request) =>{
    const file = req.file as IFile;
    if(file){
        const updloadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.icon = updloadToCloudinary?.secure_url
    }

    const result = await prisma.specialties.create({
        data : req.body
    })
    return result;
};


const getAllFromDB = async (): Promise<Specialties[]> => {
    return await prisma.specialties.findMany();
}

export const SpecialtiesService ={
    insertIntoDB,
    getAllFromDB
}

