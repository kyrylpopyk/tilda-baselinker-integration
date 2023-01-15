import { NextFunction } from "express";
import { Request, Response } from "express-serve-static-core";

export default function errorHandler(error: Error, _: Request, res: Response, next: NextFunction) {
    const errorMessage: string = error.message || "Error! Something went wrong on the server."
    res.status(500).send(errorMessage);
}