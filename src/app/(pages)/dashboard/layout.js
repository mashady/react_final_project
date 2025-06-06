import DashboardNav from '@/components/dashboard/DashboardNav'
import Header from '@/components/shared/Header'
import React from 'react'
const layout = ({ children }) => {
  return (
    <div className="min-h-screen">
        <Header />
        <DashboardNav />
        <main className="p-6">{children}</main>
    </div>
  )
}

export default layout
