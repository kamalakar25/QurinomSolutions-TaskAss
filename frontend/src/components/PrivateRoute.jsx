import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PrivateRoute({ children }) {
    const { isAuthenticated, loading } = useSelector((state) => state.auth);

    // If no token, redirect immediately
    if (!localStorage.getItem('token')) {
        return <Navigate to="/login" replace />;
    }

    // If loading but we have a token, we handle it in App.jsx globally to avoid unmounting
    if (loading && localStorage.getItem('token')) {
        return null; // App.jsx will show loader
    }

    if (!isAuthenticated && !loading) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
