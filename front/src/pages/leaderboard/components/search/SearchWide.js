import "./SearchWide.css"

function SearchWide({setUserId}) {

    return (
        <div className="search-wide">
            <div className="input-group bg-dark">
                <span className="input-group-text bg-dark text-light border-dark"><i className="fas fa-search"></i></span>
                <input onChange={e => setUserId(e.target.value)} type="text" className="form-control bg-dark text-light border-dark" placeholder="Search"/>
                <span className="input-group-text bg-dark text-light border-dark"><i className="fa fa-times"></i></span>
            </div>
        </div>
    )
}

export default SearchWide;
