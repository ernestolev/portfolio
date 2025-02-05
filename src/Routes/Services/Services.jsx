import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import styles from './Services.module.css';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'services'), (snapshot) => {
            const servicesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setServices(servicesData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className={styles.layout}>
            <header className={styles.header}>
               <h3 className={styles.logo}>Ernesto Levano</h3>
                <nav className={styles.nav}>
                    <Link to="/">Home</Link>
                    <Link to="/projects">Projects</Link>
                    <Link to="/services"><span className={styles.resalt}>Services</span> </Link>
                    <Link to="/contact">Contact</Link>
                </nav>
            </header>

            <main className={styles.main}>
                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Services
                </motion.h1>

                <div className={styles.servicesGrid}>
                    {loading ? (
                        <div className={styles.loading}>Loading...</div>
                    ) : (
                        services.map((service) => (
                            <motion.div
                                key={service.id}
                                className={styles.serviceCard}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className={styles.iconGrid}>
                                    {service.images && service.images.map((img, index) => (
                                        <div key={index} className={styles.iconWrapper}>
                                            <img src={img} alt={`Service icon ${index + 1}`} />
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.serviceContent}>
                                    <h2>{service.category}</h2>
                                    <div className={styles.servicesList}>
                                        {service.services && service.services.map((item, index) => (
                                            <span key={index} className={styles.serviceItem}>
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default Services;