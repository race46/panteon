
export interface LeaderboardUser {
    country: string,
    money: number,
    username: string,
    rank: number;
}

export interface LeaderboardSpecificUser {
    top_users: LeaderboardUser[];
    neighbour_users: LeaderboardUser[];
    user_rank: number;
}

export interface LeaderboardCountries {
    country: string,
    leaderboard: LeaderboardSpecificUser,
}
