import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Clock, MessageSquare, User } from 'lucide-react';
import { setPosts, setLoading, incrementPage, setHasMore } from '../store/slices/postsSlice';
import type { RootState } from '../store';

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const { posts, loading, page, hasMore } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    // Simulating initial posts fetch from local storage
    const savedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    dispatch(setPosts(savedPosts));
  }, [dispatch]);

  const loadMorePosts = () => {
    if (loading || !hasMore) return;

    dispatch(setLoading(true));
    // Simulating loading more posts from local storage
    setTimeout(() => {
      const savedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      const start = (page - 1) * 10;
      const end = page * 10;
      const newPosts = savedPosts.slice(start, end);

      if (newPosts.length > 0) {
        dispatch(setPosts([...posts, ...newPosts]));
        dispatch(incrementPage());
      } else {
        dispatch(setHasMore(false));
      }
      dispatch(setLoading(false));
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Latest Posts</h1>
      
      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all hover:shadow-lg"
          >
            <Link to={`/post/${post.id}`}>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                {post.title}
              </h2>
            </Link>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
              {post.content}
            </p>
            
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                <span>Author ID: {post.authorId}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-1" />
                <span>Comments</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMorePosts}
            disabled={loading}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
          No more posts to load
        </p>
      )}

      {posts.length === 0 && !loading && (
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p className="text-xl">No posts yet</p>
          <Link
            to="/create-post"
            className="inline-block mt-4 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Create Your First Post
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;