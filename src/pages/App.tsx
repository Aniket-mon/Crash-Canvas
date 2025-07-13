import React from "react";
import { Routes, Route } from "react-router-dom"; 
import {Main} from "./Main";      
import Analysis from "./analysis";
import About from "./about";
import Feedback from "./feedback";
import Login from "./login";
import Register from "./register";
import ProtectedRoute from "./ProtectedRoute";
import Trends from "./Trends";
import Regulations from "./Regulation";
import DDemo from "./ddemo"
import Prediction from "./prediction"
import RoadCond from "./Road"



export default function App() {
  return (
    <Routes>
    <Route path="/" element={<Main />} />
    <Route path="/analysis" element={<ProtectedRoute><Analysis /></ProtectedRoute>} /> 
    <Route path="/about" element={<About />} />
    <Route path="/feedback" element={<Feedback />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/analysis/trends" element={<Trends/>} />
    <Route path="/analysis/regulation" element={<Regulations/>} />
    <Route path="/analysis/ddemo" element={<DDemo/>} />
    <Route path="/analysis/prediction" element={<Prediction/>} />
    <Route path="/analysis/roads" element={<RoadCond/>} />
    </Routes>
  );
}