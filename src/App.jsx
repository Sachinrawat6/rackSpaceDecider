import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Upload from './components/Upload'
const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Upload/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App