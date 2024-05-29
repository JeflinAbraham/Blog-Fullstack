import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';

export default function Dashboard() {
  // useLocation(): to get the location object.
  // Location Object, the location object has several properties:

  // search: location.search property represents the query string portion of the URL. This query string starts with a question mark (?) and contains key-value pairs separated by ampersands (&).
  //eg: http://example.com/page?param1=value1&param2=value2
  //query string(location.search): ?param1=value1&param2=value2.

  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {

    // let the query string(location.search) be ?param1=value1&param2=value2, URLSearchParams: breaks down the query string into key value pairs.
    // param1 is the key, and value1 is its corresponding value.
    // param2 is the key, and value2 is its corresponding value.

    const urlParams = new URLSearchParams(location.search);

    //urlParams.get('tab') retrieves the value of the tab parameter from the query string. If the URL is http://localhost:3000/dashboard?tab=profile,
    //location.search is ?tab=profile
    //urlParams is a key-value pair, tab: profile
    //tabFromUrl is profile
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>

      <div className='md:w-56'>
        {/* Sidebar */}
        <DashSidebar />
      </div>
      
      {/* profile... */}
      {tab === 'profile' && <DashProfile />}
    </div>
  );
}