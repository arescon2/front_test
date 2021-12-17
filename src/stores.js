import { configureStore } from '@reduxjs/toolkit'
import mainReducer from './stores/mainSlice';

export const store = configureStore({
  reducer: {
    main: mainReducer,
  },
})