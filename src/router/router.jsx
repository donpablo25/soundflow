import { Routes, Route, Navigate } from "react-router-dom";

import { auth } from "../back/firebase";
import ProtectedRoute from "./protectedRouter";

import Connexion from "../front/Connexion/connexion";
import Home from "../front/Home/home";
import Upload from "../front/upload/upload";
import List from "../front/List/list";
import Profil from "../front/Profil/profil";
import ProfilEdit from "../front/Profil/profilEdit";

export default function Router(){
    const user = auth.currentUser
    return (
            <Routes>
                <Route path="/connection" element={<Connexion />} />

                <Route 
                path="/home" 
                element={
                <Home />   
                } />

                <Route 
                path="/upload" 
                element={
                    <ProtectedRoute>
                        <Upload />   
                    </ProtectedRoute>
                } />

                <Route 
                path="/list" 
                element={
                    <ProtectedRoute>
                        <List />   
                    </ProtectedRoute>
                } /> 

                <Route 
                path="/editprofil" 
                element={
                    <ProtectedRoute>
                        <ProfilEdit />  
                    </ProtectedRoute>

                } /> 

                <Route 
                path="/profil" 
                element={
                    <ProtectedRoute>
                        <Profil/>
                    </ProtectedRoute>

                } /> 

                <Route path="*" element={
                    user ? <Navigate to="/list" replace/> : <Navigate to="/home" replace/>
                }/>
                
            </Routes>
    )
}