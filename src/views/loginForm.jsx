import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { Button, Card, FormGroup, InputGroup } from '@blueprintjs/core';

import { onLoginApi } from '../features/api';
import { setAuthStatus } from '../stores/mainSlice';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const setCookieAndRedirect = (name, value, params) => {
    Cookies.set(name, value, params);
    dispatch(setAuthStatus(true));
    navigate('/');
  }

  const onChangeHandler = (event) => {
    const { id, value } = event.target;
    ({
      'login-input': () => {
        setLogin(value);
        setLoginError('');
      },
      'password-input': () => {
        setPassword(value);
        setPasswordError('')
      }
    }[id])();
  };

  const onLoginHandler = () => {
    onLoginApi(login, password).then( response => {
      const { status, message } = response;
      ({
        'ok': () => {
          const { token } = message;
          setCookieAndRedirect('auth-token', token, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000)});
        },
        'error': () => {
          const {username, password} = message;
          
          username ? setLoginError(username) : null;
          password ? setPasswordError(password) : null;

        }
      }[status])();
    })
  };

  const isFieldError = (field) => {
    return {
      username: loginError.length > 0 ? 'danger' : 'none',
      password: passwordError.length > 0 ? 'danger' : 'none',
    }[field];
  };

  useEffect(() => {
    let isFullError = loginError.length > 0 && passwordError.length > 0;
    if(isFullError) toast.error(`${loginError} ${passwordError}`);
    let isHalfError = loginError.length > 0 || passwordError.length > 0;
    if(isHalfError) toast.error(`${passwordError}`);

  },[loginError, passwordError])

  return <Card className='auth-block'>
    <FormGroup
      label="Логин"
      labelFor="login-input"
      className="login-form-item"
      intent={isFieldError('username')}
    >
      <InputGroup
        id="login-input" placeholder="Логин"
        value={login} onChange={onChangeHandler}
        intent={isFieldError('username')}
      />
    </FormGroup>
    <FormGroup
      label="Пароль"
      labelFor="password-input"
      className="login-form-item"
      intent={isFieldError('password')}
    >
      <InputGroup
        id="password-input" placeholder="Пароль" type="password"
        value={password} onChange={onChangeHandler}
        intent={isFieldError('password')}
      />
    </FormGroup>
    <Button text="Войти" intent='primary' onClick={onLoginHandler} />
    </Card>
};

export default LoginForm;