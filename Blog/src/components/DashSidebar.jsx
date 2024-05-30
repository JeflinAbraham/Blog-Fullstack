import { Sidebar } from 'flowbite-react';
import { HiUser, HiArrowSmRight, HiOutlineExclamationCircle } from 'react-icons/hi';
import { Modal, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signoutSuccess, signoutFailure } from '../redux/user/userSlice';

export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  const dispatch = useDispatch();
  const [showModalSignOut, setShowModalSignOut] = useState(false);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
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
    <div className='h-screen'>
      <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
          <Sidebar.ItemGroup>

            <Link to='/dashboard?tab=profile'>
              <Sidebar.Item
                active={tab === 'profile'}
                icon={HiUser}
                label={'User'}
                labelColor='dark'
              >
                Profile
              </Sidebar.Item>
            </Link>

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