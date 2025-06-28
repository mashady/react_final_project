'use client';
import Link from 'next/link';
import { useTranslation } from '@/TranslationContext';
const AlreadyVerifiedPage = () => {
  let { t } = useTranslation(); 
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4">
            {t("emailAlreadyVerified")}
        </h1>
        <p className="text-gray-600 mb-6">
          {t("emailAlreadyVerifiedDescription")}
        </p>
        <Link href="/login">
          <span className="inline-block bg-[#ffcc41] px-6 py-2 rounded-full shadow hover:bg-amber-400 transition-all cursor-pointer">
            {t("goToLogin")}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default AlreadyVerifiedPage;
