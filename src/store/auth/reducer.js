import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import {
  logIn,
  signUp,
  fetchUser,
  logOut,
  forgotPassword,
  updatePassword,
  updateWaterGoal,
  verifyEmail
} from './operations';

const getStateKey = (type, meta) => type.replace(`/${meta.requestStatus}`, '');

const initialState = {
  user: {
    name: null,
    email: null,
    avatarUrl: null,
    gender: null,
    dailyWaterGoal: 0,
    timezone: null,
  },
  token: null,
  isLoggedIn: false,
  ...[
    logIn,
    signUp,
    fetchUser,
    logOut,
    forgotPassword,
    updatePassword,
    updateWaterGoal,
    verifyEmail
  ].reduce(
    (acc, operation) => ({
      ...acc,
      [operation.typePrefix]: { isLoading: false, error: null, key: null },
    }),
    {}
  ),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: builder => {
    builder
      // Fetch Current User
      .addCase(fetchUser.fulfilled, (state, { payload }) => {
        state.user = payload;
      })
      // Sign Up
      .addCase(signUp.fulfilled, () => {})
      // Log In
      .addCase(logIn.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.token = payload.token;
      })
      // Log Out
      .addCase(logOut.fulfilled, () => initialState)

      // Water
      .addCase(updateWaterGoal.fulfilled, (state, { payload }) => {
        state.user = payload;
      })

      // Handle fulfilled requests status
      .addMatcher(isAnyOf(logIn.fulfilled, fetchUser.fulfilled), state => {
        state.isLoggedIn = true;
      })

      // Handle fulfilled requests status
      .addMatcher(
        isAnyOf(
          logIn.fulfilled,
          signUp.fulfilled,
          fetchUser.fulfilled,
          logOut.fulfilled,
          forgotPassword.fulfilled,
          updatePassword.fulfilled,
          updateWaterGoal.fulfilled,
          verifyEmail.fulfilled
        ),
        (state, { type, meta }) => {
          state[getStateKey(type, meta)] = {
            isLoading: false,
            error: null,
            key: null,
          };
        }
      )
      // Handle Pending requests
      .addMatcher(
        isAnyOf(
          logIn.pending,
          signUp.pending,
          fetchUser.pending,
          logOut.pending,
          forgotPassword.pending,
          updatePassword.pending,
          updateWaterGoal.pending,
          verifyEmail.pending,
        ),
        (state, { type, meta }) => {
          state[getStateKey(type, meta)] = {
            isLoading: true,
            error: null,
            key: meta.arg ?? null,
          };
        }
      )
      // Handle Auth Rejected requests
      .addMatcher(
        isAnyOf(
          logIn.rejected,
          signUp.rejected,
          fetchUser.rejected,
          logOut.rejected
        ),
        (_, { error, payload, type, meta }) => ({
          ...initialState,
          [getStateKey(type, meta)]: {
            isLoading: false,
            error: payload ?? error.message,
            key: null,
          },
        })
      )
      // Handle Rejected requests
      .addMatcher(
        isAnyOf(
          updateWaterGoal.rejected,
          forgotPassword.rejected,
          updatePassword.rejected,
          verifyEmail.rejected
        ),
        (state, { error, payload, type, meta }) => {
          state[getStateKey(type, meta)] = {
            isLoading: false,
            error: payload ?? error.message,
            key: null,
          };
        }
      );
  },
});

export const authReducer = authSlice.reducer;
