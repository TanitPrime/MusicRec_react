import { Link } from 'react-router-dom';

const Header = () => (
  <header className="bg-gray-800 p-4 shadow-md">
    <div className="container mx-auto flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-green-400">
        Music Recommendation Project
      </Link>
      <nav>
        <Link to="/" className="px-3 py-2 hover:text-green-400 transition-colors">
          Home
        </Link>
      </nav>
    </div>
  </header>
);

export default Header;