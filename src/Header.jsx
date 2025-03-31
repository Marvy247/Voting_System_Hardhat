import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import {
  FaVoteYea,
  FaHome,
  FaPoll,
  FaUsers,
  FaBars,
  FaTimes,
} from "react-icons/fa"; // Added FaBars import
import { useLocation } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Navigation items
  const navItems = [
    { path: "/", name: "Home", icon: <FaHome className="mr-2" /> },
    { path: "/vote", name: "Vote", icon: <FaPoll className="mr-2" /> },
    {
      path: "/candidates",
      name: "Candidates",
      icon: <FaUsers className="mr-2" />,
    },
  ];

  return (
    <header className="fixed w-full z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link to="/" className="flex items-center">
              <FaVoteYea className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-xl font-bold">BlockVote</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 -my-2 md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open menu</span>
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-base font-medium flex items-center ${
                  location.pathname === item.path
                    ? "text-purple-600"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } absolute top-16 inset-x-0 p-2 transition transform origin-top-right md:hidden bg-white shadow-lg rounded-b-lg`}
      >
        <div className="divide-y-2 divide-gray-50">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                  location.pathname === item.path
                    ? "bg-purple-50 text-purple-600"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
