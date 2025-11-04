// frontend/src/App.jsx

import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import SearchResultsPage from './pages/SearchResultsPage.jsx';
import BookingPage from './pages/BookingPage.jsx';
import MyBookingsPage from './pages/MyBookingsPage.jsx';
import PNRStatusPage from './pages/PNRStatusPage.jsx';

const App = () => {
  return (
    <div className="flex min-h-screen min-w-screen flex-col bg-gray-300">
      <Header />
      <main className="flex-grow py-6">
        <div className="container mx-auto">
          {/* Outlet will render the component for the matching route */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/search" element={<SearchResultsPage />} />

            <Route path="/book/:trainId" element={<BookingPage />} />
            <Route path="/mybookings" element={<MyBookingsPage />} />
            <Route path="/pnr-status" element={<PNRStatusPage />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;