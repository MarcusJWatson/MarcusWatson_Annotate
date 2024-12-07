import { useContext, useEffect, useState } from 'react'
import { Search, Tag as TagIcon, Star, BookHeart, BookA } from 'lucide-react';
import { da, faker, } from '@faker-js/faker';
import { useNavigate } from 'react-router';
import { Book, bookImgUrl, checkFavoriteStatus, getBook, getBooksByTag, getTags, getTagsByBook, Tag as TagType, toggleFavoriteStatus, UserContext } from './myContext'; // Lucide causeing this to error out
import './App.css'
import CreateBookModal from './bookeditor';



function App() {

  return (
    <div className='SiteBase'>
      <Header />
      <TotalDisplay />


      <RowCardWithTag />
      <RowCardWithTag />

      {
        /*
          <RowCardWithTag />
          <RowCardWithTag />
        */
      }

      {
        // Row with tag array goes here.

      }

      {
        // Maybe in the future we could have 
      }
    </div>
  )
}


/*
  Colors
  #1F1F1F
  #262626
  #363636


  color: #FFFFFF; 
  font-family: 'Cinzel', serif;  
  font-weight: 700;  
  font-size: 3.5rem;  
  text-transform: uppercase;  
  letter-spacing: 2px;  
  text-shadow: 
    2px 2px 4px rgba(0, 0, 0, 0.45),
    0 0 10px rgba(0, 0, 0, 0.45); 


  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -1px;
  color: #F0F0F0;
*/

export function Header() {
  const nav = useNavigate();

  return (
    <div className='SiteHeader'>
      <h1 onClick={() => { nav("/") }}>Annotate</h1>
      <SearchBar />
      <ProfileNav />
    </div>
  );
}

function SearchBar() {
  const nav = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event: any) => {
    console.log("hello")
    nav(`/AllBooks?search=${(searchTerm)}`);
    //window.location.reload(); // Should refresh the page

  };

  return (
    <div className='SearchBar' >
      <Search size={24} style={{ cursor: "pointer" }} onClick={(e) => { handleSearch(e) }} />
      <input type='text' placeholder='Enter a name to search. Leave Blank for all'
        value={searchTerm} onChange={(e: any) => {
          setSearchTerm(e.target.value)
        }}
      />
    </div>
  );
}

function ProfileNav() {
  const [popup, setPopup] = useState(false); //no longer neded
  const context = useContext(UserContext);
  const nav = useNavigate();


  return (
    <div className='ProfileNav'>
      {
        !context?.user &&
        <>
          <button onClick={() => nav('/auth')}>Login</button>
          <button onClick={() => nav('/auth')}>SignUp</button>
        </>
      }
      {
        context?.user &&
        <>
          <button onClick={() => nav(`/Person/${context.user?.id}`)}>My Books</button>
          {/*<button onClick={() => nav(`/Editor/${faker.book.title()}`)}>Create Book</button>*/}
          <button style={{ marginRight: "1rem" }} onClick={() => { context?.logout(); nav("/auth") }}>Logout</button>
          <button onClick={() => { setPopup(true) }} style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", fontSize: "large" }}><span>+</span> <BookA size={16} color='white' /> </button>

        </>
      }

      {popup && (
        <CreateBookModal
          isOpen={popup}
          onClose={() => setPopup(false)}
        />
      )}

      {
        context?.user ? <div className='PofileIcon'>{context.user.username[0]}</div> : null
      }

    </div>
  );

}



function TotalDisplay() {
  const [dispBook, setDispBook] = useState<Book>();
  const [bookTags, setBookTags] = useState<Array<TagType>>();



  // fetch book and display it
  useEffect(() => {
    //Fetch book using custom api call
    const book = getBook('randomBook');
    book.then(response => {
      //if succeful then set the state
      setDispBook(response);

    });

  }, []);
  useEffect(() => {
    if (!dispBook) return;
    //Get a books tags
    const tags = getTagsByBook(dispBook.book_id);
    tags.then(response => {
      setBookTags(response);
    });
  }, [dispBook]);

  return (
    <div className='BigDisplay'>
      <img src={"http://localhost:3000/api" + dispBook?.cover_image_url}></img>
      <h2>{dispBook?.title}</h2>
      <div className='TagContainer'>
        {
          bookTags?.map((tag, index) => (
            <Tag key={index} text={tag.name} />
          ))
        }
      </div>
      <p>{dispBook?.description}</p>
      <div className='button-container'>
        <button>Read</button>
        <button>Favorite</button>
      </div>
    </div>
  );

}

export function Tag({ text }: { text: string }) {
  return (
    <div className='Tag'>
      <TagIcon size={16} />
      <span>{text}</span>
    </div>
  );
}


//I want the picture to only be visible but when hovered I want details ro show from the bottom. 
//with a solid but blurered/half tranparent background
export function Card({ book }: { book?: Book }) {
  const [data, setData] = useState(book);
  const context = useContext(UserContext);
  const [isFavorite, setIsFavorite] = useState(false);

  //Should probably combine these to get it done
  useEffect(() => {
    //Override data if their is no book supplied
    //What about ID'?
    if (!data) {
      const book = getBook('randomBook');
      book.then(response => {
        //if succeful then set the state
        setData(response);

      });
    }
  }, []);

  useEffect(() => {
    if (!context?.user?.id && book?.book_id) return;
    console.log("check", context?.user?.id!, book?.book_id!)
    const check = checkFavoriteStatus(context?.user?.id!, book?.book_id!);
    check.then(res => { console.log(res); setIsFavorite(res) });
  }, [data, context]);

  // Generate random rating between 1-5
  const rating = data?.rating || 0; // make sure to refresh?
  const nav = useNavigate();


  //Specify button event later
  function handleFavButton(e: any) {
    e.stopPropagation();

    //redirect to login if not signed in
    if (!context?.user) {
      nav('/auth');
      return;
    }
    //send reques to backend
    if (!context?.user?.id && book?.book_id) return;
    const result = toggleFavoriteStatus(context?.user?.id!, book?.book_id!);
    result.then(res => { setIsFavorite(res) });

  }

  return (
    <div className='Card' onClick={() => { nav(`/Book/${data?.book_id}`) }}>
      <img src={"http://localhost:3000/api" + data?.cover_image_url} alt="card image" />
      <div className='CardContent'>

        <h3>
          {data?.title}
          <button className='Fav-Button' onClick={(e) => { handleFavButton(e) }}><BookHeart size={24} color={isFavorite ? "orange" : 'white'} /></button>
        </h3>

        <div className='RatingContainer'>

          <div className='StarDisp'>
            <Star size={16} fill={rating >= 1 ? 'orange' : 'transparent'} color={rating >= 1 ? 'orange' : 'white'} />
            <Star size={16} fill={rating >= 2 ? 'orange' : 'transparent'} color={rating >= 2 ? 'orange' : 'white'} />
            <Star size={16} fill={rating >= 3 ? 'orange' : 'transparent'} color={rating >= 3 ? 'orange' : 'white'} />
            <Star size={16} fill={rating >= 4 ? 'orange' : 'transparent'} color={rating >= 4 ? 'orange' : 'white'} />
            <Star size={16} fill={rating >= 5 ? 'orange' : 'transparent'} color={rating >= 5 ? 'orange' : 'white'} />
          </div>
          <span className='RatingNumber'>{rating}</span>

        </div>

        <p>{data?.description}</p>

      </div>
    </div>
  );
}

export function RowCard({ cards }: { cards: Array<Book> }) {

  const rowSize = 7;


  //I did some wacky unready array manipulation here.

  //In case I forget I am splcing the array in a ternary operator between 0 adn 7 in case we get a array
  //that is too big. But its all done in 1 line for compactness.
  //I didnt think itd work but it seems js is pretty crazy.
  //console.log("length",cards.length - rowSize);
  return (
    <div className='CardArray'>
      {
        [...cards.length > 7 ? cards.splice(0, 7) : cards].map((elem, id) => {
          return <Card book={elem} key={"card: " + id} />
        })
      }
      {
        cards.length > 0 ? Array(Math.abs(cards.length - rowSize)).fill(null).map((_, id) => <div className="EmptyCard" key={"card: " + id} />) : <span style={{ marginRight: "auto", marginLeft: "auto" }}>"No Results Found"</span>
      }
    </div>
  );
}

export function RowCardWithTag({ tag }: { tag?: TagType }) {
  const [headTag, setHeadTag] = useState<TagType | undefined>(tag);
  const [data, setData] = useState<Array<Book>>();

  useEffect(() => {
    // need to get random tag if tag is null
    if (!headTag) {
      const newTag = getTags();
      newTag.then(res => {
        const finalTag = res[Math.floor(Math.random() * res.length)]; // random item from array so it changes
        setHeadTag(finalTag);

        console.log("getting tags: ", finalTag.tag_id, finalTag.name);
        const books = getBooksByTag(finalTag.tag_id);
        books.then(res => {
          setData(res);
        })

      });

    } else {

    }
    //get books by tag


  });

  return (
    <div className='RowWithTag'>
      <h2>{headTag?.name}</h2>

      <RowCard cards={data || []} />
    </div>
  );

}


export default App
