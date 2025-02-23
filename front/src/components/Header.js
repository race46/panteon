import logo from "../assets/icons/app_logo.png";
import "./Header.css"

function Header() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark d-flex justify-content-center">
            <img className="img-md" src={logo} alt="logo" />
        </nav>
    )
}

export default Header
