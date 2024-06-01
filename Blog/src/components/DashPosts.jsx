import React from 'react'
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Table, Modal, Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';


function DashPosts() {
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);

    const fetchPosts = async () => {
        try {
            const res = await fetch(`/api/post/getposts`);
            const data = await res.json();
            if (res.ok) {
                //data.posts can contain atmost 9 posts (default limit = 9)
                setUserPosts(data.posts);
                console.log(userPosts);
            }
            console.log(data.posts.length);
            if (data.posts.length == 9) {
                setShowMore(true);
            }
            else {
                setShowMore(false);
            }
        }
        catch (error) {
            console.log(error.message);
        }
    };

    // the dependency array of useEffect is set to [currentUser]. This means the fetchPosts function will only run when currentUser changes, which typically happens when a user logs in or their authentication status changes.

    // but even when u create a new post, the posts will get updated in the dashboard, that means fetchPosts() is invoked again ?? useeffect ran again?? howww??
    // its because upon creation of a new post, u are redirected to the new post's URL and when you navigate back to the dashboard, the component remounts, which means the useEffect will run again because the component is being recreated. This is why you see the updated posts.
    useEffect(() => {
        if (currentUser.isAdmin) {
            fetchPosts();
        }
    }, [currentUser]);



    const handleShowMore = async () => {
        const startIndex = userPosts.length;
        try {
            const res = await fetch(
                `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
            );
            const data = await res.json();
            if (res.ok) {
                setUserPosts((prev) => [...prev, ...data.posts]);
                if (data.posts.length == 9) {
                    setShowMore(true);
                }
                else setShowMore(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDelete = async () => {
        setShowDeleteModal(false);
        try {
            const res = await fetch(
                `/api/post/deletepost/${postToDelete}`,
                {
                    method: 'DELETE',
                }
            );
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                // fetchPosts();
                setUserPosts((prev) =>
                    prev.filter((post) => post._id !== postToDelete)
                );
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 md:w-[900px]'>
            {currentUser.isAdmin && userPosts.length > 0 ? (
                <div>
                    <Table hoverable className='shadow-lg'>
                        <Table.Head>
                            <Table.HeadCell>Date updated</Table.HeadCell>
                            <Table.HeadCell>Post image</Table.HeadCell>
                            <Table.HeadCell>Post title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                            <Table.HeadCell>Edit</Table.HeadCell>
                        </Table.Head>


                        <Table.Body>
                            {userPosts.map((post) => (
                                <Table.Row className='bg-white dark:bg-gray-800'>
                                    <Table.Cell>
                                        {new Date(post.updatedAt).toLocaleDateString()}
                                    </Table.Cell>

                                    <Table.Cell>
                                        <Link to={`/post/${post.slug}`}>
                                            <img
                                                src={post.image}
                                                className='w-15 h-10 object-cover bg-gray-500'
                                            />
                                        </Link>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <Link
                                            className='font-medium text-gray-900 dark:text-white'
                                            to={`/post/${post.slug}`}
                                        >
                                            {post.title}
                                        </Link>
                                    </Table.Cell>

                                    <Table.Cell>{post.category}</Table.Cell>

                                    <Table.Cell>
                                        <span className='text-red-700 hover:underline cursor-pointer'
                                            onClick={() => {
                                                setShowDeleteModal(true);
                                                setPostToDelete(post._id);
                                            }}>
                                            Delete
                                        </span>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <Link to={`/update-post/${post._id}`}>
                                            <span className='text-green-400 hover:underline'>Edit</span>
                                        </Link>
                                    </Table.Cell>

                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className='w-full text-teal-500 self-center text-sm py-7'
                        >
                            Show more
                        </button>)}
                </div>
            ) : (
                <p>You have no posts yet!</p>
            )}

            <Modal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                popup
                size='md'
            >
                <Modal.Body className='p-4'>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete this post?
                        </h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleDelete}>
                                Yes
                            </Button>
                            <Button color='gray' onClick={() => { setShowDeleteModal(false) }}>
                                No
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default DashPosts