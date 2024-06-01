import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import parse from 'html-react-parser';

export default function PostPage() {
  // when u r at post/:postSlug url, useParams will extract the value of postSlug.
  // why postSlug? check the routes defined in App.jsx
  const { postSlug } = useParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);

  const fetchPost = async () => {
    try {
      setLoading(true);

      //we fetch the post with this slug.
      const res = await fetch(`/api/post/getposts?slug=${postSlug}`);

      const data = await res.json();
      if (!res.ok) {
        setError(true);
        setLoading(false);
        return;
      }
      if (res.ok) {
        // every post has a unique slug, so data.posts.length ll be always 1.
        setPost(data.posts[0]);
        setLoading(false);
        setError(false);
      }
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPost();

    //everytime the postSlug changes, we fetch the post with that slug.
  }, [postSlug]);
  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );
  return <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
    <h1 className='text-3xl mt-10 p-3 text-center font-bold max-w-2xl mx-auto italic lg:text-4xl'>
      {post && post.title}
    </h1>

    <Link to={`/search?category=${post && post.category}`} className='self-center mt-5'>
      <Button color='gray' pill size='xs'>{post && post.category}</Button>
    </Link>

    <img
      src={post && post.image}
      className='mt-10 p-3 max-h-[600px] w-full object-cover'
    />

    <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
      <span>Created at {post && new Date(post.createdAt).toLocaleDateString()}</span>
    </div>
    <div className='p-3 max-w-2xl mx-auto w-full' dangerouslySetInnerHTML={{__html: post && post.content}}>
    </div>

  </main>;

}