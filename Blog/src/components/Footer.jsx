import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble } from 'react-icons/bs';
export default function FooterCom() {
    return (
        <Footer container className='border border-t-8 border-orange-500'>
            <div className='w-full max-w-7xl mx-auto'>
                <div className='w-full justify-between sm:flex'>

                    <div className='mt-5'>
                        <Link to='/' className='text-sm font-bold sm:text-2xl dark:text-white text-gray-800'>
                            <span className='p-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-800 rounded-lg text-white'>JEF's</span>
                            Blog
                        </Link>
                    </div>


                    <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>

                        <div>
                            <Footer.Title title='About' className='text-orange-500 dark:text-orange-500' />
                            <Footer.LinkGroup col>
                                <Footer.Link href='https://www.100jsprojects.com' rel='noopener noreferrer'>
                                    100 JS Projects
                                </Footer.Link>
                                <Footer.Link href='/about'>
                                    JEF's Blog
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>

                        <div>
                            <Footer.Title title='Follow us' className='text-orange-500 dark:text-orange-500' />
                            <Footer.LinkGroup col>
                                <Footer.Link href='https://github.com/JeflinAbraham/Blog-Fullstack' rel='noopener noreferrer'>
                                    Github
                                </Footer.Link>
                                <Footer.Link href='https://discord.com/channels/1245241178048167948/1245241178048167950' rel='noopener noreferrer'>
                                    Discord
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>

                        <div>
                            <Footer.Title title='Legal' className='text-orange-500 dark:text-orange-500' />
                            <Footer.LinkGroup col>
                                <Footer.Link href='#'>Privacy Policy</Footer.Link>
                                <Footer.Link href='#'>Terms & Conditions</Footer.Link>
                            </Footer.LinkGroup>
                        </div>

                    </div>
                </div>

                <Footer.Divider className='border border-b-1 border-orange-300'/>

                <div className='w-full sm:flex sm:justify-between'>
                    <Footer.Copyright
                        href='#'
                        by="JEF's blog"
                        year={new Date().getFullYear()}
                        className='mt-2'
                    />
                    <div className="flex gap-6 mt-3">
                        <Footer.Icon href='#' icon={BsFacebook} />
                        <Footer.Icon href='https://www.instagram.com/jefx07_/' rel='noopener noreferrer' icon={BsInstagram} />
                        <Footer.Icon href='#' icon={BsTwitter} />
                        <Footer.Icon href='https://github.com/JeflinAbraham/Blog-Fullstack' rel='noopener noreferrer' icon={BsGithub} />

                    </div>
                </div>
            </div>
        </Footer>
    );
}