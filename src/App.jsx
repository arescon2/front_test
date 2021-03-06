import { useEffect } from 'react';
import { Col, Container, Row } from 'react-grid-system';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';

import { getTasksApi } from './features/api';
import Header from './views/header';

import { setListTasksAndTotalCount, setAuthStatus } from './stores/mainSlice';

import ListTasks from './views/listTasks';
import LoginForm from './views/loginForm';
import TaskOneForm from './views/taskOneForm';
import Cookies from 'js-cookie';

const App = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { currentPage, sortField, sortDirection } = useSelector((state) => state.main);

  const getTasks = () => {
    getTasksApi(currentPage, sortField, sortDirection).then( result => {
      const payload = {
        list: result.message.tasks,
        count: parseInt(result.message.total_task_count),
      };
      dispatch(setListTasksAndTotalCount(payload));
    });
  };

  useEffect(() => {
    const token = Cookies.get('auth-token');
    pathname === '/login' && navigate('/');
    token && dispatch(setAuthStatus(true));
  }, []);

  useEffect(() => {
    getTasks();
  }, [ currentPage, sortField, sortDirection ]);

  return <>
    <Header />
    <Container>
      <Row>
        <Col>
          <Routes>
            <Route path='/' element={ <ListTasks getTasks={ getTasks } /> } />
            <Route path='/task/:idTask' element={ <TaskOneForm getTasks={ getTasks } /> } />
            <Route path='login' element={ <LoginForm /> }/>
          </Routes>
        </Col>
      </Row>
    </Container>
    <ToastContainer
      position='top-right'
      autoClose={ 5000 }
      pauseOnHover
      theme='colored'
    />
  </>
};

export default App;
