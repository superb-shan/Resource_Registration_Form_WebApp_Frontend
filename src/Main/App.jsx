import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import LayoutProvider from '../Layouts/LayoutProvider';


//New -->
import LoginPage from '../Pages/LoginPage';
import UserPage from '../Pages/UserPage';
import AdminPage from '../Pages/AdminPage';
import ChangePasswordPage from '../Pages/ChangePasswordPage';
import CreateUserPage from '../Pages/CreateUserPage';
import Feedback from '../Pages/Feedback';
import underConstruction from '../Assets/Images/underConstruction.jpg'

  // axios.defaults.baseURL = 'http://localhost:8000';
  //axios.defaults.baseURL = 'https://on29-11.onrender.com';//old
 axios.defaults.baseURL = 'https://two023backend.onrender.com';

export default function App() {
  const isMobile = window.innerWidth <= 768; // Define your breakpoint for mobile screens

  return (
    <div className='font-[Poppins]'>
      <Router>
        <LayoutProvider>
          {isMobile ? (
            <div className='h-[89vh] bg-[#dbecfe] flex flex-col justify-center items-center'>
              <p>Sri Eshwar's Easy Bookings</p>
              <img src={underConstruction} alt='Under Construction for mobile version.'/>
              <p>We are sorry for the inconvenience happened!</p>
              <p>Currently, the app is in Beta version.</p>
              <p className='font-semibold'>Kindly use a wide screen device to view the site.</p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/user" element={<UserPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/change-password" element={<ChangePasswordPage />} />
              <Route path="/create-user" element={<CreateUserPage />} />
              <Route path="/feedback" element={<Feedback/>} />
          </Routes>
          )}
        </LayoutProvider>
      </Router>
    </div>
  );
}
