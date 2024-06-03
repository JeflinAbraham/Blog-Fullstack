import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function Search() {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        category: 'uncategorized',
        sort: 'desc',
    });

    console.log(sidebarData);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [searchTermFromUrl, setSearchTermFromUrl] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const st = urlParams.get('searchTerm');
        setSearchTermFromUrl(st);
        const fetchPosts = async () => {
            setLoading(true);

            //location.search -> ?param1=val1&param2=val2&param3=val3
            //urlParams.toString() -> param1=val1&param2=val2&param3=val3
            const searchQuery = urlParams.toString();
            console.log(searchQuery);
            const res = await fetch(`/api/post/getposts?${searchQuery}`);

            if (!res.ok) {
                setLoading(false);
                return;
            }
            if (res.ok) {
                const data = await res.json();
                setPosts(data.posts);
                setLoading(false);
                if (data.posts.length === 9) {
                    setShowMore(true);
                } else {
                    setShowMore(false);
                }
            }
        };
        fetchPosts();
    }, [location.search]);

    const handleChange = (e) => {
        if (e.target.id === 'searchTerm') {
            setSidebarData({ ...sidebarData, searchTerm: e.target.value });
        }
        if (e.target.id === 'sort') {
            setSidebarData({ ...sidebarData, sort: e.target.value });
        }
        if (e.target.id === 'category') {
            setSidebarData({ ...sidebarData, category: e.target.value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('category', sidebarData.category);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    const handleShowMore = async () => {
        const numberOfPosts = posts.length;
        const startIndex = numberOfPosts;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        if (!res.ok) {
            return;
        }
        if (res.ok) {
            const data = await res.json();
            setPosts([...posts, ...data.posts]);
            if (data.posts.length === 9) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
        }
    };

    return (
        <div className='flex flex-col md:flex-row'>
            <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
                <form className='flex flex-col gap-8' onSubmit={handleSubmit}>

                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-medium'>
                            Search Term:
                        </label>
                        <TextInput
                            placeholder='Search...'
                            id='searchTerm'
                            type='text'
                            defaultValue={searchTermFromUrl}
                            onChange={handleChange}
                            className='w-[118px]'
                        />
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='font-medium'>Category:</label>
                        <Select
                            onChange={handleChange}
                            value={sidebarData.category}
                            id='category'
                        >
                            <option value='uncategorized'>Uncategorized</option>
                            <option value='bikes'>bikes</option>
                            <option value='cars'>cars</option>
                            <option value='buildings'>buildings</option>
                        </Select>
                    </div>

                    <div className='flex items-center gap-2'>
                        <label className='font-medium whitespace-nowrap'>Sort posts:</label>
                        <Select onChange={handleChange} value={sidebarData.sort} id='sort' className='w-[134px]'>
                            <option value='desc'>Latest</option>
                            <option value='asc'>Oldest</option>
                        </Select>
                    </div>

                    <Button type='submit' outline gradientDuoTone='pinkToOrange'>
                        Apply Filters
                    </Button>
                </form>

            </div>
            <div className='w-full'>
                <h1 className='text-3xl font-semibold underline underline-offset-8 italic border-gray-500 p-3 mt-2 ml-10'>
                    Search results :
                </h1>
                <div className='p-7 flex flex-wrap gap-4'>
                    {!loading && posts.length === 0 && (
                        <p className='text-xl text-gray-500'>No posts found.</p>
                    )}
                    {loading && <p className='text-xl text-gray-500'>Loading...</p>}
                    {!loading &&
                        posts &&
                        posts.map((post) => <PostCard key={post._id} post={post} />)}
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className='text-teal-500 text-lg hover:underline p-7 w-full'
                        >
                            Show More
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}