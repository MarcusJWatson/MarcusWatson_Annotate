import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header, Tag } from './App';
import { BookOpen, ChevronRight, X, Plus, Upload } from 'lucide-react';
import { faker } from '@faker-js/faker';
import './BookEditor.css';

//I need a go back arrow button on the chapter view page.
//Changes to make to the editor.
//Limit the size of the picture.
//Should only be a single page wit ha scrollable right side for the chapters.
//
//Not loading when pressing edit a chapter.
//onUpdate should be onDrag
//book quote numbering is incorrect



interface Subquote {
    id: string;
    text: string;
    explanation: string;
}

interface Quote {
    id: string;
    text: string;
    context: string;
    explanation: string;
    imageUrl: string;
    subquotes: Subquote[];
}

interface Chapter {
    id: number;
    title: string;
    quoteCount: number;
}

interface BookData {
    title: string;
    description: string;
    image: string;
    tags: string[];
    rating: number;
    chapters: Chapter[];
}

interface ChapterData {
    title: string;
    quotes: Quote[];
}

interface EditTarget {
    type: 'book' | 'quote' | 'subquote';
    data: BookData | Quote | Subquote;
}

interface EditPopupProps {
    target: EditTarget;
    onClose: () => void;
    onSave: (data: any) => void;
}

const EditPopup: React.FC<EditPopupProps> = ({ target, onClose, onSave }) => (
    <div className="modal-overlay">
        <div className="modal-content">
            <div className="modal-header">
                <h3 className="modal-title">Edit {target.type}</h3>
                <button onClick={onClose} className="modal-close">
                    <X size={20} />
                </button>
            </div>
            {target.type === 'book' && (
                <div>
                    <input
                        type="text"
                        value={(target.data as BookData).title}
                        onChange={(e) => onSave({ ...(target.data as BookData), title: e.target.value })}
                        className="input-field"
                        placeholder="Book Title"
                    />
                    <textarea
                        value={(target.data as BookData).description}
                        onChange={(e) => onSave({ ...(target.data as BookData), description: e.target.value })}
                        className="textarea-field"
                        placeholder="Book Description"
                    />
                    <div className="tag-editor">
                        {(target.data as BookData).tags.map((tag, i) => (
                            <div key={i} className="tag-item">
                                <input
                                    value={tag}
                                    onChange={(e) => {
                                        const newTags = [...(target.data as BookData).tags];
                                        newTags[i] = e.target.value;
                                        onSave({ ...(target.data as BookData), tags: newTags });
                                    }}
                                    className="tag-input"
                                />
                                <button onClick={() => {
                                    const newTags = (target.data as BookData).tags.filter((_, index) => index !== i);
                                    onSave({ ...(target.data as BookData), tags: newTags });
                                }}>
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => onSave({
                                ...(target.data as BookData),
                                tags: [...(target.data as BookData).tags, '']
                            })}
                            className="edit-button"
                        >
                            <Plus size={16} /> Add Tag
                        </button>
                    </div>
                </div>
            )}
            {target.type === 'quote' && (
                <div>
                    <textarea
                        value={(target.data as Quote).text}
                        onChange={(e) => onSave({ ...(target.data as Quote), text: e.target.value })}
                        className="textarea-field"
                        placeholder="Quote Text"
                    />
                    <textarea
                        value={(target.data as Quote).context}
                        onChange={(e) => onSave({ ...(target.data as Quote), context: e.target.value })}
                        className="textarea-field"
                        placeholder="Context"
                    />
                    <textarea
                        value={(target.data as Quote).explanation}
                        onChange={(e) => onSave({ ...(target.data as Quote), explanation: e.target.value })}
                        className="textarea-field"
                        placeholder="Explanation"
                    />
                </div>
            )}
            <div className="flex justify-end mt-4">
                <button onClick={onClose} className="edit-button">
                    Save Changes
                </button>
            </div>
        </div>
    </div>
);

const BookEditor: React.FC = () => {
    const { name, chapter } = useParams();
    const nav = useNavigate();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editTarget, setEditTarget] = useState<EditTarget | null>(null);

    const [bookData, setBookData] = useState<BookData>({
        title: name || faker.music.songName(),
        description: faker.lorem.paragraph(),
        image: faker.image.urlPicsumPhotos(),
        tags: Array(3).fill(null).map(() => faker.word.noun()),
        rating: Number((Math.random() * 4 + 1).toFixed(1)),
        chapters: Array(6).fill(null).map((_, i) => ({
            id: i,
            title: faker.book.title(),
            quoteCount: Math.floor(Math.random() * 10)
        }))
    });

    useEffect(() => {
        if (chapter) {
            setChapterData({
                title: faker.book.title(),
                quotes: Array(3).fill(null).map((_, i) => ({
                    id: `${chapter}.${i + 1}`,
                    text: faker.lorem.paragraph(),
                    context: faker.lorem.sentence(),
                    explanation: faker.lorem.paragraph(),
                    imageUrl: "/api/placeholder/400/300",
                    subquotes: Array(2).fill(null).map((_, j) => ({
                        id: `${chapter}.${i + 1}.${j + 1}`,
                        text: faker.lorem.sentence(),
                        explanation: faker.lorem.paragraph()
                    }))
                }))
            });
        }
    }, [chapter]);

    const [chapterData, setChapterData] = useState<ChapterData | null>(chapter ? {
        title: faker.book.title(),
        quotes: Array(3).fill(null).map((_, i) => ({
            id: `${chapter}.${i + 1}`,
            text: faker.lorem.paragraph(),
            context: faker.lorem.sentence(),
            explanation: faker.lorem.paragraph(),
            imageUrl: "/api/placeholder/400/300",
            subquotes: Array(2).fill(null).map((_, j) => ({
                id: `${chapter}.${i + 1}.${j + 1}`,
                text: faker.lorem.sentence(),
                explanation: faker.lorem.paragraph()
            }))
        }))
    } : null);

    const handleEdit = (type: 'book' | 'quote' | 'subquote', data: BookData | Quote | Subquote) => {
        setEditTarget({ type, data });
        setIsEditing(true);
    };

    const handleSave = (newData: BookData | Quote | Subquote) => {
        if (editTarget?.type === 'book') {
            setBookData(newData as BookData);
        } else if (editTarget?.type === 'quote' && chapterData) {
            const newQuotes = chapterData.quotes.map(q =>
                q.id === (newData as Quote).id ? (newData as Quote) : q
            );
            setChapterData({ ...chapterData, quotes: newQuotes });
        }
        setIsEditing(false);
    };

    return (
        <div className="SiteBase">
            <Header />

            {!chapter ? (
                <div className="editor-base">
                    <div className="book-container">
                        <div className="book-layout">
                            <div className="book-image-container">
                                <img src={bookData.image} className="book-image" alt="Book cover" />
                                <div className="image-overlay">
                                    <button className="upload-button">
                                        <Upload size={20} />
                                        Change Cover
                                    </button>
                                </div>
                            </div>
                            <div className="book-content">
                                <div className="book-header">
                                    <h2 className="book-title">{bookData.title}</h2>
                                    <button
                                        onClick={() => handleEdit('book', bookData)}
                                        className="edit-button"
                                    >
                                        Edit Details
                                    </button>
                                </div>
                                <div className="tag-container">
                                    {bookData.tags.map((tag, i) => (
                                        <Tag key={i} text={tag} />
                                    ))}
                                </div>
                                <p>{bookData.description}</p>
                                <div className="chapter-list">
                                    <h3 className="text-xl font-bold mb-4">Chapters</h3>
                                    {bookData.chapters.map((chapter) => (
                                        <div
                                            key={chapter.id}
                                            className="chapter-item"
                                            onClick={() => nav(`/Editor/${name}/${chapter.id}`)}
                                        >
                                            <div className="chapter-info">
                                                <BookOpen size={20} />
                                                <div>
                                                    <h4>Chapter {chapter.id}: {chapter.title}</h4>
                                                    <p>{chapter.quoteCount} quotes</p>
                                                </div>
                                            </div>
                                            <ChevronRight size={20} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                chapterData && (
                    <div className="editor-base">
                        <h2 className="text-3xl font-bold mb-8">
                            Chapter {chapter}: {chapterData.title}
                        </h2>
                        {chapterData.quotes.map((quote) => (
                            <div key={quote.id} className="quote-container">
                                <div className="quote-header">
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Quote {quote.id}</h3>
                                        <p>{quote.text}</p>
                                    </div>
                                    <button
                                        onClick={() => handleEdit('quote', quote)}
                                        className="edit-button"
                                    >
                                        Edit Quote
                                    </button>
                                </div>
                                {quote.subquotes.map((subquote) => (
                                    <div key={subquote.id} className="subquote-container">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold mb-2">Subquote {subquote.id}</h4>
                                                <p>{subquote.text}</p>
                                                <p className="text-gray-300 mt-2">{subquote.explanation}</p>
                                            </div>
                                            <button
                                                onClick={() => handleEdit('subquote', subquote)}
                                                className="edit-button"
                                            >
                                                Edit Subquote
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                        <button
                            className="edit-button mt-4"
                            onClick={() => {
                                if (chapterData) {
                                    const newQuote: Quote = {
                                        id: `${chapter}.${chapterData.quotes.length + 1}`,
                                        text: '',
                                        context: '',
                                        explanation: '',
                                        imageUrl: "/api/placeholder/400/300",
                                        subquotes: []
                                    };
                                    setChapterData({
                                        ...chapterData,
                                        quotes: [...chapterData.quotes, newQuote]
                                    });
                                    handleEdit('quote', newQuote);
                                }
                            }}
                        >
                            Add New Quote
                        </button>
                    </div>
                )
            )}

            {isEditing && editTarget && (
                <EditPopup
                    target={editTarget}
                    onClose={() => setIsEditing(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default BookEditor;

// Export the types for use in other components
export type {
    Subquote,
    Quote,
    Chapter,
    BookData,
    ChapterData,
    EditTarget
};