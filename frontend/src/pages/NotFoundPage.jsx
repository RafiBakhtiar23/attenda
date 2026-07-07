import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
    <h2 className="text-2xl font-semibold mb-8">Page Not Found</h2>
    <Link to="/" className="px-6 py-3 bg-dark-bg text-white rounded-xl font-medium hover:bg-dark-surface transition-colors">
      Go to Homepage
    </Link>
  </div>
);

export default NotFoundPage;