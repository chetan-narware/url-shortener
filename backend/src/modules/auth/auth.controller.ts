import {Request, Response, NextFunction} from "express";
import { registerUser, loginUser } from "./auth.service.js";

export const registerHandler = async (
    req : Request,
    res : Response,
    next: NextFunction
) => {
    try{
        const {email,password} = req.body; // get email password from HTTP request Body
        const user = registerUser(email,password); // register user using email password
        res.status(201).json({
            success : true,
            message: "User Registered Successfully",
            data : user,
        });
    } catch (error){
        next(error); //In Express, next is a function that passes control to the next middleware. global error middleware
    }
}

export const longinHandler = async (
    req : Request,
    res : Response,
    next: NextFunction
) => {
    try{
        const {email,password} = req.body;
        const token = await loginUser(email,password);
        res.status(200).json({
            success: true,
            token,
        });
    }catch (error){
        next(error);
    }
};