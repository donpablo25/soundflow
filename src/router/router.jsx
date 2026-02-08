import { Routes, Route } from "react-router-dom";


import Connexion from "../front/Connexion/connexion";
import Home from "../front/Home/home";
import Upload from "../front/upload/upload";

export default function Router(){
    return (
            <Routes>
                <Route path="/" element={<Connexion />} />

                <Route 
                path="/home" 
                element={
                <Home />   
                } />

                <Route 
                path="/upload" 
                element={
                <Upload />   
                } />
            </Routes>
    )
}