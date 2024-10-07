import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css"
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import EditorComponent from './pages/EditorComponent';
import Navbar from './components/Navbar'; // Import Navbar
import DsaEditorComponent from './pages/DsaEditorComponent';
import Loader from './components/Loader';

const App = () => {
  let isLoggedIn = localStorage.getItem("isLoggedIn");
  const [isGridLayout, setIsGridLayout] = useState(true);

  return (
    <>
      <BrowserRouter>
        {/* Navbar will be visible on all pages */}
        {isLoggedIn && <Navbar isGridLayout={isGridLayout} setIsGridLayout={setIsGridLayout} />} 

        <Routes>
          <Route path='/' element={isLoggedIn ? <Home isGridLayout={isGridLayout} /> : <Navigate to="/login" />} />
          <Route path='/signUp' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
          <Route path='/loader' element={<Loader />} />
          <Route path='/deveditor/:projectID' element={isLoggedIn ? <EditorComponent /> : <Navigate to="/login" />} />
          <Route path='/dsaeditor/:projectID' element={isLoggedIn ? <DsaEditorComponent /> : <Navigate to="/login" />} />
          <Route path="*" element={isLoggedIn ? <NoPage /> : <Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
