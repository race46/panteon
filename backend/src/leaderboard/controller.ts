import { Request, Response } from "express";
import {sendSuccess, sendCreated, sendServerError} from "../utils/response";
import leaderboardService from "./service"

const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await leaderboardService.getUsers()
        sendSuccess(res, "list of leaderboard users", users);
    } catch (error) {
        console.log(error);
        sendServerError(res, "failed to fetch users", "unexpected error");
    }
};

const getUserLeaderboard = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);
        const users = await leaderboardService.getUserLeaderboard(userId);
        const response = [{
            country: "global",
            leaderboard: users,
        }]
        sendSuccess(res, "list of leaderboard users", response);
    } catch (error) {
        console.log(error);
        sendServerError(res, "failed to fetch users", "unexpected error");
    }
}

const getLeaderboardCountries = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);
        const leaderboards = await leaderboardService.getCountryLeaderboard(userId);
        sendSuccess(res, "list of leaderboard countries", leaderboards);
    } catch (error) {
        console.log(error);
        sendServerError(res, "failed to fetch leaderboard countries", "unexpected error");
    }

}

export default {
    getUsers,
    getUserLeaderboard,
    getLeaderboardCountries
}



