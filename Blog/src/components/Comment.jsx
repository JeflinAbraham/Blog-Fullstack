import moment from 'moment';
import { useEffect, useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export default function Comment({ comment, onLike, onDelete }) {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const getUser = async () => {
    try {
      const res = await fetch(`/api/user/${comment.userId}`);
      const data = await res.json();
      if (res.ok) {
        setUser(data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getUser();

    // whenever the comment changes, we fetch the details of the user who made that comment.
  }, [comment]);



  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
      <div className='flex-shrink-0 mr-3'>
        <img
          className='w-10 h-10 rounded-full bg-gray-200'
          src={user.profilePicture}
        />
      </div>
      <div className='flex-1'>
        <div className='flex items-center mb-1'>
          <span className='font-bold mr-1 text-xs truncate'>
            {user ? `@${user.username}` : 'anonymous user'}
          </span>
          <span className='text-gray-500 text-xs'>{moment(comment.createdAt).fromNow()}</span>
        </div>
        <p className='text-gray-500 pb-2'>{comment.content}</p>


        <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
          <button
            type='button'

            // onClick={() => onLike(comment._id)} means when the button is clicked, the onLike function will be called with the comment._id as a parameter.
            // onLike function is actually handleLike from the CommentSection component.
            onClick={() => onLike(comment._id)}

            className={`text-gray-400 hover:text-blue-400 ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-700'}`}
          >
            <FaThumbsUp />
          </button>
          <p className='text-gray-400'>
            {
              comment.numberOfLikes > 0 &&
              comment.numberOfLikes + ' ' + (comment.numberOfLikes === 1 ? 'like' : 'likes')
            }
          </p>

          {currentUser &&
            (currentUser.isAdmin || currentUser._id === comment.userId) && (
              <div>
                <button
                  type='button'
                  onClick={() => onDelete(comment._id)}
                  className='text-gray-400 hover:text-red-700'
                >
                  Delete
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}