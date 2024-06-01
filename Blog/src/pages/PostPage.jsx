import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CommentSection from '../components/CommentSection';

export default function PostPage() {
  // when u r at postPage, we ll have post/:postSlug url, useParams will extract the value of postSlug.
  // why postSlug? check the routes defined in App.jsx
  const { postSlug } = useParams();

  //importance of loading in conditional rendering
  /*
  When loading is false initially:
  The component does not show the loading spinner initially.
  The component attempts to render the main content (title, image, etc.) immediately.
  If the post data is not yet available (because the fetch operation has not completed), the component might try to render null or undefined values, leading to errors or incomplete UI.


  When loading is true initially:
  The component immediately shows the loading spinner.
  The main content is not rendered until the loading state is set to false.
  This ensures that the component only attempts to render the main content after the fetch operation has completed and the post data is available.
  */

  const [loading, setLoading] = useState(true);
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
  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
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
        <span>
          Created at {post && new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div
        className='p-3 max-w-2xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{ __html: post && post.content }}>
      </div>
      <CommentSection postId={post._id} />
    </main>
  )

}