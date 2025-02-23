import userRepo from "./repository"
import leaderboardRepo from "../leaderboard/repository";
import {User} from "@prisma/client";

const createRandomUser = async () : Promise<User> => {
    return userRepo.createRandomUser()
};


const getUsers = async (): Promise<User[]> => {
    return userRepo.getUsers()
};

const earnMoney = async (userId: number, money: number): Promise<void> => {
   await userRepo.earnMoney(userId, money);
   const user = await userRepo.getUser(userId);
   await leaderboardRepo.updateUserScore(user, money)
}


export default {
    createRandomUser,
    getUsers,
    earnMoney
}
