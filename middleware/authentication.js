const {verifyToken} = require('../services/authentication');

// function checkForAuthenticationCookie(CookieName){
//     return (req,res,next)=>{
//         const tokencookieValue = req.cookies[CookieName];
//         if (!tokencookieValue) {
//           return next();
//         }

//         try{
//         const userpayload= validateToken(tokencookieValue);
//         req.user = userpayload;
//         }catch{}
//         return next();
//     }
// }
function checkForAuthenticationCookie(CookieName) {
  return (req, res, next) => {
    const tokencookieValue = req.cookies[CookieName];
    if (!tokencookieValue) return next();

    try {
      const userpayload = verifyToken(tokencookieValue);
      req.user = userpayload;
      res.locals.user = userpayload; // Make user available in all templates
    } catch (err) {
      console.error("Token error:", err); // Debugging
    }
    return next();
  };
}

module.exports={
    checkForAuthenticationCookie,
};