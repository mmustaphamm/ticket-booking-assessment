// import * as jwt from "jsonwebtoken"
// import fileLogger from "../common/logging/error-logger"
// // import Config from "../config"

// const { JWT: { secret, subject, issuer, expires } } = Config

// const generateToken = (data: Record<string,any>) => {
//     try {
//         const {id , email, phone} = data
//         const token = jwt.sign({
//             id,
//             email,
//             phone
//         }, secret, {
//             issuer: issuer,
//             expiresIn: expires,
//             algorithm: "HS512",
//             subject: subject
//         });
//         return token
//     } catch (error: any) {
//         console.log(error)
//         fileLogger.log({
//             message: error.message,
//             level : "error"
//         })
//     }
// }

// export default generateToken
