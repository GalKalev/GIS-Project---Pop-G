import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// const url = 'https://gis-project-pop-g-backend.onrender.com/'
const url = 'http://localhost:8000/'

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

            const { data } = await axios.post(`${url}favorites/basic`, favorite);

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
            const { id, countryWBId, minYear, maxYear } = favorite;
            const { data } = await axios.delete(`${url}favorites/basic`, {
                params: { id, countryWBId, minYear, maxYear }
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
        addBasic: (state, action) => {
            return {
                ...state,
                basic: [...state.basic, action.payload]
            }
        },
        deleteBasic: (state, action) => {
            return {
                ...state,
                basic: state.basic.filter(
                    (basicFav) =>
                        !(basicFav.countryWBId === action.payload.countryWBId &&
                            basicFav.minYear === action.payload.minYear &&
                            basicFav.maxYear === action.payload.maxYear)
                )
            }
        },
        setComp: (state, action) => {
            state.comp = action.payload;
        },
        favoriteLogout: (state, action) => {
            state.basic = null;
            state.comp = null;
        }
    },
    extraReducers: builder => {
        builder
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


    },
})

export const { setBasic, setComp, favoriteLogout, addBasic, deleteBasic } = favoritesSlice.actions;

export default favoritesSlice.reducer;