import jwt from 'jsonwebtoken';

// this will sign a new jwt token, hence generator
const generateToken = (res, userId) => {
    // creating the token with the userId as the payload
    const token = jwt.sign({userId: userId}, process.env.JWT_SECRET, {
        expiresIn: '20d'
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',//we use secure cookies in connection
        sameSite: 'strict',
        maxAge: 20*24*60*60*1000
    });
}

export default generateToken;