import { LoginPage } from './pages/auth/LoginPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RegisterPage } from './pages/auth/RegisterPage';
import { useContext, useEffect, useState } from 'react';
import { Context } from '.';
import { check } from './http/userAPI';
import { observer } from 'mobx-react';
import { AccountPage } from './pages/account/AccountPage';
import { NavBar } from './components/NavBar';

const App = observer(() => {
  const { userSession } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const checkUserAuth = (data) => {
    if (!data) return;

    console.log(data);
    userSession.setIsAuth(true);
    userSession.setUser(data);
  };

  useEffect(() => {
    check()
      .then(checkUserAuth)
      .finally(() => setLoading(false));
  }, []);

  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/login" element={<LoginPage></LoginPage>}></Route>
        <Route path="/reg" element={<RegisterPage></RegisterPage>}></Route>
        <Route path='/profile' element={<AccountPage></AccountPage>}></Route>
        <Route index element={<NavBar></NavBar>}></Route>
      </Routes>
    </BrowserRouter>
  );
});

export default App;
