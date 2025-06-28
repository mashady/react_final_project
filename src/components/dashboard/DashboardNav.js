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
  WalletCards,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "@/TranslationContext";
import { logout } from "@/features/user/userSlice";

const DashboardNav = () => {
  let { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { data: user } = useSelector((state) => state.user);
  const userRole = user?.role;

  const baseNavLinks =
    userRole === "admin"
      ? []
      : [
          { href: "/dashboard", label: t("navbarDropMyProfile"), icon: User },
          {
            href: "/dashboard/edit-profile",
            label: t("navbarDropEditProfile"),
            icon: Settings,
          },
          {
            href: "/dashboard/messages",
            label: t("navbarDropMessages"),
            icon: MessageSquareDot,
          },
        ];

  const studentLinks = [
    {
      href: "/dashboard/my-wishlist",
      label: t("navbarDropMyWishlist"),
      icon: Heart,
    },
  ];

  const ownerLinks = [
    {
      href: "/dashboard/my-packages",
      label: t("navbarDropMyPackages"),
      icon: Archive,
    },
    {
      href: "/dashboard/my-properties",
      label: t("navbarDropMyProperties"),
      icon: House,
    },
    {
      href: "/dashboard/add-property",
      label: t("navbarAddProperty"),
      icon: FilePlus,
    },
  ];

  const adminLinks = [
    { href: "/dashboard/users", label: t("Users"), icon: User },
    {
      href: "/dashboard/properties",
      label: t("navbarAllProperties"),
      icon: House,
    },
    {
      href: "/dashboard/verify-pending",
      label: t("navbarVerifyPending"),
      icon: FilePlus,
    },
    {
      href: "/dashboard/plans",
      label: t("adminPlans"),
      icon: Archive,
    },
    {
      href: "/dashboard/payments",
      label: t("adminPayment"),
      icon: WalletCards,
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
    dispatch(logout());
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
        <span className="text-sm">{t("navbarLogout")}</span>
      </button>
    </div>
  );
};

export default DashboardNav;
