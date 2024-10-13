import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = 'https://gis-project-pop-g-backend.onrender.com/'

const initialState = {
    email: null,
    isAdmin: false,
    originCountry: null,
    isLoading: false,
    error: false

}

export const registerUser = createAsyncThunk(
    "/register",
    async (newUser, thunkAPI) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            // const body = JSON.stringify(newUser);
            const { data } = await axios.post(url + 'register', newUser);
            return data;
        } catch (error) {
            console.error('error registering user slice: ' + error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const loginUser = createAsyncThunk(
    "/login",
    async (user, thunkAPI) => {
        try {
            const { data } = await axios.post(url + 'login', user)
            return data;
        } catch (error) {
            console.error('error login user slice: ' + error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    })

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setOriginCountry: (state, action) => {
            state.originCountry = action.payload;
        },
        setIsAdmin: (state, action) => {
            state.isAdmin = action.payload;
        },
        userLogout: (state, action) => {
            state.isAdmin = false;
            state.email = null;
            state.originCountry = null;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(registerUser.pending, (state) => {
                console.log('register pending')
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                console.log('register fulfilled')
                console.log(action)
                state.isLoading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                console.log('register rejected')
                console.log(action)
                state.isLoading = false;
                state.error = action.payload; // <-- error response
            })

            .addCase(loginUser.pending, (state) => {
                console.log('login pending')
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                console.log('login fulfilled')
                console.log(action)
                state.isLoading = false;

            })
            .addCase(loginUser.rejected, (state, action) => {
                console.log('login rejected')
                console.log(action)
                state.isLoading = false;
                state.error = action.payload; // <-- error response
            })
    },
})

export const { setEmail, setOriginCountry, setIsAdmin, userLogout } = userSlice.actions;

export default userSlice.reducer;