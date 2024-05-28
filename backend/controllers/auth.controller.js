import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
export const signup = async (req, res, next) => {
    console.log(req.body);
    console.log(typeof(req.body));
    console.log(req.body.username);
    const {username, email, password} = req.body;
    console.log("username: ", username);
    console.log("email: ", email);
    console.log("password: ", password);
    if (
        !username ||
        !email ||
        !password ||
        username.trim() === '' ||
        email.trim() === '' ||
        password.trim() == ''
    ) {
        // return res.status(400).json({ message: 'All fields are required' });

        //When an error occurs in the signup function (for example, when a required field is missing), it calls next(error).

        //convention: When a function calls next with an argument, Express interprets the argument as an error. If no argument is provided, Express continues to the next middleware function without considering it an error.
        //When next is called with an argument (in this case, an error generated by errorHandler), Express recognizes that an error has occurred within the signup function. It then looks for the next middleware function that takes four parameters (err, req, res, next) to handle errors.
        next(errorHandler(400, 'All fields are required'));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
        //username: username
        username,
        email,
        password: hashedPassword,
    });

    //try to create a new user using the credentials passed.
    //in case of any error such as duplicate usernames/email, throw an  error. 
    try {
        await newUser.save();
        res.json("signup successful");
    } catch (error) {
        next(error);
    }
} 