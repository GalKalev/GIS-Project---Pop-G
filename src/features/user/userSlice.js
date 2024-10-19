import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { URL } from "../../global/consts";
import axios from "axios";

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
            const { data } = await axios.post(URL + 'register', newUser);
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
            const { data } = await axios.post(URL + 'login', user)
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
            const { data } = await axios.post(URL + 'userInfo', editedInfo)
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
            state.id=null;
            state.email= null;
            state.firstName= null;
            state.lastName= null;
            state.phone= null;
            state.isAdmin= false;
            state.originCountry= null;
            state.isLoading= false;
            state.error= false;
        }
    },
    extraReducers: builder => {
        builder
        // register
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

            //login
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

            //user info
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