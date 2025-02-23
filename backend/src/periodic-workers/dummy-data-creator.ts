import cron from 'node-cron';
import userRepo from "../user/repository"
import {User} from "@prisma/client";
import userService from "../user/service"
import {randomInt} from "node:crypto";

const schedule = cron.schedule('* * * * *', async () => {
    const users = await userRepo.getUsers();
    users.forEach((user: User) => {
        userService.earnMoney(user.id, randomInt(0, 1000));
    })

});

export default schedule;
