import { createSlice } from "@reduxjs/toolkit";

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    items: [],
    offset: 0,
    limit: 10,
  },
  reducers: {
    setReviews: (state, action) => {
      state.items = action.payload;
    },
    setOffset: (state, action) => {
      state.offset = action.payload;
    },
  },
});

export const { setReviews, setOffset } = reviewsSlice.actions;

export default reviewsSlice.reducer;
