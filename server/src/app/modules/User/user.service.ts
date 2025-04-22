import { UserRole } from "@prisma/client"
import bcrypt from 'bcrypt'
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../../helpers/fileUploader";
import { IFile } from "../../interfaces/file";


const createAdmin = async (req: any, ) => {
     const file:IFile = req.file;
     if(file){
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file)
       req.body.admin.profilePhoto = uploadToCloudinary?.secure_url 
 
     }
    const hashPassword: string = await bcrypt.hash(req.body.password, 12);


    const userData = {
        email: req.body.admin.email,
        password: hashPassword,
        role: UserRole.ADMIN,
    }

    const result = await prisma.$transaction(async (transctionClient) => {
        await transctionClient.user.create({
            data: userData,
        });

        const createdAdminData = await transctionClient.admin.create({
            data: req.body.admin
        });
        return createdAdminData
    })
    return result
}

export const userService = {
    createAdmin
}