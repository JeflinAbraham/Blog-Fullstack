import { Navbar } from 'flowbite-react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { TextInput, Button } from 'flowbite-react'
import { FaMoon, FaSun } from 'react-icons/fa';



function Header() {
    const path = useLocation().pathname;

    return (
        <Navbar className='border-b-2 p-4 border-red-600 bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-300' >
            {/* when clciked on link content, u ll be navigated to home page */}
            <Link to='/' className='text-sm font-bold sm:text-2xl text-gray-800'>
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
                <Button className='w-12 h-10 hidden sm:inline' color='gray' pill>
                    <FaMoon></FaMoon>
                </Button>
                <Link to='/sign-in'>
                    <Button gradientDuoTone='pinkToOrange' outline>
                        Sign In
                    </Button>
                </Link>
                <Navbar.Toggle />

            </div>
        </Navbar>
    )
}

export default Header