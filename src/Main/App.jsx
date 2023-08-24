import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import LayoutProvider from '../Layouts/LayoutProvider';

//New -->
import LoginPage from '../Components/NewComponents/LoginPage';
import UserPage from '../Components/NewComponents/UserPage';
import AdminPage from '../Components/NewComponents/AdminPage';
import ChangePasswordPage from '../Components/NewComponents/ChangePasswordPage';
import CreateUserPage from '../Components/NewComponents/CreateUserPage';


axios.defaults.baseURL = 'http://localhost:8000'

export default function App() {

  return (
    <div className='font-[Poppins]'>
      {/* New Components */}

      <Router>
        <LayoutProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/user" element={<UserPage/>} />
            <Route path="/admin" element={<AdminPage/>} />
            <Route path="/change-password" element={<ChangePasswordPage/>} />
            <Route path="/create-user" element={<CreateUserPage/>} />
          </Routes>
        </LayoutProvider>
      </Router>
    </div>
  );
}
