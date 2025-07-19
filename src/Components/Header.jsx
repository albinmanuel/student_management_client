import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="bg-blue-700 text-white shadow-md w-full z-50 fixed top-0 left-0 h-16">
      <div className="container mx-auto flex items-center justify-between p-4 h-full">
        <h1 className="text-2xl font-bold">
          <Link to="/">Student Manager</Link>
        </h1>
      </div>
    </header>
  )
}

export default Header