import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
export const signup = async (req, res) => {
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
        return res.status(400).json({ message: 'All fields are required' });
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
        console.log(error);
        res.json(error);
    }
} 