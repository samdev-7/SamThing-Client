import { HashRouter } from 'react-router-dom'
import NavRouter from './components/nav/Router'
import { ButtonListener } from './components/ButtonListener'
import { TimeUpdater } from './components/TimeUpdater'
import ErrorBoundary from '@src/pages/error/ErrorBoundary'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh * 100}px`)
    }

    setVh()
    window.addEventListener('resize', setVh)
    return () => window.removeEventListener('resize', setVh)
  }, [])

  return (
    <HashRouter>
      <ErrorBoundary>
        <ButtonListener />
        <TimeUpdater />
        <NavRouter />
      </ErrorBoundary>
    </HashRouter>
  )
}

export default App
