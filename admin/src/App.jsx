import React from 'react'
import Navbar from './components/Navbar/Navbar'; 
import Sidebar from './components/Sidebar/Sidebar'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Add from './pages/Add/Add'
import Lists from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Dashboard from "./pages/Dashboard/Dashboard";  // <-- Add this import
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  const url = "http://localhost:4000"
  return (
    <div>
      <ToastContainer/>
      <Navbar/>
      <hr/>
      <div className="app-content">
        <Sidebar/>
        <Routes>
        <Route path="/" element={<Dashboard url={url} />} />
          <Route path="/add" element={<Add url={url}/>}/>
          <Route path="/list" element={<Lists url={url}/>}/>
          <Route path="/orders" element={<Orders url={url}/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default App
