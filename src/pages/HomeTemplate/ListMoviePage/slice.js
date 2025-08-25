import {createSlice, createAsyncThunk, isRejectedWithValue} from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../../services/api";
import { DEFAULT_GROUP_CODE } from "../../../config/constants";

const initialState = {
    loading: false,
    data: null,
    error: null,
};

export const fetchListMovie = createAsyncThunk("ListMovie/fetchData",async (__dirname,{rejectWithValue}) => {
    try {
        const result = await api.get(`QuanLyPhim/LayDanhSachPhim?maNhom=${DEFAULT_GROUP_CODE}`);
        const movies = result.data.content;
        
        // Xử lý dữ liệu để đảm bảo mỗi phim chỉ có 1 trạng thái duy nhất
        const processedMovies = movies.map(movie => {
          // Tạo bản sao mới để tránh thay đổi dữ liệu gốc
          const processedMovie = { ...movie };
          
          // Logic xử lý trạng thái: ưu tiên "đang chiếu" nếu có cả 2
          if (processedMovie.dangChieu === true && processedMovie.sapChieu === true) {
            processedMovie.sapChieu = false;
            console.log(`Phim "${processedMovie.tenPhim}" có cả 2 trạng thái, đã loại bỏ "sắp chiếu"`);
          }
          
          // Đảm bảo chỉ có 1 trạng thái duy nhất
          if (processedMovie.dangChieu === true) {
            processedMovie.sapChieu = false;
          } else if (processedMovie.sapChieu === true) {
            processedMovie.dangChieu = false;
          }
          
          return processedMovie;
        });
        
        console.log('Đã xử lý', processedMovies.length, 'phim để đảm bảo trạng thái duy nhất');
        return processedMovies;
    } catch (error) {
        console.error("Error fetching movies:", error);
        return rejectWithValue(error);
    }
})

const listMovieSlice = createSlice({
    name: "listMovieSlice",
    initialState,
    reducers: {},
    extraReducers: (builder)=>{
        builder.addCase(fetchListMovie.pending,(state) =>{
            state.loading = true;
        });
        builder.addCase(fetchListMovie.fulfilled,(state,action) =>{
            state.loading = false;
            state.data = action.payload;
        })
        builder.addCase(fetchListMovie.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        });
    }
});

export default listMovieSlice.reducer;