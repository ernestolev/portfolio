import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    onSnapshot,
    setDoc,
    getDoc
} from 'firebase/firestore';
import { db } from '../../firebase';
import Modal from '../../Components/Modal/Modal';
import styles from './Admin.module.css';
import imageCompression from 'browser-image-compression';
import ServiceForm from '../../Components/ServiceForm/ServiceForm';


const ProjectForm = ({ project, onSubmit, isUploading }) => {
    const [formData, setFormData] = useState(project ? {
        ...project,
        tech: Array.isArray(project.tech) ? project.tech.join(', ') : project.tech
    } : {
        title: '',
        description: '',
        tech: '',
        image: '',
        image2: '',
        github: '',
        live: ''
    });
    const [uploadingImage, setUploadingImage] = useState(false);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (uploadingImage) {
            alert('Please wait for images to finish uploading');
            return;
        }

        try {
            setUploadingImage(true);
            await onSubmit(formData);
            setFormData({
                title: '',
                description: '',
                tech: '',
                image: '',
                image2: '',
                github: '',
                live: ''
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error saving project. Please try again.');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleImageUpload = async (file, imageField) => {
        if (!file) return;

        try {
            // Compression options
            const options = {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 1024,
                useWebWorker: true,
                initialQuality: 0.8,
            };

            // Compress the image
            const compressedFile = await imageCompression(file, options);

            // Convert to base64
            const reader = new FileReader();
            reader.readAsDataURL(compressedFile);

            reader.onload = () => {
                const base64Image = reader.result;
                // Verify size before setting
                if (base64Image.length > 1048487) {
                    alert('Image is too large. Please choose a smaller image.');
                    return;
                }
                setFormData(prev => ({ ...prev, [imageField]: base64Image }));
            };
        } catch (error) {
            console.error('Error handling image:', error);
            alert('Error processing image. Please try again.');
        }
    };


    return (
        <form onSubmit={handleFormSubmit}>
            <div className={styles.formGroup}>
                <label>Title</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label>Technologies (comma-separated)</label>
                <input
                    type="text"
                    value={formData.tech}
                    onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
                    required
                />
            </div>
            <div className={styles.imageUploadGroup}>
                <label>Main Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0], 'image')}
                />
                {formData.image && (
                    <div className={styles.imagePreview}>
                        <img src={formData.image} alt="Preview 1" />
                    </div>
                )}
            </div>
            <div className={styles.imageUploadGroup}>
                <label>Secondary Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0], 'image2')}
                />
                {formData.image2 && (
                    <div className={styles.imagePreview}>
                        <img src={formData.image2} alt="Preview 2" />
                    </div>
                )}
            </div>
            <div className={styles.formGroup}>
                <label>GitHub URL</label>
                <input
                    type="url"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label>Live Demo URL</label>
                <input
                    type="url"
                    value={formData.live}
                    onChange={(e) => setFormData({ ...formData, live: e.target.value })}
                    required
                />
            </div>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={uploadingImage || isUploading}
                className={styles.submitBtn}
            >
                {uploadingImage ? 'Uploading...' : project ? 'Update Project' : 'Add Project'}
            </motion.button>
        </form>
    );
};

const Admin = () => {
    const [activeSection, setActiveSection] = useState('projects');
    const [projects, setProjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [loading, setLoading] = useState(true);
    const [services, setServices] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [editingService, setEditingService] = useState(null);
    const [contactInfo, setContactInfo] = useState({
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        location: '',
        availability: ''
    });

    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const contactInfoRef = doc(db, 'info-contacto', 'main');
                const docSnap = await getDoc(contactInfoRef);
                if (docSnap.exists()) {
                    setContactInfo(docSnap.data());
                }
            } catch (error) {
                console.error('Error fetching contact info:', error);
            }
        };
        fetchContactInfo();
    }, []);


    useEffect(() => {
        let unsubscribe;
        const initFetch = async () => {
            unsubscribe = await fetchData();
        };

        initFetch();

        return () => {
            if (unsubscribe && typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
    }, [activeSection]);



    const fetchData = async () => {
        try {
            setLoading(true);
            const collectionRef = collection(db, activeSection);

            return onSnapshot(collectionRef, (snapshot) => {
                const dataList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                switch (activeSection) {
                    case 'projects':
                        setProjects(dataList);
                        break;
                    case 'services':
                        setServices(dataList);
                        break;
                    case 'contacts':
                        setContacts(dataList);
                        break;
                    default:
                        break;
                }
                setLoading(false);
            });
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    const handleContactInfoUpdate = async (e) => {
        e.preventDefault();
        try {
            const contactInfoRef = doc(db, 'info-contacto', 'main');
            const data = {
                ...contactInfo,
                updatedAt: new Date().toISOString()
            };

            await setDoc(contactInfoRef, data);
            alert('Contact info updated successfully!');
        } catch (error) {
            console.error('Error updating contact info:', error);
            alert(`Error updating contact info: ${error.message}`);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'projects', id));
            fetchData();
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            setUploadingImages(true);

            const projectData = {
                title: formData.title,
                description: formData.description,
                tech: Array.isArray(formData.tech) ? formData.tech : formData.tech.split(',').map(tech => tech.trim()),
                image: formData.image || '',
                image2: formData.image2 || '',
                github: formData.github,
                live: formData.live,
                updatedAt: new Date().toISOString()
            };

            if (editingProject) {
                await updateDoc(doc(db, 'projects', editingProject), projectData);
            } else {
                await addDoc(collection(db, 'projects'), {
                    ...projectData,
                    createdAt: new Date().toISOString()
                });
            }

            setIsModalOpen(false);
            setEditingProject(null);
            await fetchData();

        } catch (error) {
            console.error('Error saving project:', error);
            throw error;
        } finally {
            setUploadingImages(false);
        }
    };

    const handleEdit = (section, id) => {
        if (section === 'services') {
            setEditingService(id);
        } else if (section === 'projects') {
            setEditingProject(id);
        }
        setIsModalOpen(true);
    };

    const handleServiceSubmit = async (formData) => {
        try {
            setUploadingImages(true);

            const serviceData = {
                category: formData.category,
                services: formData.services.split(',').map(service => service.trim()),
                images: formData.images,
                updatedAt: new Date().toISOString()
            };

            if (editingService) {
                await updateDoc(doc(db, 'services', editingService), serviceData);
                setEditingService(null);
            } else {
                await addDoc(collection(db, 'services'), {
                    ...serviceData,
                    createdAt: new Date().toISOString()
                });
            }

            setIsModalOpen(false);
            await fetchData();

        } catch (error) {
            console.error('Error saving service:', error);
            throw error;
        } finally {
            setUploadingImages(false);
        }
    };


    const renderContent = () => {
        switch (activeSection) {
            case 'projects':
                return (
                    <div className={styles.projectsList}>
                        <div className={styles.listHeader}>
                            <h2>Projects</h2>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setEditingProject(null);
                                    setIsModalOpen(true);
                                }}
                                className={styles.addButton}
                            >
                                Add New Project <span>+</span>
                            </motion.button>
                        </div>

                        <div className={styles.projectslistcontainer}>
                            {loading ? (
                                <div className={styles.loading}>Loading...</div>
                            ) : (
                                projects.map((project) => (
                                    <motion.div
                                        key={project.id}
                                        className={styles.projectCard}
                                        layout
                                    >
                                        <h3>{project.title}</h3>
                                        <p>{project.description}</p>
                                        <div className={styles.techTags}>
                                            {project.tech.map((tech, index) => (
                                                <span key={index} className={styles.tag}>{tech}</span>
                                            ))}
                                        </div>
                                        <div className={styles.projectActions}>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    setEditingProject(project.id);
                                                    setIsModalOpen(true);
                                                }}
                                                className={styles.editBtn}
                                            >
                                                Edit
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleDelete(project.id)}
                                                className={styles.deleteBtn}
                                            >
                                                Delete
                                            </motion.button>
                                        </div>
                                    </motion.div>

                                ))
                            )}
                        </div>
                    </div>
                );

            case 'services':
                return (
                    <div className={styles.servicesList}>
                        <div className={styles.listHeader}>
                            <h2>Services</h2>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setEditingService(null);
                                    setIsModalOpen(true);
                                }}
                                className={styles.addButton}
                            >
                                Add New Service
                            </motion.button>
                        </div>
                        <div className={styles.servicesContainer}>
                            {loading ? (
                                <div className={styles.loading}>Loading...</div>
                            ) : (
                                services.map((service) => (
                                    <motion.div
                                        key={service.id}
                                        className={styles.serviceCard}
                                        layout
                                    >
                                        <h3>{service.category}</h3>
                                        <div className={styles.tags}>
                                            {service.services && service.services.map((service, index) => (
                                                <span key={index} className={styles.tag}>{service}</span>
                                            ))}
                                        </div>
                                        <div className={styles.imagesGrid}>
                                            {service.images && service.images.map((img, index) => (
                                                <div key={index} className={styles.imagePreview}>
                                                    <img src={img} alt={`Service ${index + 1}`} />
                                                </div>
                                            ))}
                                        </div>
                                        <div className={styles.serviceActions}>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleEdit('services', service.id)}
                                                className={styles.editBtn}
                                            >
                                                Edit
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleDelete('services', service.id)}
                                                className={styles.deleteBtn}
                                            >
                                                Delete
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                );

            case 'contacts':
                return (
                    <div className={styles.contactsList}>
                        <div className={styles.contactsSection}>
                            <div className={styles.listHeader}>
                                <h2>My Contact Information</h2>

                            </div>
                            <form onSubmit={handleContactInfoUpdate} className={styles.contactInfoForm}>
                                <div className={styles.formGroup}>
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={contactInfo.email}
                                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Phone</label>
                                    <input
                                        type="tel"
                                        value={contactInfo.phone}
                                        onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>LinkedIn URL</label>
                                    <input
                                        type="url"
                                        value={contactInfo.linkedin}
                                        onChange={(e) => setContactInfo({ ...contactInfo, linkedin: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>GitHub URL</label>
                                    <input
                                        type="url"
                                        value={contactInfo.github}
                                        onChange={(e) => setContactInfo({ ...contactInfo, github: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Location</label>
                                    <input
                                        type="text"
                                        value={contactInfo.location}
                                        onChange={(e) => setContactInfo({ ...contactInfo, location: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Availability Status</label>
                                    <input
                                        type="text"
                                        value={contactInfo.availability}
                                        onChange={(e) => setContactInfo({ ...contactInfo, availability: e.target.value })}
                                        required
                                    />
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    className={styles.submitBtn}
                                >
                                    Update Contact Info
                                </motion.button>
                            </form>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };


    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <Link to="/">
                    <h3 className={styles.logo}>Admin Panel</h3>
                </Link>

                <nav className={styles.adminNav}>
                    <button
                        className={`${styles.navButton} ${activeSection === 'projects' ? styles.active : ''}`}
                        onClick={() => setActiveSection('projects')}
                    >
                        Projects
                    </button>
                    <button
                        className={`${styles.navButton} ${activeSection === 'services' ? styles.active : ''}`}
                        onClick={() => setActiveSection('services')}
                    >
                        Services
                    </button>
                    <button
                        className={`${styles.navButton} ${activeSection === 'contacts' ? styles.active : ''}`}
                        onClick={() => setActiveSection('contacts')}
                    >
                        Contacts
                    </button>
                </nav>
            </header>

            <main className={styles.main}>
                <div className={styles.gridContainer}>
                    {renderContent()}
                </div>
            </main>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingProject(null);
                    setEditingService(null);
                }}
            >
                {activeSection === 'projects' ? (
                    <ProjectForm
                        project={editingProject ? projects.find(p => p.id === editingProject) : null}
                        onSubmit={handleSubmit}
                        isUploading={uploadingImages}
                    />
                ) : activeSection === 'services' ? (
                    <ServiceForm
                        service={editingService ? services.find(s => s.id === editingService) : null}
                        onSubmit={handleServiceSubmit}
                        isUploading={uploadingImages}
                    />
                ) : null}
            </Modal>
        </div>
    );
};

export default Admin;