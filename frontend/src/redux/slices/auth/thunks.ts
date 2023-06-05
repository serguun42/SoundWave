import { createAsyncThunk } from '@reduxjs/toolkit';
import { CheckResult, LoginRegisterPayload } from './types';

export const check = createAsyncThunk<CheckResult>(
  'auth/check',
  async () => {
    const response = await fetch('/api/v1/account/check');
    const data = await response.json();
    return data;
  },
);

export const login = createAsyncThunk<undefined, LoginRegisterPayload>(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    const response = await fetch('/api/v1/account/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return rejectWithValue(await response.text());
    }
    return undefined;
  },
);

export const register = createAsyncThunk<undefined, LoginRegisterPayload>(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    const response = await fetch('/api/v1/account/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return rejectWithValue(await response.text());
    }
    return undefined;
  },
);
