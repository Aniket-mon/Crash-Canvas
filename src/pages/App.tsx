import React from "react";
import { Routes, Route } from "react-router-dom"; 
import {Main} from "./Main";      
import Analysis from "./analysis";
import About from "./about";
import Feedback from "./feedback";
import Login from "./login";
import Register from "./register";
import ProtectedRoute from "./ProtectedRoute";



export default function App() {
  return (
    <Routes>
    <Route path="/" element={<Main />} />
    <Route
        path="/analysis"
        element={
          <ProtectedRoute>
            <Analysis />
          </ProtectedRoute>
        }
      />
    <Route path="/about" element={<About />} />
    <Route path="/feedback" element={<Feedback />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    </Routes>
  );
}