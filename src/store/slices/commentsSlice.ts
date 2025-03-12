import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Comment } from '../../types';

interface CommentsState {
  comments: Record<string, Comment[]>; // postId -> comments
}

const initialState: CommentsState = {
  comments: {},
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setComments: (state, action: PayloadAction<{ postId: string; comments: Comment[] }>) => {
      const { postId, comments } = action.payload;
      state.comments[postId] = comments;
    },
    addComment: (state, action: PayloadAction<Comment>) => {
      const { postId } = action.payload;
      if (!state.comments[postId]) {
        state.comments[postId] = [];
      }
      state.comments[postId].push(action.payload);
    },
    deleteComment: (state, action: PayloadAction<{ postId: string; commentId: string }>) => {
      const { postId, commentId } = action.payload;
      if (state.comments[postId]) {
        state.comments[postId] = state.comments[postId].filter(
          (comment) => comment.id !== commentId
        );
      }
    },
  },
});

export const { setComments, addComment, deleteComment } = commentsSlice.actions;
export default commentsSlice.reducer;