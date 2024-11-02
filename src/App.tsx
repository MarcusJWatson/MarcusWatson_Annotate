import { useState } from 'react'
import { Search, Tag as TagIcon  } from 'lucide-react';
import {faker} from '@faker-js/faker';
import './App.css'

function App() {

  return (
    <div className='SiteBase'>
      <Header />
      <TotalDisplay />

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

function Header(){

  return(
    <div className='SiteHeader'>
      <h1>Annotate</h1>
      <SearchBar />
      <ProfileNav/>
    </div>
  );
}

function SearchBar(){

  return(
    <div className='SearchBar'>
      <Search size={24} />
      <input type='text' placeholder='Enter a name to search' />
    </div>
  );
}

function ProfileNav(){
  const [auth, setAuth] = useState(false);

  return(
    <div className='ProfileNav'>
      {
        !auth &&
        <>
          <button>Login</button>
          <button>SignUp</button>
        </>
      }

      {
        auth ? <div className='PofileIcon'>Profile Name</div> : <div className='PofileIcon'>G</div>
      }
      
    </div>
  );

}



function TotalDisplay(){
  const generateTags = () => {
    const numTags = Math.floor(Math.random() * 3) + 3;
    return Array(numTags).fill(null).map(() => faker.word.noun());
  };

  const tags = generateTags();



  return(
    <div className='BigDisplay'>
      <img src={faker.image.urlPicsumPhotos()}></img>
      <h2>{faker.music.songName()}</h2>
      <div className='TagContainer'>
        {
          tags.map((tag, index) => (
            <Tag key={index} text={tag} />
          ))
        }
      </div>
      <p>Description</p>
      <div>
        <button>Read</button>
        <button>Favorite</button>
      </div>
    </div>
  );

}

function Tag({text}:{text:string}) {
  return (
    <div className='Tag'>
      <TagIcon size={16} />
      <span>{text}</span>
    </div>
  );
}

function Card(){

}

function RowCard(){

}

function RowCardWithTag(){

}


export default App
