
import express from 'express'
import { userRoutes } from '../modules/User/user.routes';
import { adminRoutes } from '../modules/Admin/admin.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { SpecialtiesRoutes } from '../modules/Specialties/specialties.route';
import { DoctorRoutes } from '../modules/Doctor/doctor.route';
import { PatientRoutes } from '../modules/Patient/paitent.route';
const router = express.Router();


const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/admin',
        route: adminRoutes
    },
    {
        path: '/doctor',
        route: DoctorRoutes
    },
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/specialties',
        route: SpecialtiesRoutes
    },
    {
        path: '/patient',
        route: PatientRoutes
    },
]

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;