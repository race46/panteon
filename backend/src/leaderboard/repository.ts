import redis from "../connection/redis"
import userRepository from "../user/repository"
import {User} from "@prisma/client";
import serializer from "./serializer";
import {LeaderboardCountries, LeaderboardSpecificUser, LeaderboardUser} from "./model";
import {LEADERBOARD_COUNTRIES} from "./constants"

const TOP_USER_LENGTH = 100;
const PREV_NEIGHBOUR_LENGTH = 3;
const NEXT_NEIGHBOUR_LENGTH = 2;
const NEIGHBOUR_LENGTH = PREV_NEIGHBOUR_LENGTH + NEXT_NEIGHBOUR_LENGTH;


const getUsers = async (): Promise<LeaderboardUser[]> => {
    const global_key = "leaderboard_global"

    const result = await redis.zrevrange(global_key, 0, -1, "WITHSCORES");
    const usersPromises = []
    for(let i = 0; i < result.length; i += 2) {
        usersPromises.push(userRepository.getUser(parseInt(result[i])));
    }

    const users = await Promise.all(usersPromises);
    return serializer.leaderboardUsers(users, result, 0)
};

const clearUsers = async (): Promise<[number, string[]]> => {
    const global_key = "leaderboard_global"

    const lua_script = `
        local result = redis.call('ZRANGE', KEYS[1], 0, -1, 'WITHSCORES')
        local total_score = 0
        for i = 2, #result, 2 do
            total_score = total_score + tonumber(result[i])
        end
        local top_users = redis.call('ZREVRANGE', KEYS[1], 0, ${TOP_USER_LENGTH - 1}, 'WITHSCORES')
        redis.call('DEL', KEYS[1])
        for i = 1, #ARGV do
            redis.call('DEL', ARGV[i])
        end
        return {total_score, top_users}
    `;

    const countries = LEADERBOARD_COUNTRIES.map(c => `leaderboard_${c}`);

    // @ts-ignore
    return redis.eval(lua_script, 1, global_key, ...countries)
}


const getSpecificUserLeaderboard = async (userId: number, section: string = 'leaderboard_global'): Promise<LeaderboardSpecificUser> => {

    const lua_script = `
        local user_rank = redis.call('ZREVRANK', KEYS[1], ARGV[1])
        if (user_rank == false) then user_rank = -1 end
        local count = redis.call("ZCARD", KEYS[1])
        
        local next_user_rank = math.min(count, user_rank + ${NEXT_NEIGHBOUR_LENGTH})
        
        if(next_user_rank < ${TOP_USER_LENGTH + NEIGHBOUR_LENGTH + 1}) then
            local top_users = redis.call('ZREVRANGE', KEYS[1], 0, math.max(next_user_rank, ${TOP_USER_LENGTH} - 1), 'WITHSCORES')
            return {top_users, {}, user_rank}
        end
        
        local prev_user_rank = user_rank - ${PREV_NEIGHBOUR_LENGTH}
        local top_users = redis.call('ZREVRANGE', KEYS[1], 0, ${TOP_USER_LENGTH - 1}, 'WITHSCORES')
        local user_with_neighbours = redis.call('ZREVRANGE', KEYS[1], prev_user_rank, next_user_rank, 'WITHSCORES')
        
        return {top_users, user_with_neighbours, user_rank}
    `

    // @ts-ignore
    const [topUsers, userWithNeighbors, userRank] = await redis.eval(lua_script, 1, section, userId);

    const topUsersPromises = []
    const userWithNeighborsPromises = []

    for(let i = 0; i < topUsers.length; i += 2) {
        topUsersPromises.push(userRepository.getUser(parseInt(topUsers[i])));
    }

    for(let i = 0; i < userWithNeighbors.length; i += 2) {
        userWithNeighborsPromises.push(userRepository.getUser(parseInt(userWithNeighbors[i])));
    }

    const [topUsersList, userWithNeighborsList] = await Promise.all([
        Promise.all(topUsersPromises),
        Promise.all(userWithNeighborsPromises)
    ]);

    return serializer.leaderboardUsersSpecificUser(topUsersList, topUsers, userWithNeighborsList, userWithNeighbors, userRank, PREV_NEIGHBOUR_LENGTH)
}

const getCountryLeaderboard = async (userId: number): Promise<LeaderboardCountries[]> => {
    const leaderboardPromises: Promise<LeaderboardSpecificUser>[] = []
    LEADERBOARD_COUNTRIES.forEach((c) => {
        leaderboardPromises.push(getSpecificUserLeaderboard(userId, `leaderboard_${c}`));
    })

    const leaderboardCountries: LeaderboardSpecificUser[] = await Promise.all(leaderboardPromises)

    return serializer.leaderboardWithCountries(leaderboardCountries, LEADERBOARD_COUNTRIES);
}

const updateUserScore = async (user: User, score: number) => {
    const global_key = "leaderboard_global"
    const country_key = `leaderboard_${user.country}`

    const res = await Promise.allSettled([
        redis.zincrby(global_key, score, user.id ),
        redis.zincrby(country_key, score, user.id )
    ]);

    res.forEach(r => {
        if (r.status !== "fulfilled") {
            console.error(r)
        }
    })
}

export default {
    updateUserScore,
    getSpecificUserLeaderboard,
    getUsers,
    clearUsers,
    getCountryLeaderboard
}
