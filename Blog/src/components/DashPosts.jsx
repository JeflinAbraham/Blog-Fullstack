import React from 'react'
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Table } from 'flowbite-react';
import { Link } from 'react-router-dom';


function DashPosts() {
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([]);

    const fetchPosts = async () => {
        try {
            const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
            const data = await res.json();
            if (res.ok) {
                setUserPosts(data.posts);
            }
        }
        catch (error) {
            console.log(error.message);
        }
    };

    //dependency: whenever currentUser value changes i.e whenever a user is authenticated, we check if the user is an admin or not, if yes we fetch all the posts.
    useEffect(() => {
        if (currentUser.isAdmin) {
            fetchPosts();
        }
    }, [currentUser]);


    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
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
                                        <span className='text-red-600 hover:underline cursor-pointer'>
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
                </div>
            ) : (
                <p>You have no posts yet!</p>
            )}
        </div>
    );
}

export default DashPosts