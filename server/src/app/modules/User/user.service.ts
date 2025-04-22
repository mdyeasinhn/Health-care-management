import { UserRole } from "@prisma/client"
import bcrypt from 'bcrypt'
import prisma from "../../../shared/prisma";
import { Request } from "express";
import { fileUploader } from "../../../helpers/fileUploader";


const createAdmin = async (req: any, ) => {

    //     console.log("file->",req.file)
    // console.log("data->",req.body.data)

     const file = req.file;
     if(file){
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file)
       req.body.data.profilePhoto = uploadToCloudinary?.secure_url 
       console.log(req.body.data)
     }
    // const hashPassword: string = await bcrypt.hash(data.password, 12);


    // const userData = {
    //     email: data.admin.email,
    //     password: hashPassword,
    //     role: UserRole.ADMIN,
    // }

    // const result = await prisma.$transaction(async (transctionClient) => {
    //     await transctionClient.user.create({
    //         data: userData,
    //     });

    //     const createdAdminData = await transctionClient.admin.create({
    //         data: data.admin
    //     });
    //     return createdAdminData
    // })
    // return result
}

export const userService = {
    createAdmin
}