// components/NavBar.js
import React from "react";
import Link from "next/link";

export const NavBar = () => {
  const navItems = [
    { name: "Home", link: "/" },
    { name: "Game", link: "/game" },
    { name: "Creators", link: "/creators" },
  ];

  return (
    <div className="flex fixed top-0 left-0 right-0 z-50 bg-secondary shadow-lg py-2 px-4">
      {navItems.map((item) => (
        <div key={item.link} className="flex-1 flex justify-center">
          <Link
            href={item.link}
            className="inline-block text-center text-sm font-semibold transition-colors duration-200 font-poppins mx-1 text-primary hover:text-primary-hover px-6 py-2"
          >
            {item.name}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default NavBar;