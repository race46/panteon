import "./Row.css"

function Row({ data, user_rank }) {
    return (
        <tr className="bg-purple-light">
            <td className={'bg-purple-light w-10 ' + (user_rank === data.rank && ' text-purple-light')}>{data.rank}</td>
            <td className={'bg-purple-light w-70 ' + (user_rank === data.rank && ' text-purple-light')}>{data.username}</td>
            <td className={'bg-purple-light w-10 ' + (user_rank === data.rank && ' text-purple-light')}>{data.country}</td>
            <td className={'bg-purple-light w-10 ' + (user_rank === data.rank && ' text-purple-light')}>{data.money}</td>
        </tr>
    )
}

export default Row;
