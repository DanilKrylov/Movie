import { LoginPage } from './pages/auth/LoginPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RegisterPage } from './pages/auth/RegisterPage';
import { CompanyPage } from './pages/company/CompanyPage';
import { useContext, useEffect, useState } from 'react';
import { Context } from '.';
import { check } from './http/userAPI';
import { observer } from 'mobx-react';

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
        <Route path="/films" element={<FilmsPage></FilmsPage>}></Route>
        <Route path="/login" element={<LoginPage></LoginPage>}></Route>
        <Route path="/cinema/:id" element={<CinemaPage></CinemaPage>}></Route>
        <Route path="/reg" element={<RegisterPage></RegisterPage>}></Route>
        <Route index element={<CompanyPage></CompanyPage>}></Route>
      </Routes>
    </BrowserRouter>
  );
});

export default App;
