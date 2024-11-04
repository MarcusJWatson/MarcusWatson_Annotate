import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MyPage, ViewBook, ViewChapter } from './Template.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <App/> } />

        <Route path='/Results' />
        <Route path='/Person/:person' element={<MyPage />} />

        <Route path='/Book/:book' element={<ViewBook />}/>
        <Route path='/Book/:book/:chapter' element={<ViewChapter />} />

        <Route path='/Editor/:name' />


      </Routes>
    </BrowserRouter>

  </StrictMode>,
)
