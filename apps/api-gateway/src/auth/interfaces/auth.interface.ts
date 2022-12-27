import { Request } from "express";
import { User } from "@microservices-demo/shared/entities";

export interface RequestWithUser extends Request {
    user: User;
}