import React, { useEffect } from 'react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { Link } from 'react-router-dom';



function Blogs() {

  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);

  const fetchPosts = async () => {
    const res = await fetch(`/api/post/getPosts`);
    const data = await res.json();
    if (res.ok) {
      setPosts(data.posts);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, [])

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post/getposts?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
      {posts && posts.length > 0 && (
        <div className='flex flex-col gap-6'>
          <h2 className='text-2xl font-semibold text-center'>Blogs</h2>
          <div className='flex flex-wrap gap-2'>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
          {showMore ? (
            <button className='underline underline-offset-2  text-teal-400' onClick={handleShowMore}>
              Show more
            </button>
          ): (
            <div></div>
          )}
        </div>
      )}
    </div>
  )
}

export default Blogs