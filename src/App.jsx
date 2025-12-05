import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Arte from './pages/Arte';
import Vida from './pages/Vida';
import Fotos from './pages/Fotos';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Arte />} />
        <Route path="/vida" element={<Vida />} />
        <Route path="/fotos" element={<Fotos />} />
      </Routes>
    </Router>
  );
}

export default App;
