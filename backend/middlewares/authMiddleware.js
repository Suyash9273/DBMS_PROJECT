import jwt from 'jsonwebtoken';
import {User} from '../models/index.js';

/**
 * @desc Middleware for logged-in users
 * @access Private
 */
const protect = async (req, res, next) => {
    let token;
    //Read the jwt from jwt cookie
    token = req.cookies.jwt;

    if(token) {
        try {
            // 2. Verify the token using jwt_secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            //3. Find the user from token->userId and exclude the password for security
            req.user = await User.findByPk(decoded.userId, {
                attributes: {exclude: ['password_hash']}
            }); // adding user field to req object

            // 4. Call the next middleware or controller
            next();
        } catch (error) {
            console.error(error);
            res.status(401); //Unauthorized
            throw new Error('Not authorized, token failed');
        }
    }
    else{
        res.status(401);
        throw new Error('Not Authorized, no token');
    }
}

/**
 * @desc Middleware to verify Admin
 * @access Private(Admin Only)
 */

const admin = (req, res, next) => {
    //This middleware will run only after the protect one because it relies on 'req.user' being set We will add an 'isAdmin' field to our User model later. For now let's just check if user's name is admin
    //temporary soln for testing: -> 
    if(req.user && req.user.name === 'Admin') {
        next();
    }
    else {
        res.status(401); //Unauthorized
        throw new Error('Not authorized as an admin')
    }
}

export {protect, admin}