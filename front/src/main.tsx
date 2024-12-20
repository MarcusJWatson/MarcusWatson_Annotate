import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AllTheBooks, EditorPage, MyPage, ViewBook, ViewChapter } from './Template.tsx';
import { UserProvider } from './myContext.tsx';
import { AuthPage } from './auth.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>

    
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <App/> } />

        <Route path='/auth' element={<AuthPage/> }/>

        <Route path='/AllBooks' element={<AllTheBooks />} />

        <Route path='/Results' />
        <Route path='/Person/:person' element={<MyPage />} />

        <Route path='/Book/:book' element={<ViewBook />}/>
        <Route path='/Book/:book/:chapter' element={<ViewChapter />} />


        {/* Below the routs Should be protected But this is a simple demostration... 
          <Route path='/Editor/:name/:chapter' element={<BookEditor />} />
          
          <Route path='/Editor/:name' element={<BookEditor />} />
        
        */}


      </Routes>
    </BrowserRouter>

    </UserProvider>
  </StrictMode>,
)
