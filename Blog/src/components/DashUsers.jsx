    import { Modal, Table, Button } from 'flowbite-react';
    import { useEffect, useState } from 'react';
    import { useSelector } from 'react-redux';
    import { HiOutlineExclamationCircle } from 'react-icons/hi';
    import { FaCheck, FaTimes } from 'react-icons/fa';
    import { nanoid } from '@reduxjs/toolkit';

    export default function DashUsers() {
        const { currentUser } = useSelector((state) => state.user);
        const [users, setUsers] = useState([]);
        const [showMore, setShowMore] = useState(false);
        const [showModal, setShowModal] = useState(false);
        const [userIdToDelete, setUserIdToDelete] = useState('');
        // const [userIdToMakeAdmin, setUserIdToMakeAdmin] = useState('');
        // const [showModalAdmin, setShowModalAdmin] = useState(null);
        const [showErrModal, setShowErrModal] = useState(false);

        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/getusers`);
                const data = await res.json();
                if (res.ok) {
                    setUsers(data.users);
                    if (data.users.length === 9) {
                        setShowMore(true);
                    }
                    else {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        useEffect(() => {
            if (currentUser.isAdmin) {
                fetchUsers();
            }
        }, [currentUser]);

        const handleShowMore = async () => {
            const startIndex = users.length;
            try {
                const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
                const data = await res.json();
                if (res.ok) {
                    setUsers((prev) => [...prev, ...data.users]);
                    if (data.users.length === 9) {
                        setShowMore(true);
                    }
                    else if (data.users.length < 9) {
                        setShowModal(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        const handleDeleteUser = async () => {
            try {
                const res = await fetch(`/api/user/adminDeleteUser/${userIdToDelete}`, {
                    method: 'DELETE',
                });
                const data = await res.json();
                if (res.ok) {
                    setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error.message);
            }
            setShowModal(false);
        };

        // const handleMakeAdmin = async () => {
        //     try {
        //         const res = await fetch(`/api/user/${userIdToMakeAdmin}`, {
        //             method: 'PUT'
        //         });
        //         const data = await res.json();
        //         if(res.ok){
        //             setUsers((prev) =>
        //             prev.map((user) =>
        //                 user._id === userIdToMakeAdmin ? { ...user, isAdmin: true } : user
        //             )
        //         );
        //         }
        //     } 
        //     catch (error) {
        //         console.log(error);    
        //     }
        //     setShowModalAdmin(false);
        // }

        return (
            <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
                {currentUser.isAdmin && users.length > 0 ? (
                    <div>
                        <Table hoverable className='shadow-md'>
                            <Table.Head>
                                <Table.HeadCell>Date created</Table.HeadCell>
                                <Table.HeadCell>User image</Table.HeadCell>
                                <Table.HeadCell>Username</Table.HeadCell>
                                <Table.HeadCell>Email</Table.HeadCell>
                                <Table.HeadCell>Admin</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                            </Table.Head>
                            {users.map((user) => (
                                <Table.Body key={nanoid()}>
                                    <Table.Row className='bg-white dark:bg-gray-800'>
                                        <Table.Cell>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </Table.Cell>

                                        <Table.Cell>
                                            <img
                                                src={user.profilePicture}
                                                className='w-10 h-10 object-cover bg-gray-500 rounded-full'
                                            />
                                        </Table.Cell>

                                        <Table.Cell>{user.username}</Table.Cell>

                                        <Table.Cell>{user.email}</Table.Cell>

                                        <Table.Cell>
                                            {user.isAdmin ? (
                                                <FaCheck className='text-green-500' />
                                            ) : (
                                                <FaTimes className='text-red-600' />
                                            )}
                                        </Table.Cell>

                                        <Table.Cell>
                                            <span
                                                onClick={() => {
                                                    //admin shouldn't be deleting himself
                                                    { !user.isAdmin && setShowModal(true) }
                                                    { user.isAdmin && setShowErrModal(true) }
                                                    setUserIdToDelete(user._id)
                                                }}
                                                className='font-medium text-red-600 hover:underline cursor-pointer'
                                            >
                                                Delete
                                            </span>
                                        </Table.Cell>
                    
                                    </Table.Row>
                                </Table.Body>
                            ))}
                        </Table>
                        {showMore && (
                            <button
                                onClick={handleShowMore}
                                className='w-full text-teal-500 self-center text-sm py-7'
                            >
                                Show more
                            </button>
                        )}
                    </div>
                ) : (
                    <p>You have no users yet!</p>
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
                                Are you sure you want to delete this user?
                            </h3>
                            <div className='flex justify-center gap-4'>
                                <Button color='failure' onClick={handleDeleteUser}>
                                    Yes, I'm sure
                                </Button>
                                <Button color='gray' onClick={() => setShowModal(false)}>
                                    No, cancel
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>


                <Modal
                    show={showErrModal}
                    onClose={() => setShowErrModal(false)}
                    popup
                    size='md'
                >
                    <Modal.Header />
                    <Modal.Body>
                        <div className='text-center'>
                            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                                You can't delete admin users
                            </h3>
                        </div>  
                    </Modal.Body>
                </Modal>
                {/*
                <Modal
                show={showModalAdmin}
                onClose={() => setShowModalAdmin(false)}
                    popup
                    size='md'
                >
                    <Modal.Header />
                    <Modal.Body>
                        <div className='text-center'>
                            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to make this user an Admin?
                            </h3>
                            <div className='flex justify-center gap-4'>
                                <Button color='failure' onClick={handleMakeAdmin}>
                                    Yes, I'm sure
                                </Button>
                                <Button color='gray' onClick={() => setShowModalAdmin(false)}>
                                    No, cancel
                                    </Button>
                                    </div>
                                    </div>
                                    </Modal.Body>
                                    </Modal>
                                */}
            </div>
        );
    }