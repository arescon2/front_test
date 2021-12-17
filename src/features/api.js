import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'https://uxcandy.com/~shapoval/test-task-backend/v2',
  timeout: 10000,
  headers: {
    'Content-Type': 'multipart/form-data',
  }
});

const DeveloperName = 'TumSay';

export const getTasksApi = async (page = 1, sortField, sortDirection) => {
  const params = {
    developer: DeveloperName,
    page,
    sortField,
    sortDirection
  };

  const isSorted = sortField && sortField.length > 0;
  
  if(isSorted) {
    params.sortField = sortField;
    params.sortDirection = sortDirection;
  }

  const response = await api({
    method: 'GET',
    url: '/',
    params: params,
  });
  return response.data;
};

export const onLoginApi = async (username, password) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  const response = await api({
    method: 'POST',
    url: '/login',
    data: formData,
    params: {
      developer: DeveloperName,
    }
  });
  return response.data;
};

export const onTaskNewApi = async (username, email, text) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('email', email);
  formData.append('text', text);

  const response = await api({
    method: 'POST',
    url: '/create',
    data: formData,
    params: {
      developer: DeveloperName,
    }
  });
  return response.data;

};

export const onTaskEdit = async (taskId, text, status) => {
  const formData = new FormData();
  status && formData.append('status', status);
  text && formData.append('text', text);

  const token = Cookies.get('auth-token');
  
  token && formData.append('token', token);

  const response = await api({
    method: 'POST',
    url: '/edit/' + taskId,
    data: formData,
    params: {
      developer: DeveloperName
    }
  });
  return response.data;
}