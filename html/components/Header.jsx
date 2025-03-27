import React, { useState, useEffect } from "react";
import {
  FaVoteYea,
  FaWallet,
  FaUser,
  FaHome,
  FaPoll,
  FaUsers,
  FaCog,
  FaBars,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import { useLocation, Link } from "react-router-dom";
import WalletConnector from "./WalletConnector"; // Ensure this is the correct import path

const Header = ({ account, isAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Format wallet address
  const formatAddress = (addr) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

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

  // Admin navigation items
  const adminNavItems = [
    { path: "/admin", name: "Admin", icon: <FaCog className="mr-2" /> },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-lg" : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 md:justify-start md:space-x-10">
          {/* Logo */}
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link to="/" className="flex items-center">
              <FaVoteYea className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                BlockVote
              </span>
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
                className={`text-base font-medium flex items-center px-1 pt-1 border-b-2 ${
                  location.pathname === item.path
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            {isAdmin &&
              adminNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-base font-medium flex items-center px-1 pt-1 border-b-2 ${
                    location.pathname === item.path
                      ? "border-red-500 text-red-500"
                      : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
          </nav>

          {/* Wallet/Account Section */}
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            {account ? (
              <div className="relative ml-4">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 transition-all duration-200"
                  aria-expanded={dropdownOpen}
                >
                  <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white">
                    <FaUser className="text-sm" />
                  </div>
                  <span className="font-medium text-gray-700">
                    {formatAddress(account)}
                  </span>
                  <FaChevronDown
                    className={`text-xs transition-transform ${
                      dropdownOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        {formatAddress(account)}
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Your Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <WalletConnector
                onConnect={(address) => console.log("Connected:", address)}
              />
            )}
          </div>
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
            {isAdmin &&
              adminNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                    location.pathname === item.path
                      ? "bg-red-50 text-red-600"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
          </div>
          <div className="pt-4 pb-2">
            {account ? (
              <div className="px-4 py-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                      <FaUser className="text-sm" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-700">
                      {formatAddress(account)}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    to="/profile"
                    className="block px-1 py-1 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded"
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-1 py-1 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded"
                  >
                    Settings
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-1 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <WalletConnector
                onConnect={(address) => console.log("Connected:", address)}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
