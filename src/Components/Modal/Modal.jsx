import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Modal.module.css';

const Modal = ({ isOpen, onClose, children }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className={styles.overlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className={styles.modal}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                    >
                        <button className={styles.closeButton} onClick={onClose}>×</button>
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
export default Modal;