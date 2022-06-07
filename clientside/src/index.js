import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Game from "./components/Game";
import AddQuestion from './components/AddQuestion';
import Showcase from './components/Showcase';
import { ChakraProvider } from '@chakra-ui/react';
import Lobby from './components/Lobby';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider>
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/game" element={<Game />} />
          <Route path="/addquestion" element={<AddQuestion />} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="/lobby" element={<Lobby />} />
        </Routes>
        
      </BrowserRouter>
    </React.StrictMode>
  </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
