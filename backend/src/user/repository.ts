import redis from "../connection/redis"
import {PrismaClient, User} from "@prisma/client";
import {faker} from "@faker-js/faker";
import {UserPrize} from "./model";

const prisma = new PrismaClient();
const CACHE_EXP = 10


const createRandomUser = async () : Promise<User> => {
    const userData = {
        username: faker.internet.username(),
        email: faker.internet.email(),
        name: faker.internet.displayName(),
        lastname: faker.internet.displayName(),
        country: faker.location.countryCode()
    }
    redis.del("users");
    return prisma.user.create({
        data: userData
    });
};


const getUsers = async (): Promise<User[]> => {
    const cache_key = "users"
    const cache_data = await redis.get(cache_key);

    if(cache_data != null) {
        return JSON.parse(cache_data);
    }

    const users =  await prisma.user.findMany();
    await redis.setex(cache_key, CACHE_EXP, JSON.stringify(users));
    return users
};


const getUser     = async (id: Number): Promise<User> => {
    const cache_key = `user#${id}`

    const cache_data = await redis.get(cache_key);

    if(cache_data != null) {
        return JSON.parse(cache_data);
    }

    const user: User =  await prisma.user.findFirstOrThrow({
        where: {
            "id": Number(id)
        }
    })
    await redis.setex(cache_key, CACHE_EXP, JSON.stringify(user));
    return user
}

const earnMoney = async (userId: number, amount: number): Promise<void> => {
    const cache_key = `user#${userId}`
    const cache_key_all = "users"


    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            money: {
                increment: amount
            }
        }
    })

    await redis.del(cache_key);
    await redis.del(cache_key_all);
}

const rewardUsers = async (users: UserPrize[]) => {

    return prisma.$transaction(
        users.map(user => {
            return prisma.user.update({where:{id: user.userId}, data: {money: {increment: user.prize}}})
        })
    )
}


export default {
    createRandomUser,
    getUsers,
    getUser,
    earnMoney,
    rewardUsers,
}
