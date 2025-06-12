"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Plus, User } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
const NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "PAGES", href: "/" },
  { label: "PROPERTIES", href: "/properties" },
  { label: "BLOG", href: "/" },
];

// const USER = JSON.parse(localStorage.getItem("user")) || {
//   name: "Guest",
//   avatar:
//     "https://secure.gravatar.com/avatar/482e9e9d378d9a8895da9d16882c5c86278fbeca1cdfd95fcf5ca7078c5ddb42?s=76&d=mm&r=g",
// };
let defaultUser =
  "https://secure.gravatar.com/avatar/482e9e9d378d9a8895da9d16882c5c86278fbeca1cdfd95fcf5ca7078c5ddb42?s=76&d=mm&r=g";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("user");

  const router = useRouter();
  const toggleMenu = () => setIsMenuOpen((open) => !open);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
    // router.push('/');
  };
  return (
    <nav className="bg-white">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/">
              <img
                src="https://newhome.qodeinteractive.com/wp-content/uploads/2023/03/logo-main.png"
                alt="New Home Logo"
                className="h-10 w-auto"
              />
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="lg:ml-60 flex items-baseline space-x-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-black hover:underline transition-all px-3 py-2 text font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <img
                  src={defaultUser}
                  alt="User"
                  className="w-8 h-8 rounded object-cover"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <span
                      className="text-sm text-black text-[14px] cursor-pointer"
                      style={{ fontWeight: 500 }}
                    >
                      HELLO: {USER.name}
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-50 mt-4">
                    <Link href="/profile" className="text-sm text-black">
                      <DropdownMenuItem className="cursor-pointer">
                        Profile
                      </DropdownMenuItem>
                    </Link>

                    <Link href="/dashboard" className="text-sm text-black">
                      <DropdownMenuItem className="cursor-pointer">
                        Dashboard
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem className="cursor-pointer">
                      <span onClick={handleLogout}>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link
                href="/register"
                className="bg-white text-black pl-4 py-2 rounded font-medium hover:text-yellow-600 transition-colors"
              >
                JOIN US
              </Link>
            )}
            <button className="bg-white text-gray-900 px-4 py-2 text font-medium hover:text-yellow-600 transition-colors flex items-center space-x-2 cursor-pointer">
              <Plus className="w-4 h-4" />
              <span>ADD PROPERTY</span>
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="bg-gray-100 inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 text-base font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-gray-100">
            {isLoggedIn ? (
              <>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-700">
                    HELLO: {USER.name}
                  </span>
                </div>
                <button className="w-50 bg-white text-black px-4 py-2 text-sm font-medium hover:text-yellow-600 transition-colors flex items-center justify-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>ADD PROPERTY</span>
                </button>
              </>
            ) : (
              <a
                href="#"
                className="block w-full bg-yellow-500 text-white px-4 py-2 rounded font-medium text-center hover:bg-yellow-600 transition-colors"
              >
                JOIN US
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
