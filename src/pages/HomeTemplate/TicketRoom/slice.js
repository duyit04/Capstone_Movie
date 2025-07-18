import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";

// Thunk để lấy thông tin phòng vé
export const getTicketRoomInfo = createAsyncThunk(
  "ticketRoom/getTicketRoomInfo",
  async (maLichChieu, { rejectWithValue }) => {
    try {
      const result = await api.get(`QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${maLichChieu}`);
      return result.data.content;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk để đặt vé
export const bookTickets = createAsyncThunk(
  "ticketRoom/bookTickets",
  async (bookingData, { rejectWithValue, getState }) => {
    try {
      // Lấy accessToken từ localStorage
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        return rejectWithValue("User not logged in");
      }
      
      const result = await api.post("QuanLyDatVe/DatVe", bookingData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return result.data.content;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  ticketRoom: null,
  loading: false,
  error: null,
  bookingResult: null,
  bookingLoading: false,
  bookingError: null,
};

const ticketRoomSlice = createSlice({
  name: "ticketRoom",
  initialState,
  reducers: {
    clearBookingResult: (state) => {
      state.bookingResult = null;
      state.bookingError = null;
    }
  },
  extraReducers: (builder) => {
    // Xử lý getTicketRoomInfo
    builder
      .addCase(getTicketRoomInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTicketRoomInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.ticketRoom = action.payload;
      })
      .addCase(getTicketRoomInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      
    // Xử lý bookTickets
    builder
      .addCase(bookTickets.pending, (state) => {
        state.bookingLoading = true;
        state.bookingError = null;
      })
      .addCase(bookTickets.fulfilled, (state, action) => {
        state.bookingLoading = false;
        state.bookingResult = action.payload;
      })
      .addCase(bookTickets.rejected, (state, action) => {
        state.bookingLoading = false;
        state.bookingError = action.payload;
      });
  },
});

export const { clearBookingResult } = ticketRoomSlice.actions;
export default ticketRoomSlice.reducer;
