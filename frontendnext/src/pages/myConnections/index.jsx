import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React from 'react'

export default function MyConnectionPage() {
  return (
   <UserLayout>
       <DashboardLayout>
        <div>
         <h1>MyConnection</h1>
        </div>
       </DashboardLayout>
      </UserLayout>
  )
}
