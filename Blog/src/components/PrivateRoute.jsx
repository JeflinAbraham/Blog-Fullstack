import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
    // privateRoute component checks if the currentUser exists or not, if the currentUser exists it renders the Outlet, which in turn renders the matched child routes. If currentUser does not exist (meaning the user is not authenticated), it redirects to the /sign-in route using Navigate.
    const { currentUser } = useSelector((state) => state.user);
    return currentUser ? <Outlet /> : <Navigate to='/sign-in' />;
}



