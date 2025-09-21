import React from 'react';
import './App.css';
import './components/Portfolio.css';
import './components/Login.css';
import Header from './components/Header';
import Portfolio from './components/Portfolio';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <Portfolio />
      <Footer />
    </div>
  );
}

export default App;
