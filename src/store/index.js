import { configureStore } from "@reduxjs/toolkit";
import listMovieSlice from "../pages/HomeTemplate/ListMoviePage/slice";
import ticketRoomSlice from "../pages/HomeTemplate/TicketRoom/slice";
import homeSlice from "../pages/HomeTemplate/HomePage/slice";

export const store = configureStore({
  reducer: {
    listMovieSlice,
    ticketRoomSlice,
    homeSlice,
  },
});
