import { Navbar, Dropdown, Avatar, TextInput, Button, Modal } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice.js'
import { signoutSuccess, signoutFailure } from '../redux/user/userSlice.js';

function Header() {
    const path = useLocation().pathname;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { theme } = useSelector((state) => state.theme);
    
    // destructuring 
    // const currentUser = useSelector((state) => state.user.currentUser)
    const { currentUser } = useSelector((state) => state.user);
    const [showModalSignOut, setShowModalSignOut] = useState(false);
    

    // search feature
    // the value of 'searchTerm' parameter from the URL is extracted and assigned to searchTerm useState variable.
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const searchTermFromUrl = urlParams.get('searchTerm');
      if (searchTermFromUrl) {
        setSearchTerm(searchTermFromUrl);
      }
      console.log(searchTerm);

      // location.search = '?searchTerm=xxx'
    },[location.search]);

    const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST',
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(signoutFailure(data.message));
            } else {
                dispatch(signoutSuccess());
            }
        }
        catch (error) {
            signoutFailure(data.message);
        }
        setShowModalSignOut(false);
        navigate('/sign-in');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        navigate(`/search/?searchTerm=${searchTerm}`);
    }

    return (
        <Navbar className='border-b-2 p-4 border-orange-500 ' >
            {/* when clciked on link content, u ll be navigated to home page */}
            <Link to='/' className='text-sm font-bold sm:text-2xl text-gray-800 dark:text-white'>
                <span className='p-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-800 rounded-lg text-white'>JEF's</span>
                Blog
            </Link>

            <form onSubmit={handleSubmit}>
                <TextInput
                    type='text'
                    placeholder='Search...'
                    rightIcon={AiOutlineSearch}
                    className='hidden lg:inline'
                    value={searchTerm}

                    // searchTerm parameter in the url should change based on the text value.
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>

            <Button className='w-12 h-10 lg:hidden' color='gray' pill>
                <AiOutlineSearch />
            </Button>

            <Navbar.Collapse >
                <Navbar.Link active={path === '/'} as={'div'}>
                    <Link to='/' className='font-bold text-base p-3 rounded-full '>Home</Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/About'} as={'div'}>
                    <Link to='/About' className='font-bold text-base p-3 rounded-full'>About</Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/Blogs'} as={'div'}>
                    <Link to='/Blogs' className='font-bold text-base p-3 rounded-full'>Blogs</Link>
                </Navbar.Link>
            </Navbar.Collapse>

            <div className='flex gap-2'>
                <Button
                    className='w-12 h-10 hidden sm:inline' color='gray'
                    pill
                    onClick={() => dispatch(toggleTheme())}>
                    {theme === 'dark' ? <FaSun /> : <FaMoon />}
                </Button>

                {/* display the sign in button only if the user isn't authenticated */}
                {currentUser ? (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar img={currentUser.profilePicture} rounded />
                        }
                    >
                        <Dropdown.Header>
                            <span className='block text-sm'>{currentUser.username}</span>
                            <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
                        </Dropdown.Header>

                        <Link to={'/dashboard?tab=profile'}>
                            <Dropdown.Item>Profile</Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={() => setShowModalSignOut(true)}>Sign out</Dropdown.Item>
                    </Dropdown>
                ) : (
                    <Link to='/sign-in'>
                        <Button gradientDuoTone='pinkToOrange' outline>
                            Sign In
                        </Button>
                    </Link>
                )}
                <Navbar.Toggle />

            </div>
            <Modal
                show={showModalSignOut}
                onClose={() => setShowModalSignOut(false)}
                popup
                size='md'
            >
                <Modal.Body className='p-4'>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to sign out?
                        </h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleSignout}>
                                Yes, Sign out
                            </Button>
                            <Button color='gray' onClick={() => setShowModalSignOut(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </Navbar>
    )
}

export default Header