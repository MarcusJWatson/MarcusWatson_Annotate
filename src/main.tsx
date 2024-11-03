import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <App/> } />

        <Route path='/Results' />
        <Route path='/Person/:person' />

        <Route path='/Book/:book' />
        <Route path='/Book/:book/:chapter' />

        <Route path='/Editor' />


      </Routes>
    </BrowserRouter>

  </StrictMode>,
)
