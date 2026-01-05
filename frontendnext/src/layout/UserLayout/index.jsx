import Navbar from '@/Components/Navbar'
import React from 'react'

export default function UserLayout({children}) {
  return (
    <> 
    <Navbar/>
    {children}</>
   
  )
}
