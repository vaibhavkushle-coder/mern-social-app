const jwt = require("jsonwebtoken");

const authMiddleware = (req,res,next)=>{

    const token = req.headers.authorization;

    if(!token){

        return res.status(404).json({
            message:"Access denied"
        });
    }

    const decoded = jwt.verify(

        token,
        process.env.JWT_SECRET

    );

    req.user = decoded;

    next();
}

module.exports = authMiddleware;