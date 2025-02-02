import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import styles from "./Contact.module.css";
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { FaPhone, FaClock } from 'react-icons/fa';



const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    location: '',
    availability: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);


  const [loading, setLoading] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const messagesRef = collection(db, 'mensajes');
      await addDoc(messagesRef, {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        createdAt: new Date().toISOString(),
        read: false
      });

      setFormData({ name: '', email: '', message: '' });
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert(`Error sending message: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const docRef = doc(db, 'info-contacto', 'main');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setContactInfo(docSnap.data());
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching contact info:', error);
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);


  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h3 className={styles.logo}>Ernesto Levano</h3>
        <nav className={styles.nav}>
          <Link to="/">Home</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/contact"><span className={styles.resalt} >Contact</span> </Link>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.contactInfo}>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Let's Connect
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Feel free to reach out for collaborations or just a friendly hello
          </motion.p>
          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : (
            <>
              <motion.div
                className={styles.contactDetails}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {contactInfo.email && (
                  <div className={styles.contactItem}>
                    <FaEnvelope />
                    <span>{contactInfo.email}</span>
                  </div>
                )}
                {contactInfo.location && (
                  <div className={styles.contactItem}>
                    <FaMapMarkerAlt />
                    <span>{contactInfo.location}</span>
                  </div>
                )}
                {contactInfo.phone && (
                  <div className={styles.contactItem}>
                    <FaPhone />
                    <span>{contactInfo.phone}</span>
                  </div>
                )}
                {contactInfo.availability && (
                  <div className={styles.contactItem}>
                    <FaClock />
                    <span>{contactInfo.availability}</span>
                  </div>
                )}
              </motion.div>

              <motion.div
                className={styles.socialLinks}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {contactInfo.github && (
                  <a href={contactInfo.github} target="_blank" rel="noopener noreferrer">
                    <FaGithub />
                  </a>
                )}
                {contactInfo.linkedin && (
                  <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin />
                  </a>
                )}
              </motion.div>
            </>
          )}
        </div>

        <motion.form
          className={styles.contactForm}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
        >
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <textarea
              placeholder="Your Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSubmitting}
            className={`${styles.submitButton} ${isSubmitting ? styles.submitting : ''}`}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </motion.button>
        </motion.form>
      </main>
    </div>
  );
};

export default Contact;