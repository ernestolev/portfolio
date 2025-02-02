import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import styles from "./Projects.module.css";

const ProjectCard = ({ title, description, tech, image, image2, github, live }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={styles.projectCard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={styles.projectImage} 
        style={{ 
          backgroundImage: `url(${isHovered && image2 ? image2 : image})`,
          transition: 'background-image 0.3s ease'
        }} 
      />
      <div className={styles.projectContent}>
        <h3>{title}</h3>
        <p className={styles.description}>{description}</p>
        <div className={styles.techStack}>{tech.join(" • ")}</div>
        <div className={styles.projectLinks}>
          <a href={github} target="_blank" rel="noopener noreferrer"><FaGithub /></a>
          <a href={live} target="_blank" rel="noopener noreferrer"><FaExternalLinkAlt /></a>
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        const projectsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProjects(projectsList);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const asd = [
    {
      title: "Project One",
      description: "A modern web application built with React and Node.js",
      tech: ["React", "Node.js", "MongoDB"],
      image: "https://via.placeholder.com/300x200",
      github: "#",
      live: "#"
    },
    // Add more projects as needed
  ];

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h3 className={styles.logo}>Ernesto Levano</h3>
        <nav className={styles.nav}>
          <Link to="/">Home</Link>
          <Link to="/projects"> <span className={styles.resalt}>Projects</span> </Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.sidebar}>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Featured Portfolio
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            A collection of my best work showcasing my skills in web development and design.
          </motion.p>
        </div>

        <div className={styles.projectsGrid}>
          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : (
            projects.map((project, index) => (
              <ProjectCard key={project.id} {...project} />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Projects;