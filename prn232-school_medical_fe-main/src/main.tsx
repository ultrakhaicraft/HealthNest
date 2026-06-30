import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './app/App.tsx';

//All CSS imports
import './app/CSS/Global.css';
import '../src/app/CSS/ParentStudentNavBar.css'






createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <App/>
    </BrowserRouter>
  </StrictMode>,
)
