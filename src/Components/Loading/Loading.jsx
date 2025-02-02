import React from 'react';
import { motion } from 'framer-motion';
import styles from './Loading.module.css';

const Loading = () => {
  return (
    <motion.div 
      className={styles.loadingContainer}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.8, ease: "easeInOut" }
      }}
    >
      <div className={styles.content}>
        <motion.div 
          className={styles.circle}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            transition: { 
              duration: 1.2,
              ease: "easeOut"
            }
          }}
          exit={{ 
            scale: 1.2,
            opacity: 0,
            transition: { 
              duration: 0.8,
              ease: "easeInOut"
            }
          }}
        />
      </div>
    </motion.div>
  );
};

export default Loading;