import React, { useState } from 'react';
import { motion } from 'framer-motion';
import imageCompression from 'browser-image-compression';
import styles from './ServiceForm.module.css';

const ServiceForm = ({ service, onSubmit, isUploading }) => {
    const [formData, setFormData] = useState(service ? {
        ...service,
        services: Array.isArray(service.services) ? service.services.join(', ') : service.services
    } : {
        category: '',
        services: '',
        images: []
    });
    

    const handleImageUpload = async (files) => {
        if (formData.images.length + files.length > 6) {
            alert('Maximum 6 images allowed');
            return;
        }

        for (let file of files) {
            try {
                const options = {
                    maxSizeMB: 0.5,
                    maxWidthOrHeight: 1024,
                    useWebWorker: true,
                    initialQuality: 0.8,
                };

                const compressedFile = await imageCompression(file, options);
                const reader = new FileReader();
                reader.readAsDataURL(compressedFile);

                reader.onload = () => {
                    const base64Image = reader.result;
                    if (base64Image.length > 1048487) {
                        alert('Image is too large. Please choose a smaller image.');
                        return;
                    }
                    setFormData(prev => ({
                        ...prev,
                        images: [...prev.images, base64Image]
                    }));
                };
            } catch (error) {
                console.error('Error handling image:', error);
            }
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
        }}>
            <div className={styles.formGroup}>
                <label>Category</label>
                <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label>Services (comma-separated)</label>
                <textarea
                    value={formData.services}
                    onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                    placeholder="Service 1, Service 2, Service 3..."
                    required
                />
            </div>
            <div className={styles.imageUploadGroup}>
                <label>Images (Max 6)</label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(Array.from(e.target.files))}
                    disabled={formData.images.length >= 6}
                />
                <div className={styles.imageGrid}>
                    {formData.images.map((img, index) => (
                        <div key={index} className={styles.imagePreview}>
                            <img src={img} alt={`Preview ${index + 1}`} />
                            <button
                                type="button"
                                className={styles.removeBtn}
                                onClick={() => removeImage(index)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isUploading}
                className={styles.submitBtn}
            >
                {service ? 'Update Service' : 'Add Service'}
            </motion.button>
        </form>
    );
};

export default ServiceForm;