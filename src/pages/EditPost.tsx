import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Edit } from 'lucide-react';
import { updatePost } from '../store/slices/postsSlice';
import type { RootState } from '../store';
import type { Post } from '../types';

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  useEffect(() => {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const post = posts.find((p: Post) => p.id === id);
    
    if (!post || post.authorId !== user?.id) {
      navigate('/');
      return;
    }

    setFormData({
      title: post.title,
      content: post.content,
    });
  }, [id, user, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const postIndex = posts.findIndex((p: Post) => p.id === id);

    if (postIndex === -1) {
      navigate('/');
      return;
    }

    const updatedPost = {
      ...posts[postIndex],
      title: formData.title,
      content: formData.content,
      updatedAt: new Date().toISOString(),
    };

    posts[postIndex] = updatedPost;
    localStorage.setItem('posts', JSON.stringify(posts));
    dispatch(updatePost(updatedPost));
    navigate(`/post/${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="flex items-center mb-8">
          <Edit className="w-8 h-8 text-primary-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white ml-2">
            Edit Post
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Write your post content here..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/post/${id}`)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;