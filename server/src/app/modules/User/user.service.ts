import { Admin, Doctor, Patient, UserRole } from "@prisma/client"
import bcrypt from 'bcrypt'
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../../helpers/fileUploader";
import { IFile } from "../../interfaces/file";
import { Request } from "express";


const createAdmin = async (req: Request): Promise<Admin> => {
    const file = req.file as IFile;
    if (file) {
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

const createDoctor = async (req: Request):Promise<Doctor> => {
    const file = req.file as IFile;
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file)
        req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url

    }
    const hashPassword: string = await bcrypt.hash(req.body.password, 12);


    const userData = {
        email: req.body.doctor.email,
        password: hashPassword,
        role: UserRole.DOCTOR,
    }

    const result = await prisma.$transaction(async (transctionClient) => {
        await transctionClient.user.create({
            data: userData,
        });

        const createdDoctorData = await transctionClient.doctor.create({
            data: req.body.doctor
        });
        return createdDoctorData
    })
    return result
}
const createPatient = async (req: Request):Promise<Patient> => {
    const file= req.file as IFile;
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file)
        req.body.patient.profilePhoto = uploadToCloudinary?.secure_url

    }
    const hashPassword: string = await bcrypt.hash(req.body.password, 12);


    const userData = {
        email: req.body.patient.email,
        password: hashPassword,
        role: UserRole.PATIENT,
    }

    const result = await prisma.$transaction(async (transctionClient) => {
        await transctionClient.user.create({
            data: userData,
        });

        const createdPatientData = await transctionClient.patient.create({
            data: req.body.patient
        });
        return createdPatientData
    })
    return result
}

export const userService = {
    createAdmin,
    createDoctor,
    createPatient
}