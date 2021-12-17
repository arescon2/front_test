import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  listTasks: [],
  totalCountTasks: 0,
  currentPage: 1,
  sort_field: '',
  sort_direction: '',
  auth_status: false,
  appTitle: '',
  oneTask: {}
};

export const mainSlice = createSlice({
  name: 'main_store',
  initialState,
  reducers: {
    setListTasksAndTotalCount: (state, action) => {
      const { list, count } = action.payload;

      return state = {
        ...state,
        listTasks: [...list],
        totalCountTasks: count
      };
    },
    changeSorting: (state, action) => {
      const { sort_field, sort_direction = 'asc' } = action.payload;
      
      return state = {
        ...state,
        sort_field: sort_field,
        sort_direction: sort_direction
      };
    },
    setAuthStatus: (state, action) => {
      state.auth_status = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setAppTitle: (state, action) => {
      state.appTitle = action.payload;
    },
    setOneTask: (state, action) => {
      state.oneTask = action.payload;
    }
  }
});

export const {
  setOneTask,
  setListTasksAndTotalCount, changeSorting, setAuthStatus, setCurrentPage, setAppTitle
} = mainSlice.actions;

export default mainSlice.reducer;