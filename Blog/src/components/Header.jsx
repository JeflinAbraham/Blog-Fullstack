import { Navbar } from 'flowbite-react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { TextInput, Button } from 'flowbite-react'
import { FaMoon, FaSun } from 'react-icons/fa';



function Header() {
    const path = useLocation().pathname;

    return (
        <Navbar className='border-b-4'>
            <Link to='/' className='text-xl dark:text-white'>
                <span className='p-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Jef's</span>
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

            <Navbar.Collapse>
                <Navbar.Link active={path === '/'} as={'div'}>
                    <Link to='/'>Home</Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/About'} as={'div'}>
                    <Link to='/About'>About</Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/Projects'} as={'div'}>
                    <Link to='/Projects'>Projects</Link>
                </Navbar.Link>
            </Navbar.Collapse>

            <div className='flex gap-2'>
                <Button className='w-12 h-10 hidden sm:inline' color='gray' pill>
                    <FaMoon></FaMoon>
                </Button>
                <Link to='/sign-in'>
                    <Button gradientDuoTone='purpleToBlue' outline>
                        Sign In
                    </Button>
                </Link>
                <Navbar.Toggle />

            </div>
        </Navbar>
    )
}

export default Header