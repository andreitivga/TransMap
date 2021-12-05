import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import RegisterPage from "./pages/RegisterPage";
import RegisterSuccesful from "./pages/RegisterSuccesful";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" exact element={<LandingPage/>}/>
                <Route path="/login" exact element={<LoginPage/>}/>
                <Route path="/register" exact element={<RegisterPage/>}/>
                <Route path="/register_succesful" exact element={<RegisterSuccesful/>}/>
                <Route path='*' exact element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default Router
