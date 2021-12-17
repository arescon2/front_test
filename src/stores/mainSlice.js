import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  listTasks: [],
  totalCountTasks: 0,
  currentPage: 1,
  sortField: '',
  sortDirection: '',
  authStatus: false,
  appTitle: '',
  oneTask: {},
  isSubmitting: false
};

export const mainSlice = createSlice({
  name: 'main_store',
  initialState,
  reducers: {
    setListTasksAndTotalCount: (state, action) => {
      const { list, count } = action.payload;

      const newState = {
        ...state,
        listTasks: [ ...list ],
        totalCountTasks: count
      };

      return newState;
    },
    changeSorting: (state, action) => {
      const { sortField, sortDirection = 'asc' } = action.payload;
      
      const newState = {
        ...state,
        sortField: sortField,
        sortDirection: sortDirection
      };

      return newState;
    },
    setAuthStatus: (state, action) => {
      state.authStatus = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setAppTitle: (state, action) => {
      state.appTitle = action.payload;
    },
    setOneTask: (state, action) => {
      state.oneTask = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    }
  }
});

export const {
  setOneTask, setIsSubmitting,
  setListTasksAndTotalCount, changeSorting, setAuthStatus, setCurrentPage, setAppTitle
} = mainSlice.actions;

export default mainSlice.reducer;