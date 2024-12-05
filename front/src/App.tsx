import { useContext, useEffect, useState } from 'react'
import { Search, Tag as TagIcon, Star, } from 'lucide-react';
import { da, faker, } from '@faker-js/faker';
import { useNavigate } from 'react-router';
import { Book, bookImgUrl, getBook, getBooksByTag, getTags, getTagsByBook, Tag as TagType, UserContext } from './myContext'; // Lucide causeing this to error out
import './App.css'



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

  const handleSearch = (event:any) => {
    console.log("hello")
    nav(`/AllBooks?search=${(searchTerm)}`);
  };

  return (
    <div className='SearchBar' >
      <Search size={24} style={{cursor:"pointer"}} onClick={(e)=>{handleSearch(e)}}/>
      <input type='text' placeholder='Enter a name to search. Leave Blank for all' 
        value={searchTerm} onChange={(e:any)=>{
          setSearchTerm(e.target.value)
        }}
        />
    </div>
  );
}

function ProfileNav() {
  //const [auth, setAuth] = useState(false); //no longer neded
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
          <button onClick={() => { context?.logout() }}>Logout</button>
        </>
      }

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
  useEffect(()=>{
    //Fetch book using custom api call
    const book = getBook('randomBook');
    book.then(response=>{
      //if succeful then set the state
      setDispBook(response);

    });

  },[]);
  useEffect(()=>{
    if(!dispBook) return;
    //Get a books tags
    const tags = getTagsByBook(dispBook.book_id);
    tags.then(response=>{
      setBookTags(response);
    });
  },[dispBook]);

  return (
    <div className='BigDisplay'>
      <img src={"http://localhost:3000/api"+dispBook?.cover_image_url}></img>
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
export function Card({book}:{book?:Book}) {
  const [data, setData] = useState(book);

  useEffect(()=>{
    //Override data if their is no book supplied
    //What about ID'?
    if(!data){
      const book = getBook('randomBook');
      book.then(response=>{
        //if succeful then set the state
        setData(response);
  
      });
    }
  },[]);

  // Generate random rating between 1-5
  const rating = data?.rating || 0; // make sure to refresh?
  const nav = useNavigate();


  return (
    <div className='Card' onClick={() => { nav(`/Book/${data?.book_id}`) }}>
      <img src={"http://localhost:3000/api"+data?.cover_image_url} alt="card image" />
      <div className='CardContent'>
        <h3>{data?.title}</h3>

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

export function RowCard({cards}:{cards:Array<Book>}) {

  const rowSize = 7;
  
  
  //I did some wacky unready array manipulation here.

  //In case I forget I am splcing the array in a ternary operator between 0 adn 7 in case we get a array
  //that is too big. But its all done in 1 line for compactness.
  //I didnt think itd work but it seems js is pretty crazy.
  //console.log("length",cards.length - rowSize);
  return (
    <div className='CardArray'>
      {
        [...cards.length > 7 ?  cards.splice(0,7):cards].map((elem,id)=>{
          return <Card book={elem} key={"card: "+id}/>
        })
      }
      {
        Array(Math.abs(cards.length - rowSize)).fill(null).map((_, id) => <div className="EmptyCard" key={"card: " + id} />)
      }
    </div>
  );
}

export function RowCardWithTag({tag}:{tag?:TagType}) {
  const [headTag, setHeadTag] = useState<TagType|undefined>(tag);
  const[data, setData] = useState<Array<Book>>();

  useEffect(()=>{
    // need to get random tag if tag is null
    if(!headTag){
      const newTag = getTags();
      newTag.then(res=>{
        const finalTag = res[Math.floor(Math.random()*res.length)]; // random item from array so it changes
        setHeadTag(finalTag);

        console.log("getting tags: ", finalTag.tag_id, finalTag.name);
        const books = getBooksByTag(finalTag.tag_id);
        books.then(res=>{
          setData(res);
        })
      
      });
      
    }else{

    }
    //get books by tag
    

  });

  return (
    <div className='RowWithTag'>
      <h2>{headTag?.name}</h2>
      <RowCard cards={data || []}/>
    </div>
  );

}


export default App
