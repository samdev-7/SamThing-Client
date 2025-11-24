import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Home } from '@src/pages'

/**
 * Main navigation router.
 * Add your custom routes here.
 */
const NavRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}

export default NavRouter
