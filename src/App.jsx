import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import { getCookies, setCookies, removeCookies } from './utils/Coockies';
import { getUserLogged } from './repositories/AuthRepository';

import Navigation from './components/Navigation';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const data = getCookies();
      setUser(data);
    };

    getUser();
  }, []);

  const onSuccessLogin = async ({ accessToken }) => {
    const { data } = await getUserLogged(accessToken);
    setCookies(data);
    setUser(data);
  };

  const onLogOut = () => {
    removeCookies();
    setUser(null);
  };


  if (!user) {
    return (
      <div>
        <main className='w-100'>
          <Routes>
            <Route path="/*" element={<LoginPage loginSuccess={onSuccessLogin} />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navigation user={user} onLogOut={onLogOut} />
      <main className='w-100'>
        <Routes>
          <Route path="/" element={<ProfilePage user={user} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;