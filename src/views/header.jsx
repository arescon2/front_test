import { Alignment, Button, Navbar } from '@blueprintjs/core';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { setAuthStatus } from '../stores/mainSlice';

const Header = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { authStatus, appTitle } = useSelector((state) => state.main);

  const onLogoutHandler = () => {
    Cookies.remove('auth-token');
    dispatch(setAuthStatus(false));
  };

  const onToLoginHandler = () => navigate('/login');
  const onToCreateTask = () => navigate('/task/new');

  return <Navbar className='app-header bp3-dark'>
    <Navbar.Group align={ Alignment.LEFT }>
      <Button outlined icon='plus' text='Новая задача' onClick={ onToCreateTask }/>
      <Navbar.Divider />
      <Navbar.Heading>{appTitle}</Navbar.Heading>
    </Navbar.Group>
    <Navbar.Group align={ Alignment.RIGHT }>
      {
        authStatus ?
          <Button outlined intent='danger' icon='log-out' text='Выйти' onClick={ onLogoutHandler }/> :
            pathname !== '/login' && <Button outlined icon='log-in' text='Авторизация' onClick={ onToLoginHandler }/>
      }
    </Navbar.Group>
  </Navbar>
};

export default Header;