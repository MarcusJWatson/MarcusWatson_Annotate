import { useNavigate, useParams } from "react-router";
import { Card, Header, RowCard, Tag } from "./App";
import { faker } from "@faker-js/faker";
import { BookOpen, ChevronDown, ChevronRight, ChevronUp, ImageIcon, Star } from "lucide-react";
import { useState } from "react";



export function MyPage(){
    const {person} = useParams();
    const rowSize = 55;


    return(
        <div className="SiteBase">
            <Header />

            <div className="personProfile">
                <h1>{`Hello ${person},`}</h1>
                <div>
                    <h2>Your Books</h2>
                    <div className="myBookArray">
                        {
                            Array(rowSize).fill(null).map(() => <Card />)
                        }
                    </div>

                </div>
            </div>
        </div>
        
    );
}

export function ViewBook(){
    const generateTags = () => {
        const numTags = Math.floor(Math.random() * 3) + 3;
        return Array(numTags).fill(null).map(() => faker.word.noun());
    };
    
    const tags = generateTags();
    const rating = Number((Math.random() * 4 + 1).toFixed(1));
    const nav = useNavigate();

    return(
        <div className="SiteBase">
            <Header />

            <div className="BookPage">
                <div className="BookBreakDown">
                    <div>
                        <img src={faker.image.urlPicsumPhotos()}></img>
                    </div>
                    <div>
                        <h2 style={{fontSize: "4rem"}}>{faker.music.songName()}</h2>
                        <div className="SomeTagContainer">
                            {
                                tags.map((tag, index) => (
                                    <Tag key={index} text={tag} />
                                ))
                            }
                        </div>
                        <div className='RatingContainer' style={{marginTop:"1rem"}}>
                            <div className=''>
                                <Star size={16} fill={rating >= 1 ? 'orange' : 'transparent'} color={rating >= 1 ? 'orange' : 'white'}/>
                                <Star size={16} fill={rating >= 2 ? 'orange' : 'transparent'} color={rating >= 2 ? 'orange' : 'white'}/>
                                <Star size={16} fill={rating >= 3 ? 'orange' : 'transparent'} color={rating >= 3 ? 'orange' : 'white'}/>
                                <Star size={16} fill={rating >= 4 ? 'orange' : 'transparent'} color={rating >= 4 ? 'orange' : 'white'}/>
                                <Star size={16} fill={rating >= 5 ? 'orange' : 'transparent'} color={rating >= 5 ? 'orange' : 'white'}/>
                            </div>
                            <span className='RatingNumber'>{rating}</span>
                        </div>
                        <p className="MovieTopic">
                            {faker.lorem.sentences()}
                        </p>
                    </div>
                </div>
                <div className="ChapterDesign">
                    <h2>Chapters</h2>
                    {
                        Array(6).fill(null).map((elem,key) => <Chapter id={key} quoteCount={Math.floor(Math.random()*10)} title={faker.book.title()} key={"some:"+key} />)
                    }
                </div>
            </div>
        </div>
    );
}

export function Chapter({id, title, quoteCount}:{title:string, id:number, quoteCount:number}){
    const nav = useNavigate();

    return(
        <div 
            key={id}
            className="ChapterCSS"
            onClick={()=>{nav(`/Book/${title}/${id}`)}}
        >
            <div>
                <BookOpen />
                <div>
                <h3 >
                    Chapter {id}: {title}
                </h3>
                <p>
                    {quoteCount} quotes
                </p>
                </div>
            </div>
            <ChevronRight  />
        </div>
    );
}

export function ViewChapter(){
    const {chapter} = useParams();
    // Sample data - would come from your data source
    const chapterData = {
        title: faker.book.title(),
        quotes: [
            {
                id: `${chapter}.1`,
                text: "Mo Wuji holds Li Xuan's opinion in the highest regard! As does he Zuo Mo's, Zhou Fan's, Xu Yan's, Yang Kai's, Lu Sheng's.... or anyone with connections to him!",
                context: "Lu Sheng stated the obvious but only Xu Yan understood the implications.",
                explanation: "This quote emphasizes the discovery of inner strength during difficult times.",
                imageUrl: "/api/placeholder/400/300",
                subquotes: [
                    {
                        id: `${chapter}.1.1`,
                        text: "Its because Ancestor Mo wishes for everyone to walk the Dao, so he gives everyone preferential treatment.",
                        explanation: "Lu Sheng was a little surprised by this answer. No wonder he is Sect Master Li Xuan treasured disciple. He truly is one with foresight."
                    },
                    {
                        id: `${chapter}.1.2`,
                        text: "Hm. Indeed it is so.",
                        explanation: "Lu Sheng replied simply without any airs. But deep down, he sighed to himself."
                    },
                    {
                        id: `${chapter}.1.3`,
                        text: "Mo Wuji truly does not see the world the same as us. Any matter is reduced to a simple problem for Ancestor Mo. This includes the ones that need to be handled with care. He can ignore the consequences but what about us little guys......",
                        explanation: "No explanation?"
                    }
                ]
            },
            {
                id: `${chapter}.2`,
                text: "The only way to do great work is to love what you do.",
                context: "Discussion about passion and dedication",
                explanation: "Shows the connection between enjoyment and quality of work",
                imageUrl: "/api/placeholder/400/300",
                subquotes: []
            }
        ]
    };

    return(
        <div className="SiteBase">
            <Header />

            <div className="ViewChapterCSS">
                <div className="chapterHeader">
                    <h1>Chapter {chapter}: {faker.book.title()}</h1>
                </div>
                    
                <div className="quotesContainer">
                    {chapterData.quotes.map((quote) => (
                        <QuoteBlock key={quote.id} quote={quote} />
                    ))}
                </div>

            </div>
            

        </div>
    );
}

function QuoteBlock({ quote }:{quote:any}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showImage, setShowImage] = useState(false);

    return (
        <div className="quote-block">
            <div className="quote-header" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="quote-label">{quote.id}</div>
                <div className="quote-text">{quote.text}</div>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {isExpanded && (
                <div className="quote-details">
                    <div className="quote-context">
                        <h3>Context</h3>
                        <p>{quote.context}</p>
                    </div>

                    <div className="quote-explanation">
                        <h3>Explanation</h3>
                        <p>{quote.explanation}</p>
                    </div>

                    {quote.imageUrl && (
                        <div className="quote-image">
                            <button 
                                className="image-button"
                                onClick={() => setShowImage(!showImage)}
                            >
                                <ImageIcon size={20} />
                                <span>View Context Image</span>
                            </button>
                            
                            {showImage && (
                                <img src={quote.imageUrl} alt="Quote context" />
                            )}
                        </div>
                    )}

                    {quote.subquotes.length > 0 && (
                        <div className="subquotes">
                            <h3>Related Quotes</h3>
                            {quote.subquotes.map((subquote:any) => (
                                <div key={subquote.id} className="subquote">
                                    <div className="subquote-label">{subquote.id}</div>
                                    <div className="subquote-content">
                                        <p className="subquote-text">{subquote.text}</p>
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





export function EditorPage(){
    const {name} = useParams();


    return(
        <div className="SiteBase">
            <Header />

            <div className="">
                <h1>{`Editing ${name},`}</h1>

            </div>
        </div>
        
    );
}

