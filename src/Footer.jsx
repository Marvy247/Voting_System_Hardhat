import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white text-purple-900 p-4 text-center">
      <p>&copy; {new Date().getFullYear()} BlockVote. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
