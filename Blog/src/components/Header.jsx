import { Navbar,Dropdown,Avatar,TextInput, Button } from 'flowbite-react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice.js'

function Header() {
    const path = useLocation().pathname;
    const dispatch = useDispatch();
    const {theme} = useSelector((state) => state.theme);

    // destructuring 
    // const currentUser = useSelector((state) => state.user.currentUser)
    const { currentUser } = useSelector((state) => state.user);

    return (
        <Navbar className='border-b-2 p-4 border-orange-500 ' >
            {/* when clciked on link content, u ll be navigated to home page */}
            <Link to='/' className='text-sm font-bold sm:text-2xl text-gray-800 dark:text-white'>
                <span className='p-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-800 rounded-lg text-white'>JEF's</span>
                Blog
            </Link>

            <form>
                <TextInput
                    type='text'
                    placeholder='Search...'
                    rightIcon={AiOutlineSearch}
                    className='hidden lg:inline'
                />
            </form>

            <Button className='w-12 h-10 lg:hidden' color='gray' pill>
                <AiOutlineSearch />
            </Button>

            <Navbar.Collapse >
                <Navbar.Link active={path === '/'} as={'div'}>
                    <Link to='/' className='font-bold text-base'>Home</Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/About'} as={'div'}>
                    <Link to='/About' className='font-bold text-base'>About</Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/Projects'} as={'div'}>
                    <Link to='/Projects' className='font-bold text-base'>Blogs</Link>
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
                        <Dropdown.Item>Sign out</Dropdown.Item>
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
        </Navbar>
    )
}

export default Header