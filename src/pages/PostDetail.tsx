import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Edit2, Trash2, MessageSquare } from 'lucide-react';
import { deletePost } from '../store/slices/postsSlice';
import { addComment, deleteComment } from '../store/slices/commentsSlice';
import type { RootState } from '../store';
import type { Post, Comment } from '../types';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<string>('');
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const foundPost = posts.find((p: Post) => p.id === id);
    if (!foundPost) {
      navigate('/');
      return;
    }
    setPost(foundPost);

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const postAuthor = users.find((u: { id: string }) => u.id === foundPost.authorId);
    setAuthor(postAuthor?.username || 'Unknown Author');

    const savedComments = JSON.parse(localStorage.getItem(`comments_${id}`) || '[]');
    setComments(savedComments);
  }, [id, navigate]);

  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const updatedPosts = posts.filter((p: Post) => p.id !== id);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    localStorage.removeItem(`comments_${id}`);
    dispatch(deletePost(id!));
    navigate('/');
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    const comment: Comment = {
      id: crypto.randomUUID(),
      content: newComment.trim(),
      postId: id!,
      authorId: user.id,
      createdAt: new Date().toISOString(),
    };

    const updatedComments = [...comments, comment];
    localStorage.setItem(`comments_${id}`, JSON.stringify(updatedComments));
    setComments(updatedComments);
    dispatch(addComment(comment));
    setNewComment('');
  };

  const handleCommentDelete = (commentId: string) => {
    const updatedComments = comments.filter((c) => c.id !== commentId);
    localStorage.setItem(`comments_${id}`, JSON.stringify(updatedComments));
    setComments(updatedComments);
    dispatch(deleteComment({ postId: id!, commentId }));
  };

  if (!post) return null;

  return (
    <div className="max-w-4xl mx-auto px-4">
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span className="mr-4">{author}</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>

          {user?.id === post.authorId && (
            <div className="flex space-x-4">
              <Link
                to={`/edit-post/${post.id}`}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
              >
                <Edit2 className="w-5 h-5 mr-1" />
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="flex items-center text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5 mr-1" />
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {post.content}
          </p>
        </div>
      </article>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="flex items-center mb-6">
          <MessageSquare className="w-6 h-6 text-primary-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Comments
          </h2>
        </div>

        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              rows={3}
              required
            />
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
              >
                Post Comment
              </button>
            </div>
          </form>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Please{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-600">
              login
            </Link>{' '}
            to comment
          </p>
        )}

        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <span className="font-medium text-gray-900 dark:text-white mr-2">
                    {JSON.parse(localStorage.getItem('users') || '[]').find(
                      (u: { id: string }) => u.id === comment.authorId
                    )?.username || 'Unknown User'}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {user?.id === comment.authorId && (
                  <button
                    onClick={() => handleCommentDelete(comment.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
            </div>
          ))}

          {comments.length === 0 && (
            <p className="text-center text-gray-600 dark:text-gray-400">
              No comments yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;