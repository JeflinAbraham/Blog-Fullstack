import { Alert, Button, Textarea, Modal } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function CommentSection({ postId }) {
    const { currentUser } = useSelector((state) => state.user);
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState(null);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // list of all the comments of this post, (use getPostComments api)
    const [comments, setComments] = useState([]);


    const getComments = async () => {
        try {
            const res = await fetch(`/api/comment/getPostComments/${postId}`);
            const data = await res.json();
            if (res.ok) {
                setComments(data);
            }
        } catch (error) {
            console.log(error.message);
        }
    };


    useEffect(() => {
        getComments();

        // whenever the postId changes, we fetch all the comments related to this postId.
    }, [postId]);



    const handleSubmit = async (e) => {
        e.preventDefault();
        setCommentError(null);
        if (comment.length > 500) {
            setCommentError("comment should be less than 500 characters")
            return;
        }
        try {
            const res = await fetch('/api/comment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: comment,
                    postId,
                    userId: currentUser._id,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setComment('');
                setCommentError(null);

                // the newly created comment is also added to the comments list for the current post.
                setComments([data, ...comments]);
            }
        } catch (error) {
            setCommentError(error.message);
        }
    };


    const handleLike = async (commentId) => {
        try {
            const res = await fetch(`/api/comment/likeComment/${commentId}`, {
                method: 'PUT',
            });
            if (res.ok) {
                const data = await res.json();
                setComments(
                    comments.map((comment) =>
                        comment._id === commentId
                            ? {
                                ...comment,
                                likes: data.likes,
                                numberOfLikes: data.likes.length,
                            }
                            : comment
                    )
                );
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDelete = async (commentId) => {
        setShowModal(false);
        try {
          const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
            method: 'DELETE',
          });
          if (res.ok) {
            setComments(comments.filter((comment) => comment._id !== commentId));
          }
        } catch (error) {
          console.log(error.message);
        }
      };


    return (
        <div className='max-w-2xl mx-auto w-full p-3'>
            {currentUser ? (

                <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                    <p>Signed in as:</p>
                    <img
                        className='h-5 w-5 object-cover rounded-full'
                        src={currentUser.profilePicture}
                    />
                    <Link
                        to={'/dashboard?tab=profile'}
                        className='text-xs text-cyan-600 hover:underline'
                    >
                        @{currentUser.username}
                    </Link>
                </div>

            ) : (
                <div className='text-sm text-teal-500 my-5 flex gap-1'>
                    You must be signed in to comment.
                    <Link className='text-blue-500 hover:underline' to={'/sign-in'}>
                        Sign In
                    </Link>
                </div>
            )}


            {currentUser && (
                <form
                    onSubmit={handleSubmit}
                    className='border border-teal-500 rounded-md p-3'
                >
                    <Textarea
                        placeholder='Add a comment...'
                        rows='5'
                        maxLength='500'
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}
                    />
                    <div className='flex justify-between items-center mt-5'>
                        <p className='text-gray-500 text-xs'>
                            {500 - comment.length} characters remaining
                        </p>
                        <Button outline gradientDuoTone='pinkToOrange' type='submit'>
                            Submit
                        </Button>
                    </div>
                    {commentError && (
                        <Alert color='failure' className='mt-5'>
                            {commentError}
                        </Alert>
                    )}
                </form>
            )}
            {comments.length === 0 ? (
                <p className='text-sm my-5'>No comments yet!</p>
            ) : (
                <div>
                    <div className='text-sm my-5 flex items-center gap-1'>
                        <p>Comments</p>
                        <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                            <p>{comments.length}</p>
                        </div>
                    </div>

                    {comments.map((comment) => (
                        <Comment key={comment._id}
                            comment={comment}

                            // when u click on the Comment component's like button, onLike(handlLike) is run with comment._id as the parameter.
                            onLike={handleLike}
                            onDelete={(commentId) => {
                                setShowModal(true);
                                setCommentToDelete(commentId);
                              }}
                        />
                    ))}

                </div>
            )}

            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size='md'
            >
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete this comment?
                        </h3>
                        <div className='flex justify-center gap-4'>
                            <Button
                                color='failure'
                                onClick={() => handleDelete(commentToDelete)}
                            >
                                Yes, I'm sure
                            </Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}