import React from 'react'

function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto p-4 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Student Management System. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
