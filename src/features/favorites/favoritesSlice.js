import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { URL } from "../../global/consts";
import axios from "axios";

const initialState = {
    basic: null,
    comp: null,
    isLoading: false,
    error: false

}
/**
 * Adding new basic favorite to db
 */
export const addBasicFavorite = createAsyncThunk(
    '/favorites/addBasic',
    async (favorite, thunkAPI) => {
        try {
            console.log(favorite.minYear)

            const { data } = await axios.post(`${URL}favorites/basic`, favorite);

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Error fetching favorites");
        }
    }
)

/**
 * Delete a basic favorite from db
 */
export const deleteBasicFavorite = createAsyncThunk(
    '/favorites/deleteBasic',
    async (favorite, thunkAPI) => {
        try {
            const { id, userId } = favorite;
     
            const { data } = await axios.delete(`${URL}favorites/basic`, {
                params: { id, userId }
            });

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Error fetching favorites");
        }
    }
)

/**
 * Adding new compare favorite to db
 */
export const addCompareFavorite = createAsyncThunk(
    '/favorites/addCompare',
    async (favorite, thunkAPI) => {
        try {
            console.log(favorite.minYear)

            const { data } = await axios.post(`${URL}favorites/compare`, favorite);

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Error fetching favorites");
        }
    }
)

/**
 * Delete a compare favorite from db
 */
export const deleteCompareFavorite = createAsyncThunk(
    '/favorites/deleteCompare',
    async (favorite, thunkAPI) => {
        try {
            const { id, userId } = favorite;
            const { data } = await axios.delete(`${URL}favorites/Compare`, {
                params: { id, userId }
            });

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Error fetching favorites");
        }
    }
)


const favoritesSlice = createSlice({
    name: 'favorite',
    initialState,
    reducers: {
        setBasic: (state, action) => {
            state.basic = action.payload;
        },
        setComp: (state, action) => {
            state.comp = action.payload;
        },
        favoriteLogout: (state, action) => {
            state.basic = null;
            state.comp = null;
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
    extraReducers: builder => {
        builder
        // Add basic
            .addCase(addBasicFavorite.pending, (state) => {
                console.log('add basic favorite pending')
                state.isLoading = true;
            })
            .addCase(addBasicFavorite.fulfilled, (state, action) => {
                console.log('add basic favorite fulfilled')
                console.log(action)
                state.isLoading = false;
            })
            .addCase(addBasicFavorite.rejected, (state, action) => {
                console.log('add basic favorite rejected')
                console.log(action)
                state.isLoading = false;
                state.error = action.payload; // <-- error response
            })
            // Delete basic
            .addCase(deleteBasicFavorite.pending, (state) => {
                console.log('delete basic favorite pending')
                state.isLoading = true;
            })
            .addCase(deleteBasicFavorite.fulfilled, (state, action) => {
                console.log('delete basic favorite fulfilled')
                console.log(action)
                state.isLoading = false;
            })
            .addCase(deleteBasicFavorite.rejected, (state, action) => {
                console.log('delete basic favorite rejected')
                console.log(action)
                state.isLoading = false;
                state.error = action.payload; // <-- error response
            })


            // Add compare
            .addCase(addCompareFavorite.pending, (state) => {
                console.log('add compare favorite pending')
                state.isLoading = true;
            })
            .addCase(addCompareFavorite.fulfilled, (state, action) => {
                console.log('add compare favorite fulfilled')
                console.log(action)
                state.isLoading = false;
            })
            .addCase(addCompareFavorite.rejected, (state, action) => {
                console.log('add compare favorite rejected')
                console.log(action)
                state.isLoading = false;
                state.error = action.payload; // <-- error response
            })
            // Delete compare
            .addCase(deleteCompareFavorite.pending, (state) => {
                console.log('delete delete favorite pending')
                state.isLoading = true;
            })
            .addCase(deleteCompareFavorite.fulfilled, (state, action) => {
                console.log('delete delete favorite fulfilled')
                console.log(action)
                state.isLoading = false;
            })
            .addCase(deleteCompareFavorite.rejected, (state, action) => {
                console.log('delete delete favorite rejected')
                console.log(action)
                state.isLoading = false;
                state.error = action.payload; // <-- error response
            })

    },
})

export const { setBasic, setComp, favoriteLogout,setIsLoading } = favoritesSlice.actions;

export default favoritesSlice.reducer;