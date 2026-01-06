import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import History from './pages/History';
import Watched from './pages/Watched';
import Profile from './pages/Profile';
import ResultPage from './pages/Result'; // Import ResultPage
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/history" element={<History />} />
            <Route path="/watched" element={<Watched />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/result/:trackingNumber" element={<ResultPage />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
