// components/NavBar.js
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/utils"; // Make sure this import path is correct

export const NavBar = () => {
  const pathname = usePathname();
  const navItems = [
    { name: "Home", link: "/" },
    { name: "Game", link: "/game" },
    { name: "Creator", link: "/creator" },
  ];

  return (
    <motion.div
      className="flex fixed top-0 left-0 right-0 z-50 bg-secondary shadow-lg py-2 px-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0 }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.link;

        return (
          <div key={item.link} className="flex-1 flex justify-center">
            <Link
              href={item.link}
              className={cn(
                "inline-block text-center text-sm font-semibold transition-all duration-200 font-poppins mx-1",
                isActive
                  ? "bg-primary text-secondary rounded-lg px-6 py-2"
                  : "text-primary hover:text-primary-hover hover:scale-105 px-6 py-2"
              )}
            >
              {item.name}
            </Link>
          </div>
        );
      })}
    </motion.div>
  );
};

export default NavBar;
