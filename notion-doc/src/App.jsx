import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Home } from './page/page'
import { ThemeProvider } from "@/components/theamProvider"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem  disableTransitionOnChange storageKey="vite-ui-theme">
    <Home/>
    </ThemeProvider>
    </>
  )
}

export default App
