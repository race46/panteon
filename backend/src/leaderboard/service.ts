import leaderboardRepo from "./repository"
import userRepo from "../user/repository"


const getUsers = async () => {
    return leaderboardRepo.getUsers()
};

const getUserLeaderboard = (userId: number) => {
    return leaderboardRepo.getSpecificUserLeaderboard(userId)
}

const updateScore = async (userId: number, score: number) => {
    const user = await userRepo.getUser(userId)
    return leaderboardRepo.updateUserScore(user, score)
}

const getCountryLeaderboard = async (userId: number) => {
    return leaderboardRepo.getCountryLeaderboard(userId)
}

export default {
    getUsers,
    getUserLeaderboard,
    updateScore,
    getCountryLeaderboard
}
