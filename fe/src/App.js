import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import MapPage from './MapPage';

function App() {
  return (
    <Router>
      <div>
        <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/map/:username/:group_key" element={<MapPage />} /> {/* Updated route with placeholders */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
