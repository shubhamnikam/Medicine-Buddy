import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { StateStatus } from "../stateStatus";
import {
  authenticate,
  isUserAuthenticated,
  logout,
} from "../../services/auth.service";
import { clearAllSessionStorage, setToSessionStorage } from "../../services/storage.service";
import {
  ACCESS_TOKEN,
  AUTHENTICATED_USER_INFO,
  IS_AUTHENTICATION_SUCCESS,
  REFRESH_TOKEN,
} from "../../utils/appConstants";
import { IAuthTokenOutputModel } from "../../models/output/IAuthTokenOutputModel";
import { IUserLogoutInputModel } from "../../models/input/IUserLogoutInputModel";
import { IUserLoginInputModel } from "../../models/input/IUserLoginInputModel";

// initial data
const authInitialState = {
  loginState: {
    status: StateStatus.DEFAULT as StateStatus,
    data: {
      isAuthenticated: false as boolean,
      userId: 0 as number,
      userName: "" as string | null,
    },
    error: {} as any | null,
  },
  logoutState: {
    status: StateStatus.DEFAULT as StateStatus,
    data: false as boolean,
    error: {} as any | null,
  },
};

// slice
const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(handleAuthenticate.pending, (state) => {
        clearAllSessionStorage();
        state.loginState.status = StateStatus.LOADING;
        state.loginState.data = {
          isAuthenticated: false,
          userId: 0,
          userName: null,
        };
        state.loginState.error = null;

        state.logoutState.status = StateStatus.DEFAULT;
        state.logoutState.data = false;
        state.logoutState.error = null;
      })
      .addCase(handleAuthenticate.fulfilled, (state, action) => {
        // handle logic
        setToSessionStorage<boolean>(IS_AUTHENTICATION_SUCCESS, true);
        setToSessionStorage<IAuthTokenOutputModel>(
          AUTHENTICATED_USER_INFO,
          action.payload.model
        );
        setToSessionStorage<string>(ACCESS_TOKEN, action.payload.model.token);
        setToSessionStorage<string>(
          REFRESH_TOKEN,
          action.payload.model.refreshToken
        );

        // state update
        state.loginState.status = StateStatus.SUCCESS;
        state.loginState.data = {
          isAuthenticated: isUserAuthenticated(),
          userId: action.payload.model.userId,
          userName: action.payload.model.userName,
        };
        state.loginState.error = null;        

        state.logoutState.status = StateStatus.DEFAULT;
        state.logoutState.data = false;
        state.logoutState.error = null;
      })
      .addCase(handleAuthenticate.rejected, (state, action) => {
        state.loginState.status = StateStatus.FAILED;
        state.loginState.data = {
          isAuthenticated: false,
          userId: 0,
          userName: null,
        };
        state.loginState.error = action.payload || "Something went wrong!";        

        state.logoutState.status = StateStatus.DEFAULT;
        state.logoutState.data = false;
        state.logoutState.error = null;
      })
      .addCase(handleLogout.pending, (state) => {
        state.logoutState.status = StateStatus.LOADING;
        state.logoutState.data = false
        state.logoutState.error = null;
      })
      .addCase(handleLogout.fulfilled, (state, action) => {
        if(action.payload.model === true){
          // handle logic
          clearAllSessionStorage();
          
          // state update
          state.logoutState.status = StateStatus.SUCCESS;
          state.logoutState.data = action.payload.model
          state.logoutState.error = null;
          
          state.loginState.status = StateStatus.DEFAULT;
          state.loginState.data = {
            isAuthenticated: false,
            userId: 0,
            userName: null,
          };
          state.loginState.error = null;
          
        }
      })
      .addCase(handleLogout.rejected, (state, action) => {
        state.logoutState.status = StateStatus.FAILED;
        state.logoutState.data = false
        state.logoutState.error = action.payload || "Something went wrong!";
      });
  },
});

// handle logic
export const handleAuthenticate = createAsyncThunk(
  "auth/login",
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const input: IUserLoginInputModel = {
        UserName: username,
        Password: password,
      };
      const data = await authenticate(input);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const handleLogout = createAsyncThunk(
  "auth/logout",
  async (username: string , { rejectWithValue }) => {
    try {
      const input: IUserLogoutInputModel = {
        UserName: username,
      };
      const data = await logout(input);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// state
export const authReducerLoginStateStatus = (state) => state.authReducer.loginState.status;
export const authReducerLoginStateData = (state) => state.authReducer.loginState.data;
export const authReducerLoginStateError = (state) => state.authReducer.loginState.error;

export const authReducerLogoutStateStatus = (state) => state.authReducer.logoutState.status;
export const authReducerLogoutStateData = (state) => state.authReducer.logoutState.data;
export const authReducerLogoutStateError = (state) => state.authReducer.logoutState.error;

export default authSlice.reducer;
