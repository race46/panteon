import "./leaderboard.css"
import SearchWide from "./components/search/SearchWide";
import Table from "./components/table/Table";
import {useEffect, useState} from "react";

function Leaderboard() {
    const API = process.env.REACT_APP_API_URL
    const [leaderboard, setLeaderboard] = useState([])
    const [searchCountry, setSearchCountry] = useState(false)
    const [userId, setUserId] = useState()

    useEffect(()=> {
        const _userid = userId ? userId : "-1"
        const url = searchCountry ? `${API}/leaderboard/${_userid}/country` : `${API}/leaderboard/${_userid}`
        fetch(url).then(res=>res.json()).then(data => setLeaderboard(data.data))
    }, [searchCountry, userId])
    return (
        <div className="leaderboard container">
            <div className="row d-flex justify-content-center align-items-center">
                <h1 className="text-light mt-5 mb-5 text-auto w-auto">
                    LEADERBOARD {searchCountry}
                </h1>
            </div>
            <div className="row">
                <SearchWide setUserId={setUserId}></SearchWide>

                <div className="form-check m-3">
                    <input onChange={e => setSearchCountry(e.target.checked)} className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                    <label className="form-check-label text-light" htmlFor="flexCheckDefault">
                        Country Discover Leaderboard
                    </label>
                </div>

                {leaderboard.map((data, index) => (
                    <Table key={index} rows={data}/>
                ))}

            </div>

        </div>
    )
}


export default Leaderboard;
