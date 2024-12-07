

import React, { useState, useContext, useEffect } from 'react';
import { X, Upload, Save } from 'lucide-react';
import { UserContext, API_BASE_URL, getBook, BASE_URL, deleteBook } from './myContext';
import { useNavigate } from 'react-router-dom';
import './bookeditor.css';

const CreateBookModal = ({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [rating, setRating] = useState(0);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState('/api/placeholder/400/600');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const context = useContext(UserContext);
    const navigate = useNavigate();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!context?.user?.id) {
            setError('Must be logged in to create a book');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('rating', rating.toString());
            formData.append('userId', context.user.id.toString());
            if (coverImage) {
                formData.append('coverImage', coverImage);
            }

            const response = await fetch(`${API_BASE_URL}/books`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to create book');
            }

            const newBook = await response.json();
            onClose();
            navigate(`/Book/${newBook.book_id}`);
        } catch (err) {
            setError('Failed to create book. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="create-book-overlay">
            <div className="create-book-modal">
                <div className="modal-header">
                    <h2>Create New Book</h2>
                    <button onClick={onClose} className="close-button">
                        <X />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="create-book-form">
                    <div className="form-content">
                        <div className="cover-section">
                            <div className="cover-upload">
                                <img src={previewUrl} alt="Book cover preview" />
                                <label className="upload-label">
                                    <div className="upload-button">
                                        <Upload size={20} />
                                        <span>Upload Cover</span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="book-details">
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    placeholder="Enter book title"
                                />
                            </div>

                            <div className="form-group">
                                <label>Initial Rating</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    value={rating}
                                    onChange={(e) => setRating(parseFloat(e.target.value))}
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    rows={4}
                                    placeholder="Enter book description"
                                />
                            </div>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cancel-button"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isSubmitting}
                        >
                            <Save size={20} />
                            {isSubmitting ? 'Creating...' : 'Create Book'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export const CreateEditModal = ({
    isOpen,
    onClose,
    bookId
}: {isOpen:boolean,onClose:any,bookId:number}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [rating, setRating] = useState(0);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState('/api/placeholder/400/600');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    
    const context = useContext(UserContext);
    const navigate = useNavigate();

    // Fetch existing book data if editing
    useEffect(() => {
        if (bookId) {
            getBook(bookId).then(book => {
                setTitle(book.title);
                setDescription(book.description);
                setRating(book.rating);
                setPreviewUrl(API_BASE_URL + book.cover_image_url);
            }).catch(err => {
                setError('Failed to load book data');
                console.error(err);
            });
        }
    }, [bookId]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleDelete = () => () => {
        deleteBook(bookId);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!context?.user?.id) {
            setError('Must be logged in to edit book');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('rating', rating.toString());
            formData.append('userId', context.user.id.toString());
            if (coverImage) {
                formData.append('coverImage', coverImage);
            }

            const url = `${BASE_URL}/updateBooks/${bookId}`
                
            const method = 'PUT';

            console.log(url)
            const response = await fetch(url, {
                method: method,
                body: formData,
            });

            if (!response.ok) {
                throw new Error(bookId ? 'Failed to update book' : 'Failed to create book');
            }

            const book = await response.json();
            onClose();
            navigate(`/Book/${book.book_id}`);
        } catch (err) {
            setError(bookId ? 'Failed to update book. Please try again.' : 'Failed to create book. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="create-book-overlay">
            <div className="create-book-modal">
                <div className="modal-header">
                    <h2>{bookId ? 'Edit Book' : 'Create New Book'}</h2>
                    <button onClick={onClose} className="close-button">
                        <X />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="create-book-form">
                    <div className="form-content">
                        <div className="cover-section">
                            <div className="cover-upload">
                                <img src={previewUrl} alt="Book cover preview" />
                                <label className="upload-label">
                                    <div className="upload-button">
                                        <Upload size={20} />
                                        <span>Upload Cover</span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="book-details">
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    defaultValue={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    placeholder="Enter book title"
                                />
                            </div>

                            <div className="form-group">
                                <label>Rating</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    defaultValue={rating}
                                    onChange={(e) => setRating(parseFloat(e.target.value))}
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    defaultValue={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    rows={4}
                                    placeholder="Enter book description"
                                />
                            </div>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cancel-button"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isSubmitting}
                        >
                            <Save size={20} />
                            {isSubmitting ? (bookId ? 'Updating...' : 'Creating...') : (bookId ? 'Update Book' : 'Create Book')}
                        </button>
                        <button onClick={()=>{handleDelete()}} className='delete-button'>Delete</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBookModal;