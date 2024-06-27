import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import MapPage from './MapPage';

function App() {

  const divStyle = {
    backgroundImage: `url('/cafe.jpg')`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };  
  return (
    <Router>
      <div style={divStyle}>
        
        <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/map/:username/:group_key" element={<MapPage />} /> {/* Updated route with placeholders */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
