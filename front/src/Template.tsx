import { resolvePath, useNavigate, useParams } from "react-router";
import { Card, Header, RowCard, Tag } from "./App";
import { da, faker } from "@faker-js/faker";
import { BookOpen, ChevronDown, ChevronRight, ChevronUp, ImageIcon, Star, PenIcon, Trash } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Book, User as personInfo, Chapter as chapterType, getAChapter, getBook, getChapterQuotes, getChapters, getQuoteSubquotes, getTagsByBook, Quote, SubQuote, Tag as tagtype, UserContext, getUserBooks, getUserFavoriteBooks, fetchBooks, checkBookOwnership } from "./myContext";
import { useSearchParams } from "react-router-dom";
import "./bookeditor.css"
import CreateBookModal, { CreateEditModal } from "./bookeditor";



export function AllTheBooks() {
    const [AllBooks, setAllBooks] = useState<Array<Book>>([]);
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('search') || '';

    useEffect(() => {
        const bookies = fetchBooks();
        bookies.then(res => {
            const filteredBooks = res.filter(book =>
                book.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setAllBooks(filteredBooks);
        });
    }, [searchTerm]);

    return (
        <div className="SiteBase">
            <Header />

            <div className="personProfile">
                <div>
                    <div className="myBookArray">
                        {
                            AllBooks.length > 0 ? AllBooks.map((elem, id) => <Card book={elem} key={id} />) : <span style={{ marginRight: "auto", marginLeft: "auto" }}>"No Results Found"</span>
                        }
                    </div>

                </div>
            </div>
        </div>
    )
}

export function MyPage() {
    const { person } = useParams();
    const [myBooks, setMyBooks] = useState<Book[]>([]);
    const [favBooks, setFavBooks] = useState<Book[]>([]);
    const context = useContext(UserContext);
    const nav = useNavigate();

    useEffect(() => {

        if (!person) return
        // ideally redirect away from here
        //get person books
        const myBookies = getUserBooks(Number(person)) // i am slowly loosing my mind with all this repititveness
        myBookies.then(response => {
            console.log("bookies", response)

            setMyBooks(response);
        });
        //get favorite books
        const myFavBookies = getUserFavoriteBooks(Number(person));
        myFavBookies.then(response => {
            setFavBooks(response);
        });

    }, [person, context?.user])

    const rowSize = 55;


    return (
        <div className="SiteBase">
            <Header />

            <div className="personProfile">
                <h1>{`Hello ${context?.user?.username},`}</h1>
                <div>
                    <h2>Your Books</h2>
                    <div className="myBookArray">
                        {
                            myBooks.map((elem, id) => <Card book={elem} key={id} />)
                        }
                    </div>

                    <hr style={{ marginTop: "2rem", marginBottom: "2rem" }}></hr>
                    <h2>Favorites</h2>
                    <div className="myBookArray">
                        {
                            favBooks.map((elem, id) => <Card book={elem} key={id} />)
                        }
                    </div>

                </div>
            </div>
        </div>

    );
}

export function ViewBook() {
    const [data, setData] = useState<Book>();
    const [bookTags, setBookTags] = useState<tagtype[]>([]);
    const [chapters, setChapters] = useState<chapterType[]>([]);
    const { book } = useParams();
    const [editor, setEditor] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const context = useContext(UserContext);

    useEffect(() => {
        //Override data if their is no book supplied
        //What about ID'?
        if (!book) return;
        const bookie = getBook(book);
        bookie.then(response => {
            //if succeful then set the state
            setData(response);

        });

    }, []);

    useEffect(() => {
        if (!data) return;
        //Get a books tags
        const tags = getTagsByBook(data.book_id);
        tags.then(response => {
            setBookTags(response);
        });
    }, [data])

    useEffect(() => {
        if (!data) return;
        //Get the book chapters
        const fetchChapters = getChapters(data.book_id);
        fetchChapters.then(response => {
            setChapters(response);
        });
    }, [data]);

    useEffect(()=>{
        if(!context && data) return;
        const ownerShip = checkBookOwnership(context?.user?.id!,data?.book_id!);
        ownerShip.then(res=>{setShowEdit(res)});
    },[data, context])


    const rating = data?.rating || 0; // make sure to refresh?
    const nav = useNavigate();

    // Array(6).fill(null).map((elem,key) => <Chapter id={key} quoteCount={Math.floor(Math.random()*10)} title={faker.book.title()} key={"some:"+key} />)

    return (
        <div className="SiteBase">
            <Header />

            <div className="BookPage">
                <div className="BookBreakDown">
                    <div>
                        <img src={"http://localhost:3000/api" + data?.cover_image_url}></img>
                    </div>
                    <div style={{ position: "relative" }}>
                        <h2 style={{ fontSize: "4rem" }}>{data?.title}</h2>
                        {
                            !showEdit ? null :
                            <button className="PenIcon" onClick={() => { setEditor(true) }}><PenIcon size={16} color="white" /></button>
                        }
                        <div className="SomeTagContainer">
                            {
                                bookTags.map((tag, index) => (
                                    <Tag key={index} text={tag.name} />
                                ))
                            }
                        </div>
                        <div className='RatingContainer' style={{ marginTop: "1rem" }}>
                            <div className=''>
                                <Star size={16} fill={rating >= 1 ? 'orange' : 'transparent'} color={rating >= 1 ? 'orange' : 'white'} />
                                <Star size={16} fill={rating >= 2 ? 'orange' : 'transparent'} color={rating >= 2 ? 'orange' : 'white'} />
                                <Star size={16} fill={rating >= 3 ? 'orange' : 'transparent'} color={rating >= 3 ? 'orange' : 'white'} />
                                <Star size={16} fill={rating >= 4 ? 'orange' : 'transparent'} color={rating >= 4 ? 'orange' : 'white'} />
                                <Star size={16} fill={rating >= 5 ? 'orange' : 'transparent'} color={rating >= 5 ? 'orange' : 'white'} />
                            </div>
                            <span className='RatingNumber'>{rating}</span>
                        </div>
                        <p className="MovieTopic">
                            {data?.description}
                        </p>
                    </div>
                </div>
                {showEdit && <button className="Add-Chapter">Add Chapter</button>}
                <div className="ChapterDesign">
                    <h2>Chapters</h2>
                    {
                        chapters.map((elem, id) => {
                            return <Chapter id={elem.chapter_id} canEdit={showEdit} bookID={elem.book_id} index={elem.chapter_number} quoteCount={1} title={elem.title} key={"some:" + id} />
                        })
                    }
                </div>
            </div>
            
            {editor && data && <CreateEditModal
                isOpen={editor}
                onClose={() => setEditor(false)}
                bookId={data?.book_id}
            />}

        </div>
    );
}

export function Chapter({ id, title, quoteCount, bookID, index, canEdit }: {canEdit:boolean; title: string, index: number, id: number, quoteCount: number, bookID: number }) {
    const nav = useNavigate();
    // I dont think I wanna use quote count no more......

    function handleDeletion(e:any){
        e.stopPropagation();
    }
    return (
        <div
            key={id}
            className="ChapterCSS"
            onClick={() => { nav(`/Book/${bookID}/${id}`) }}
        >
            <div>
                <BookOpen />
                <div>
                    <h3 >
                        Chapter {index}: {title}
                    </h3>
                    <p>
                        view quotes
                    </p>
                </div>
            </div>

            <div>
                {canEdit && <button onClick={(e)=>{handleDeletion(e)}}><PenIcon/></button>}
                {canEdit && <button onClick={(e)=>{handleDeletion(e)}}><Trash/></button>}

                <ChevronRight /> 
            </div>

        </div>
    );
}

export function ViewChapter() {
    const { book, chapter } = useParams();
    const [data, setData] = useState<chapterType>();
    const [chapterQuotes, setChapterQuotes] = useState<Quote[]>([]);

    useEffect(() => {
        if (!chapter || !book) return; // may not be needed here
        const chapterID = Number(chapter);
        const bookID = Number(book);
        console.log("We at: ", bookID, chapterID)
        const chaptInfo = getAChapter(bookID, chapterID);
        chaptInfo.then(response => {
            setData(response);
        });

    }, [chapter, book])

    useEffect(() => {
        if (!data) return; // may not be needed here
        const resultChapts = getChapterQuotes(data.chapter_id);
        resultChapts.then(response => {
            console.log("these are the quotes: ", response)
            setChapterQuotes(response);
        })

    }, [data]);


    return (
        <div className="SiteBase">
            <Header />

            <div className="ViewChapterCSS">
                <div className="chapterHeader">
                    <h1>Chapter {data?.chapter_number}: {data?.title}</h1>
                </div>

                <div className="quotesContainer">
                    {chapterQuotes.map((quote, id) => (
                        <QuoteBlock key={id} quote={quote} />
                    ))}
                </div>

            </div>


        </div>
    );
}

function QuoteBlock({ quote }: { quote: Quote }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const [subQuotes, setSubQuotes] = useState<SubQuote[]>([]);

    useEffect(() => {
        const getTheSubs = getQuoteSubquotes(quote.quote_id);
        getTheSubs.then(response => {
            setSubQuotes(response);
        });

    }, [quote]);

    return (
        <div className="quote-block">
            <div className="quote-header" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="quote-label">{quote.quote_number}</div>
                <div className="quote-text">{quote.quote_text}</div>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {isExpanded && (
                <div className="quote-details">
                    <div className="quote-context">
                        <h3>Context</h3>
                        <p>{quote.context /* Shuold be a pitcure? */}</p>
                    </div>

                    <div className="quote-explanation">
                        <h3>Explanation</h3>
                        <p>{quote.explanation}</p>
                    </div>

                    {quote.context_image_location && (
                        <div className="quote-image">
                            <button
                                className="image-button"
                                onClick={() => setShowImage(!showImage)}
                            >
                                <ImageIcon size={20} />
                                <span>View Context Image</span>
                            </button>

                            {showImage && (
                                <img src={"http://localhost:3000/api" + quote.context_image_location} alt="Quote context" />
                            )}
                        </div>
                    )}

                    {subQuotes.length > 0 && (
                        <div className="subquotes">
                            <h3>Related Quotes</h3>
                            {subQuotes.map((subquote: SubQuote, id) => (
                                <div key={id} className="subquote">
                                    <div className="subquote-label">{subquote.subquote_number}</div>
                                    <div className="subquote-content">
                                        <p className="subquote-text">{subquote.subquote_text}</p>
                                        <p className="subquote-explanation">{subquote.explanation}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}





export function EditorPage() {
    const { name } = useParams();


    return (
        <div className="SiteBase">
            <Header />

            <div className="">
                <h1>{`Editing ${name},`}</h1>

            </div>
        </div>

    );
}

