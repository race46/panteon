import {User} from "@prisma/client";
import {LeaderboardSpecificUser, LeaderboardUser} from "./model";

const leaderboardUsers = (users: User[], scores: string[], rankStart: number): LeaderboardUser[] => {
    const leaderboardUsers: LeaderboardUser[] = [];

    for(let i = 0; i < users.length; i++) {
        const leaderboardUser: LeaderboardUser = {
            country: users[i].country,
            username: users[i].username,
            money: parseInt(scores[i * 2 + 1]),
            rank: rankStart + i + 1,
        }

        leaderboardUsers.push(leaderboardUser);
    }
    return leaderboardUsers;
}

const leaderboardUsersSpecificUser = (topUsers: User[], topScores: string[], neighbourUsers: User[], neighbourScores: string[], userRank: number, prevNeighbourLength: number): LeaderboardSpecificUser => {
    return {
        top_users: leaderboardUsers(topUsers, topScores, 0),
        neighbour_users: leaderboardUsers(neighbourUsers, neighbourScores, userRank - prevNeighbourLength),
        user_rank: userRank + 1
    };
}

const leaderboardWithCountries = (leaderboards: LeaderboardSpecificUser[], countries: string[]) => {
    const result = []

    for(let i = 0; i < countries.length; i++) {
        if(leaderboards[i].top_users.length){
            result.push({
                country: countries[i],
                leaderboard: leaderboards[i]
            })
        }
    }

    return result;
}

export default {
    leaderboardUsers,
    leaderboardUsersSpecificUser,
    leaderboardWithCountries
}
