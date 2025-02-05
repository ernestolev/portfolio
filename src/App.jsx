import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { FaGithub, FaLinkedin, FaInstagram, } from 'react-icons/fa';
import Projects from "./Routes/Projects/Projects";
import Contact from "./Routes/Contact/Contact";
import styles from "./App.module.css";
import ShapeBlur from '../src/Backgrounds/ShapeBlur/ShapeBlur';
import ShinyText from '../src/TextAnimations/ShinyText/ShinyText';
import SplitText from '../src/TextAnimations/SplitText/SplitText';
import Loading from '../src/Components/Loading/Loading';
import Admin from '../src/Routes/Admin/Admin';
import Login from './Routes/Login/Login';
import ProtectedRoute from '../src/Routes/ProtectedRoute';
import Services from './Routes/Services/Services';

import AOS from 'aos';
import 'aos/dist/aos.css';

const Navigation = () => {

  return (
    <nav className={styles.nav}>
      <Link to="/">Home</Link>
      <Link to="/projects">Projects</Link>
      <Link to="/services">Services</Link>
      <Link to="/contact">Contact</Link>
    </nav>
  );
};




const Home = () => {

  useEffect(() => {
    AOS.refresh();
  }, []);

  const [textColor, setTextColor] = useState('#ffffff');

  useEffect(() => {
    const updateTextColor = () => {
      const element = document.querySelector(`.${styles.rightContent}`);
      if (element) {
        const bgColor = window.getComputedStyle(element).backgroundColor;
        const rgb = bgColor.match(/\d+/g);
        if (rgb) {
          // Calculate relative luminance
          const r = parseInt(rgb[0]) / 255;
          const g = parseInt(rgb[1]) / 255;
          const b = parseInt(rgb[2]) / 255;
          const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

          // Set text color based on background luminance
          setTextColor(luminance > 0.5 ? '#000000' : '#ffffff');
        }
      }
    };

    updateTextColor();
    const observer = new MutationObserver(updateTextColor);
    const element = document.querySelector(`.${styles.rightContent}`);

    if (element) {
      observer.observe(element, {
        attributes: true,
        attributeFilter: ['style', 'class'],
        childList: true,
        subtree: true
      });
    }

    window.addEventListener('resize', updateTextColor);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateTextColor);
    };
  }, []);

  return (

    <div className={styles.layout} >
      <header className={styles.header} data-aos="fade-down" data-aos-delay="500">
        <Link to="/admin">
          <h3 className={styles.logo}>Ernesto Levano</h3>
        </Link>


        <Navigation />
      </header>

      <main className={styles.main}>
        <div className={styles.leftContent}>
          <h1>
            <SplitText
              text={"Pragmatic"}
              className={styles.txt1}
              delay={150}
              animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
              animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
              easing="easeOutCubic"
              threshold={0.2}
              rootMargin="-50px"
            />
            <ShinyText
              text={"DEVELOPER."}
              disabled={false}
              speed={4}
              className={styles.txt2}
            />
          </h1>
        </div>
        <div data-aos="fade-up" data-aos-delay="800" className={styles.rightContent}>
          <p>Hi! I'm Ernesto Levano, a Peru-based software engineer passionate about full-stack development, interactive web experiences, and SaaS solutions.</p>
          <p>I started as a backend developer, working with C, C++, and JavaScript in serverless environments, but my fascination with immersive web experiences led me to explore technologies like React, Three.js, and AWS. During a research internship in Germany, I contributed to Laminar, an innovative IoT platform, applying agile methodologies and optimizing scalable architectures.</p>
          <p>Now, I'm focused on building high-performance digital products and SaaS platforms that combine efficiency, interactivity, and an outstanding user experience. 🚀</p>
        </div>
      </main>

      <footer className={styles.footer} >
        <div className={styles.time} >
          <PeruTime />
        </div>

        <div className={styles.social} >
          <a href="https://github.com/ernestolev" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
          <a href="https://www.linkedin.com/in/ernesto-levano-585a48203" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          <a href="https://www.instagram.com/ernesto.lev_/profilecard/?igsh=ZDZjOTY4Njd5eHdv " target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
        </div>

        <div className={styles.copyright} >
          © 2025 EDG
        </div>
      </footer>
    </div>
  );
};

const PeruTime = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const options = {
        timeZone: 'America/Lima',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      setTime(new Date().toLocaleTimeString('es-PE', options));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return <div>{time}</div>;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const AnimatedBackground = () => {
  const location = useLocation();
  const [shapePosition, setShapePosition] = useState({ scale: 1, x: 0, y: 0 });

  useEffect(() => {
    switch (location.pathname) {
      case '/projects':
        setShapePosition({
          scale: 1.5,
          x: -25,
          y: -25
        });
        break;
      case '/contact':
        setShapePosition({
          scale: 1.5,
          x: 25,
          y: -25
        });
        break;
      case '/services':
        setShapePosition({
          scale: 1.5,
          x: 0,
          y: -35
        });
        break;
      default:
        setShapePosition({
          scale: 1,
          x: 0,
          y: 0
        });
    }
  }, [location.pathname]);

  return (
    <div style={{
      position: 'fixed',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: `scale(${shapePosition.scale}) translate(${shapePosition.x}%, ${shapePosition.y}%)`
    }}>
      <ShapeBlur
        variation={0}
        pixelRatioProp={window.devicePixelRatio || 1}
        shapeSize={0.8}
        roundness={0.8}
        borderSize={0.085}
        circleSize={0.04}
        circleEdge={1}
      />
    </div>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      offset: 100,
      easing: 'ease-in-out',
      delay: 100
    });

    const timer = setTimeout(() => {
      setLoading(false);
      // Refresh AOS after loading screen
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      {loading ? (
        <Loading />
      ) : (
        <>
          <AnimatedBackground />
          <div className={styles.container}>
            <div className={styles.content}>
              <AnimatedRoutes />
            </div>
          </div>
        </>
      )}
    </Router>
  );
};

export default App;