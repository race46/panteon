import dummyScheduler from "./dummy-data-creator"
import leaderBoardScheduler from "./leaderboard-weekly-calculator"

function startAllSchedulers() {
    console.log("Starting all schedulers");
    dummyScheduler.start()
    leaderBoardScheduler.start()
}

export default startAllSchedulers;
