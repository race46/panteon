import cron from 'node-cron';
import leaderboardRepo from "../leaderboard/repository";
import userRepo from "../user/repository";
import {UserPrize} from "../user/model";

const calculatePrizes = (N: number, totalScore: number): number[] => {
    const firstPrize = Math.round(totalScore * 0.2)
    const secondPrize = Math.round(totalScore * 0.15)
    const thirdPrize = Math.round(totalScore * 0.1)

    let remainingPrize = totalScore - firstPrize - secondPrize - thirdPrize;
    const prizes: number[] = [firstPrize, secondPrize, thirdPrize]

    let totalCoefficient = (N - 3) * (1 + N - 3) / 2;

    for (let i = 3; i < N; i++) {
        const prize = Math.round((N - 3 - i) / totalCoefficient * remainingPrize);
        if(prize > remainingPrize){
            prizes.push(remainingPrize)
            break
        }

        prizes.push(prize)
        remainingPrize -= prize
    }

    return prizes
}

const serializePrizes = (prizes: number[], topUsers: string[]): UserPrize[] => {
    const usersWithPrizes: UserPrize[] = []

    for(let i = 0; i < prizes.length; i++){
        usersWithPrizes.push({
            userId: parseInt(topUsers[i * 2]),
            prize: prizes[i],
        })
    }

    return usersWithPrizes

}

const schedule = cron.schedule('*/10 * * * *', async () => {
    try{
        const [totalScore, topUsers] = await leaderboardRepo.clearUsers()

        const prizes = calculatePrizes(topUsers.length / 2, totalScore)

        const userPrizes = serializePrizes(prizes, topUsers)

        await userRepo.rewardUsers(userPrizes)
        console.log('weekly script completed');
    } catch (error) {
        console.error('Transaction failed:', error);
    }
});

export default schedule;
