import { useState } from 'react'
import './App.css'
import { Home } from './page/page'
import { ThemeProvider } from "@/components/theamProvider"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EditPage } from './editor-Page/edit-page';
import { Toaster } from 'sonner';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem  disableTransitionOnChange storageKey="vite-ui-theme">
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Home />}/>
    <Route path="/edit" element={<EditPage />}/>
    </Routes>
    </BrowserRouter>
    <Toaster position='bottom-center'/>
    </ThemeProvider>
    </>
  )
}

export default App
