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

        <Route path='/Book/:book' />
        <Route path='/Results' />

      </Routes>
    </BrowserRouter>

  </StrictMode>,
)
