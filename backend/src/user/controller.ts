import { Request, Response } from "express";
import userService from "./service";
import {sendSuccess, sendCreated, sendServerError} from "../utils/response";
import {User} from "./model";

const getUsers = async (req: Request, res: Response) => {
    try {
        const users: User[] = await userService.getUsers();
        sendSuccess(res, "list of users", users);
    } catch (error) {
        sendServerError(res, "failed to fetch users", "unexpected error");
    }
};

const createUser = async (req: Request, res: Response) => {
    try {
        const user: User = await userService.createRandomUser()
        sendCreated(res, "user created", user);
    } catch (error) {
        sendServerError(res, "failed to create user", "unexpected error");
    }
};

export default {
    getUsers,
    createUser,
}
