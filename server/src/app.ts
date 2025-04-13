import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors'
import router from './app/routes';
import { StatusCodes } from 'http-status-codes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';


const app: Application = express();

app.use(cors());
// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get('/', (req: Request, res: Response) => {
    res.send({
        message: "Health care server"
    })
});


// Application routes
app.use('/api/v1', router);

// Global Error Handler
app.use(globalErrorHandler);

app.use( (req: Request, res: Response, next : NextFunction) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Route not found',
        error : {
            path : req.originalUrl,
            message : "Your requested method is not found"
        }
    })
})

export default app;

