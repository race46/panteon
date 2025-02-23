import Row from "./Row";

function Table({rows}) {
    return (
        <div>
            <div className="country-display text-light d-flex justify-content-center pt-2">
                <img width="20" className="mb-2 mr-1" src={`/flags/${rows.country.toLowerCase()}.svg`} alt="" /> <h4>{rows.country}</h4>
            </div>
            <table className="table table-dark">
                <tbody>
                {
                    rows.leaderboard.top_users.map((row, index) => (
                        <Row data={row} key={index} user_rank={rows?.leaderboard?.user_rank}></Row>
                    ))
                }
                {
                    rows.leaderboard.neighbour_users.length > 0 && <hr/>

                }
                {
                    rows.leaderboard.neighbour_users.map((row, index) => (
                        <Row data={row} key={index} user_rank={rows?.leaderboard?.user_rank}></Row>
                    ))
                }
                </tbody>
            </table>
        </div>
    )
}

export default Table;
