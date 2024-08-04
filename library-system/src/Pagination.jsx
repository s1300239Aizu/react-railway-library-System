import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOffset } from "./store/reviewsSlice";

const Pagination = () => {
  const dispatch = useDispatch();
  const { offset, limit } = useSelector((state) => state.reviews);

  const handleNext = () => {
    dispatch(setOffset(offset + limit));
  };

  const handlePrevious = () => {
    if (offset > 0) {
      dispatch(setOffset(offset - limit));
    }
  };

  return (
    <div className="pagination">
      <button onClick={handlePrevious} disabled={offset === 0}>
        前へ
      </button>
      <button onClick={handleNext}>次へ</button>
    </div>
  );
};

export default Pagination;
