import './App.css';
import Header from "./components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Leaderboard from "./pages/leaderboard/Leaderboard";


function App() {
    return (
    <div className="container-fluid p-0 m-0">
        <div className="row w-full">
            <Header />
        </div>
        <div className="d-flex justify-content-center bg-purple">
            <Router>
                <Routes>
                    <Route path="/" element={<Leaderboard />} />
                </Routes>
            </Router>
        </div>

    </div>
  );
}

export default App;
