  /**
   * STEPS for state management
   * 1 Submit action
   * 2 Handle action in its reducer
   * 3 Register hare ->Reducer
   */

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";

  export const store=configureStore({
    reducer:{ 
      auth:authReducer,
      posts:postReducer
    }
  })