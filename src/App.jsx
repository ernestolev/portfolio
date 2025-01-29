import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { FaGithub, FaLinkedin, FaInstagram, } from 'react-icons/fa';
import Projects from "./Routes/Projects/Projects";
import Contact from "./Routes/Contact/Contact";
import styles from "./App.module.css";
import ShapeBlur from '../src/Backgrounds/ShapeBlur/ShapeBlur';


const Navigation = () => (
  <nav className={styles.nav}>
    <Link to="/">Home</Link>
    <Link to="/projects">Projects</Link>
    <Link to="/contact">Contact</Link>
  </nav>
);

const Home = () => (
  <div className={styles.layout}>
    <header className={styles.header}>
      <h3 className={styles.logo}>Ernesto Levano</h3>
      <Navigation />
    </header>

    <main className={styles.main}>
      <div className={styles.leftContent}>
        <h1>
          <span className={styles.txt1}>Pragmatic</span>
          <span className={styles.txt2}>DEVELOPER.</span>
        </h1>
      </div>

      <div className={styles.rightContent}>
        <p>
          Hi! I'm <strong>Ernesto Levano</strong>, a <span className={styles.highlight}>Peru-based software engineer</span> passionate about <strong>full-stack development</strong>, <span className={styles.highlight}>interactive web experiences</span>, and <strong>SaaS solutions</strong>.
        </p>
        <p>
          I started as a <strong>backend developer</strong>, working with <span className={styles.code}>C, C++, and JavaScript</span> in <strong>serverless environments</strong>, but my fascination with <span className={styles.highlight}>immersive web experiences</span> led me to explore technologies like <strong>React, Three.js, and AWS</strong>.
          During a <span className={styles.highlight}>research internship in Germany</span>, I contributed to <strong>Laminar</strong>, an innovative <span className={styles.highlight}>IoT platform</span>, applying <strong>agile methodologies</strong> and optimizing <span className={styles.highlight}>scalable architectures</span>.
        </p>
        <p>
          Now, I'm focused on building <strong>high-performance digital products</strong> and <span className={styles.highlight}>SaaS platforms</span> that combine <strong>efficiency</strong>, <span className={styles.highlight}>interactivity</span>, and an <strong>outstanding user experience</strong>. 🚀
        </p>
      </div>

    </main>

    <footer className={styles.footer}>
      <div className={styles.time}>
        <PeruTime />
      </div>

      <div className={styles.social}>
        <a href="https://github.com/ernestolev" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
        <a href="https://www.linkedin.com/in/ernesto-levano-585a48203" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
        <a href="https://www.instagram.com/ernesto.lev_/profilecard/?igsh=ZDZjOTY4Njd5eHdv " target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
      </div>

      <div className={styles.copyright}>
        © 2025 EDG
      </div>
    </footer>
  </div>
);

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
      position: 'absolute',
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
  return (
    <Router>
      <AnimatedBackground />
      <div className={styles.container}>
        <div className={styles.content}>
          <AnimatedRoutes />
        </div>
      </div>
    </Router>
  );
};

export default App;