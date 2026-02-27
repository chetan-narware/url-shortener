import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser,findByEmail } from "./auth.repository.js";

const JWT_SECRET = process.env.JWT_SECRET as string;

if(!JWT_SECRET){
    throw new Error("JWT_SECRET s not defined in enviroment variables");
}

export const registerUser = async (email: string, password: string) => {
    const existingUser = await findByEmail(email); // check if user already exists
    if(existingUser){
        throw new Error("User with email already exists");
    }
    
    const passwordHash = await bycrypt.hash(password, 10); // hash the password
    const user = await createUser(email, passwordHash); // create user in database
    return {
        id: user.id,
        email: user.email,
    };
};

export const loginUser = async (email: string, password: string) => {
    const user = await findByEmail(email); // find user by  mail
    if(!user){
        throw new Error("Invalid email or password");
    }

    const isValid = await bycrypt.compare(
        password,
        user.passwordHash
    );

    if(!isValid){
         throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    return token;
}
