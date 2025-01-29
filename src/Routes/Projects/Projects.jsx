import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import styles from "./Projects.module.css";

const ProjectCard = ({ title, description, tech, image, github, live }) => (
  <motion.div 
    className={styles.projectCard}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className={styles.projectImage} style={{ backgroundImage: `url(${image})` }} />
    <div className={styles.projectContent}>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className={styles.techStack}>{tech.join(" • ")}</div>
      <div className={styles.projectLinks}>
        <a href={github} target="_blank" rel="noopener noreferrer"><FaGithub /></a>
        <a href={live} target="_blank" rel="noopener noreferrer"><FaExternalLinkAlt /></a>
      </div>
    </div>
  </motion.div>
);

const Projects = () => {
  const projects = [
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
          <Link to="/projects">Projects</Link>
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
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Projects;