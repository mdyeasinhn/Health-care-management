
import express from 'express'
import { userRoutes } from '../modules/User/user.routes';
import { adminRoutes } from '../modules/Admin/admin.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { SpecialtiesRoutes } from '../modules/Specialties/specialties.route';
const router = express.Router();


const moduleRoutes =[
    {
        path : '/user',
        route : userRoutes
    },
    {
        path : '/admin',
        route : adminRoutes
    },
    {
        path : '/auth',
        route : AuthRoutes
    },
    {
        path : '/specialties',
        route : SpecialtiesRoutes
    },
]

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;