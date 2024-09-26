import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';

export const signup = async (req, res) => {


    const { email, password, name } = req.body;

    console.log(req.body);


    try {

        if (!email || !password || !name) {
            throw new Error("All fields are required");
        }

        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(200).json({
                success: false,
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(10000 + Math.random() * 90000).toString()
        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        })

        await user.save()

        //jwt
        generateTokenAndSetCookie(res, user._id);

        res.status(200).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })





    } catch (error) {


        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}