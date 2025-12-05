import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-light text-gray-900 tracking-tight mb-4">
            Dario Arzaba Mosqueda
          </h1>

          {/* Navigation buttons */}
          <nav className="flex justify-center gap-3 sm:gap-4">
            <Link
              to="/"
              className={`px-6 py-2 rounded-full text-sm font-light transition-all ${
                isActive('/')
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Arte
            </Link>
            <Link
              to="/vida"
              className={`px-6 py-2 rounded-full text-sm font-light transition-all ${
                isActive('/vida')
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vida
            </Link>
            <Link
              to="/fotos"
              className={`px-6 py-2 rounded-full text-sm font-light transition-all ${
                isActive('/fotos')
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Fotos
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
