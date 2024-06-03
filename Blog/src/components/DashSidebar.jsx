import { Sidebar } from 'flowbite-react';
import { HiUser, HiArrowSmRight, HiOutlineExclamationCircle, HiDocumentText, HiOutlineUserGroup, HiChartPie,HiAnnotation } from 'react-icons/hi';
import { Modal, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signoutSuccess, signoutFailure } from '../redux/user/userSlice';

export default function DashSidebar() {
  const { currentUser } = useSelector((state) => state.user);

  // useLocation(): to get the location object.
  // the location object has several properties:

  // search: location.search property represents the query string portion of the URL. This query string starts with a question mark (?) and contains key-value pairs separated by ampersands (&).
  //eg: http://example.com/page?param1=value1&param2=value2
  //query string(location.search): ?param1=value1&param2=value2.
  const location = useLocation();
  const [tab, setTab] = useState('');
  const dispatch = useDispatch();
  const [showModalSignOut, setShowModalSignOut] = useState(false);
  useEffect(() => {

    // let the query string(location.search) be ?param1=value1&param2=value2, URLSearchParams: breaks down the query string into key value pairs.
    // param1 is the key, and value1 is its corresponding value.
    // param2 is the key, and value2 is its corresponding value.
    // urlParams is an object of key-value pairs.
    const urlParams = new URLSearchParams(location.search);

    //urlParams.get('tab') retrieves the value of the tab parameter from the query string. If the URL is http://localhost:3000/dashboard?tab=profile,
    //location.search is ?tab=profile
    //urlParams is an onject with a key-value pair, tab: profile
    //tabFromUrl is profile
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

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
  };
  return (
    <div className='w-full md:w-56 md:h-screen'>
      <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
          <Sidebar.ItemGroup className='flex flex-col gap-1'>
            <Link to='/dashboard?tab=overview'>
              <Sidebar.Item
                active={tab === 'overview'}
                icon={HiChartPie}
                as='div'
              >
                Overview
              </Sidebar.Item>
            </Link>
            <Link to='/dashboard?tab=profile'>
              <Sidebar.Item
                active={tab === 'profile'}
                icon={HiUser}
                label={currentUser.isAdmin ? "Admin" : "User"}
                labelColor='dark'
              >
                Profile
              </Sidebar.Item>
            </Link>
            {currentUser.isAdmin &&
              (<Link to='/dashboard?tab=posts'>
                <Sidebar.Item
                  active={tab === 'posts'}
                  icon={HiDocumentText}
                >
                  Posts
                </Sidebar.Item>
              </Link>)
            }
            {currentUser.isAdmin && (
              <Link to='/dashboard?tab=users'>
                <Sidebar.Item
                  active={tab === 'users'}
                  icon={HiOutlineUserGroup}
                >
                  Users
                </Sidebar.Item>
              </Link>
            )}


            <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={() => setShowModalSignOut(true)}>
              Sign Out
            </Sidebar.Item>

          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>

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
    </div>
  );
}