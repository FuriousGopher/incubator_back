import {Request, Response} from "express";
import {body, validationResult, Meta} from "express-validator";

const Body = body("Authorization")

const validaterFunctioin = (value: any, { req, location, path }: Meta) => {
    const encoded = req.headers?.authorization.split(" ")[1];
    if (!encoded) {
        throw new Error("Invalid authorization header format");
    }
    const decoded = Buffer.from(encoded, "base64").toString("utf-8");
    const [username, password] = decoded.split(":");
    if (username !== "admin" || password !== "qwerty") {
        throw new Error("Invalid username or password");
    }
    return true;
}
export const loginValidationRules = [
        body()
        .notEmpty()
        .withMessage("Authorization header is required")
        .bail()
        .custom(validaterFunctioin)
];
export const validateLogin = (
    req: Request,
    res: Response,
    next: any
) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = errors.array().map((error) => error.msg);
    return res.status(401).json({
        errors: extractedErrors,
    });
};