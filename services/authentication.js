const JWT= require('jsonwebtoken');
const user= require('../models/users');
const secret='mithekarele';

// function createTokenForUser(user){
//     const payload={
//         _id:user._id,
//         email: user.email,
//         profilePicture: user.profilePicture,
//         role: user.role,
//     };
//     const token=JWT.sign(payload,secret);
//     return token;
// }
function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    fullName: user.fullName, // Add this
    email: user.email,
    profilePicture: user.profilePicture,
    role: user.role,
  };
  return JWT.sign(payload, secret);
}

function verifyToken(token){
    const payload=JWT.verify(token, secret);
    return payload;
    }

    module.exports={
        createTokenForUser,
        verifyToken,
    };