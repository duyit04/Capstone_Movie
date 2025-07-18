import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";

// Thunk để lấy danh sách banner
export const fetchBanners = createAsyncThunk(
  "home/fetchBanners",
  async (_, { rejectWithValue }) => {
    try {
      const result = await api.get("QuanLyPhim/LayDanhSachBanner");
      return result.data.content;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk để lấy danh sách phim
export const fetchMovies = createAsyncThunk(
  "home/fetchMovies",
  async (_, { rejectWithValue }) => {
    try {
      const result = await api.get("QuanLyPhim/LayDanhSachPhim?maNhom=GP01");
      return result.data.content;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk để lấy thông tin hệ thống rạp
export const fetchCinemas = createAsyncThunk(
  "home/fetchCinemas",
  async (_, { rejectWithValue }) => {
    try {
      const result = await api.get("QuanLyRap/LayThongTinHeThongRap");
      return result.data.content;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk để lấy lịch chiếu theo hệ thống rạp
export const fetchCinemaSchedules = createAsyncThunk(
  "home/fetchCinemaSchedules",
  async (_, { rejectWithValue }) => {
    try {
      const result = await api.get("QuanLyRap/LayThongTinLichChieuHeThongRap?maNhom=GP01");
      return result.data.content;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  banners: {
    data: null,
    loading: false,
    error: null,
  },
  movies: {
    data: null,
    loading: false,
    error: null,
  },
  cinemas: {
    data: null,
    loading: false,
    error: null,
  },
  cinemaSchedules: {
    data: null,
    loading: false,
    error: null,
  },
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Xử lý fetchBanners
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.banners.loading = true;
        state.banners.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.banners.loading = false;
        state.banners.data = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.banners.loading = false;
        state.banners.error = action.payload;
      });
      
    // Xử lý fetchMovies
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.movies.loading = true;
        state.movies.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.movies.loading = false;
        state.movies.data = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.movies.loading = false;
        state.movies.error = action.payload;
      });
      
    // Xử lý fetchCinemas
    builder
      .addCase(fetchCinemas.pending, (state) => {
        state.cinemas.loading = true;
        state.cinemas.error = null;
      })
      .addCase(fetchCinemas.fulfilled, (state, action) => {
        state.cinemas.loading = false;
        state.cinemas.data = action.payload;
      })
      .addCase(fetchCinemas.rejected, (state, action) => {
        state.cinemas.loading = false;
        state.cinemas.error = action.payload;
      });
      
    // Xử lý fetchCinemaSchedules
    builder
      .addCase(fetchCinemaSchedules.pending, (state) => {
        state.cinemaSchedules.loading = true;
        state.cinemaSchedules.error = null;
      })
      .addCase(fetchCinemaSchedules.fulfilled, (state, action) => {
        state.cinemaSchedules.loading = false;
        state.cinemaSchedules.data = action.payload;
      })
      .addCase(fetchCinemaSchedules.rejected, (state, action) => {
        state.cinemaSchedules.loading = false;
        state.cinemaSchedules.error = action.payload;
      });
  },
});

export default homeSlice.reducer;
