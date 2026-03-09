import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import About from './pages/About';
import Blog from './pages/Blog';
import Location from './pages/Location';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import LegalNotice from './pages/legal/LegalNotice';
import CookiesPolicy from './pages/legal/CookiesPolicy';
import ScrollToTop from './components/common/ScrollToTop';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="servicios" element={<Services />} />
          <Route path="contacto" element={<Contact />} />
          <Route path="nosotros" element={<About />} />
          <Route path="blog" element={<Blog />} />
          <Route path="ubicacion" element={<Location />} />
          <Route path="privacidad" element={<PrivacyPolicy />} />
          <Route path="aviso-legal" element={<LegalNotice />} />
          <Route path="cookies" element={<CookiesPolicy />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
