"use client";
import React from "react";
import Link from "next/link";
import {
  User,
  Settings,
  House,
  FilePlus,
  Heart,
  LogOut,
  Archive,
  MessageSquareDot,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const DashboardNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { data: user } = useSelector((state) => state.user);
  const userRole = user?.role;

  const baseNavLinks = [
    { href: "/dashboard", label: "My Profile", icon: User },
    { href: "/dashboard/edit-profile", label: "Edit Profile", icon: Settings },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquareDot },
  ];

  const studentLinks = [
    { href: "/dashboard/my-wishlist", label: "My Wishlist", icon: Heart },
  ];

  const ownerLinks = [
    { href: "/dashboard/my-packages", label: "My Packages", icon: Archive },
    { href: "/dashboard/my-properties", label: "My Properties", icon: House },
    { href: "/dashboard/add-property", label: "Add Property", icon: FilePlus },
  ];

  const adminLinks = [
    { href: "/dashboard/users", label: "Users", icon: User },
    { href: "/dashboard/properties", label: "Properties", icon: House },
    {
      href: "/dashboard/verify-pending",
      label: "Verify Pending",
      icon: FilePlus,
    },
  ];

  const getNavLinks = () => {
    let links = [...baseNavLinks];

    if (userRole === "student") {
      links = [...links, ...studentLinks];
    } else if (userRole === "owner") {
      links = [...links, ...ownerLinks];
    } else if (userRole === "admin") {
      links = [...links, ...adminLinks];
    }

    return links;
  };

  const navLinks = getNavLinks();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div
      className="flex h-[90px] justify-center space-x-12 bg-white py-4 border-1 rounded mx-20"
      style={{
        marginTop: "-45px",
        alignItems: "center",
      }}
    >
      {navLinks.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center text-center transition-colors duration-200
              ${isActive ? "text-yellow-500" : "text-black"}
              hover:text-yellow-500`}
          >
            <Icon className="h-6 w-6 mb-1 mx-auto" />
            <span className="text-sm">{label}</span>
          </Link>
        );
      })}

      <button
        onClick={handleLogout}
        className="flex flex-col items-center text-center transition-colors duration-200 text-black hover:text-yellow-500 cursor-pointer"
      >
        <LogOut className="h-6 w-6 mb-1 mx-auto" />
        <span className="text-sm">Log Out</span>
      </button>
    </div>
  );
};

export default DashboardNav;
