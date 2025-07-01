"use client";
import React from "react";
import Link from "next/link";
import { useTranslation } from "@/TranslationContext";
import Image from "next/image";

const Footer = () => {
  let { t } = useTranslation();
  return (
    <footer className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="flex items-center">
              <Link href="/">
                {/* <Image
                  src="https://newhome.qodeinteractive.com/wp-content/uploads/2023/03/logo-main.png"
                  alt="New Home Logo"
                  width={50}
                  height={50}
                /> */}
                <span className="text-xl" style={{ fontWeight: 500 }}>
                  Homyfy
                </span>
              </Link>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
              {t("footerAboutUsDescrition")}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg mb-7 font-semibold text-gray-900">
              {t("footerContactUS")}
            </h3>
            <div className="space-y-3">
              <p className="text-gray-600 text-sm">Egypt ,Minya ,ITI</p>
              <p className="text-gray-600 text-sm">01015725203</p>
              <p className="text-gray-600 text-sm">01551262315</p>
              <p className="text-gray-600 text-sm">MostafaMokna78@gmail.com</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-7 text-gray-900">
              {t("footerCategories")}
            </h3>
            <div className="space-y-3">
              <Link
                href="/properties"
                className="block text-gray-600 text-sm hover:text-gray-900 transition-colors"
              >
                Recent property
              </Link>

              <Link
                href="/properties"
                className="block text-gray-600 text-sm hover:text-gray-900 transition-colors"
              >
                To Rent
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-7 text-gray-900">
              {t("footerLinks")}
            </h3>
            <div className="space-y-3">
              <a
                href="/contact-us"
                className="block text-gray-600 text-sm hover:text-gray-900 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
