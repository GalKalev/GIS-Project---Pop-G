import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// const url = 'https://gis-project-pop-g-backend.onrender.com/'
const url = 'http://localhost:8000/'

const initialState = {
    id:null,
    email: null,
    firstName: null,
    lastName: null,
    phone: null,
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

export const userInfo = createAsyncThunk(
    '/info',
    async (editedInfo, thunkAPI) => {
        try {
            const { data } = await axios.post(url + 'userInfo', editedInfo)
            return data
        } catch (error) {
            console.error('error editing user info: ' + error);
            return thunkAPI.rejectWithValue(error.response.data);
        }

    }
)

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setId: (state, action) => {
            state.id = action.payload;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setOriginCountry: (state, action) => {
            state.originCountry = action.payload;
        },
        setIsAdmin: (state, action) => {
            state.isAdmin = action.payload;
        },
        setFirstName: (state, action) => {
            state.firstName = action.payload;
        },
        setLastName: (state, action) => {
            state.lastName = action.payload;
        },
        setPhone: (state, action) => {
            state.phone = action.payload;
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

            .addCase(userInfo.pending, (state) => {
                console.log('user info pending')
                state.isLoading = true;
            })
            .addCase(userInfo.fulfilled, (state, action) => {
                console.log('user info fulfilled')
                console.log(action)
                state.isLoading = false;

            })
            .addCase(userInfo.rejected, (state, action) => {
                console.log('user info rejected')
                console.log(action)
                state.isLoading = false;
                state.error = action.payload; // <-- error response
            })
    },
})

export const {setId, setEmail, setOriginCountry, setIsAdmin, setFirstName, setLastName, setPhone, userLogout } = userSlice.actions;

export default userSlice.reducer;