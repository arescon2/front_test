import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'https://uxcandy.com/~shapoval/test-task-backend/v2',
  timeout: 10000,
  headers: {
    'Content-Type': 'multipart/form-data',
  }
});

export const getTasksApi = async (page = 1, sort_field, sort_direction) => {
  const params = {
    developer: 'TSK',
    page,
    sort_field,
    sort_direction
  };

  const isSorted = sort_field && sort_field.length > 0;
  
  if(isSorted) {
    params.sort_field = sort_field;
    params.sort_direction = sort_direction;
  };

  const response = await api({
    method: 'GET',
    url: '/',
    params: params,
  });
  return response.data;
};

export const onLoginApi = async (username, password) => {
  let formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  const response = await api({
    method: 'POST',
    url: '/login',
    data: formData,
    params: {
      developer: 'TSK',
    }
  });
  return response.data;
};

export const onTaskNewApi = async (username, email, text) => {
  let formData = new FormData();
  formData.append('username', username);
  formData.append('email', email);
  formData.append('text', text);

  const response = await api({
    method: 'POST',
    url: '/create',
    data: formData,
    params: {
      developer: 'TSK',
    }
  });
  return response.data;

};

export const onTaskEdit = async (task_id, text, status) => {
  let formData = new FormData();
  status && formData.append('status', status);
  text && formData.append('text', text);

  const token = Cookies.get('auth-token');
  
  token && formData.append('token', token);

  const response = await api({
    method: 'POST',
    url: '/edit/' + task_id,
    data: formData,
    params: {
      developer: 'TSK'
    }
  });
  return response.data;
}