const jwt = require('jsonwebtoken');
const secret = "1234";

const generatetoken = (user) => {
    const payload = {
        _id: user._id,
        name: user.name, // Add name
        lastname: user.lastname, // Add lastname
        email: user.email,
        profileImage: user.profileImage,
    }
    const token = jwt.sign(payload, secret, { expiresIn: '7d' });
    return token;
}
const requireAuth = (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) return res.redirect('/user/signin');
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return res.redirect('/user/signin');
            }
            req.user = decoded;
            next();
        });
    } catch (error) {
        return res.redirect('/user/signin');
    }
}
module.exports = { generatetoken, requireAuth ,secret }