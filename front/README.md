# Annotate Proejct.


# Purpose
- note taking app for when I read books. I read a lot of novels. Primarily wuxia novels. I come across many scenes or events that I would want to save context for or revisit later. This allows me to store and save those memories and my comments on them.
- press the book heart to favorite it
- you can only edit books you own. go to my books and select a book to edit

## Note: Known errors and problems 
- Should probably put some back buttons. But you can just use the arrrows instead
- Laggy transition on card. The cause is most likeyly comes from the css styling transition property and scaling the content and hiding it. A better approach would be to bring it from low opacity to high opacity.
- Transition property is buggy especially since its applied across style
- Would be nice to be able to search by tags and not just names in the future
- THIS WAS FIXED - cannot use the search after logging in if we call the refresh page. Causes page to logout. -> ISSUE WAS NOT PUTTING QUERY STRING IN DEPENANCY ROOKIE MISTAKE!!!
- Code was originally neatly but I forgot about the structure as i kept working on it.
- rating system would be nice in the future.
- Data is just filler data i pulled from faker and some online pictures. I kept changing stuff so i didnt really wanna put too much time into a good test data.
- If continue to developing this a rewrite is needed. Styles and functions are messy. Some inline styles added because of hard coding certain values. Not good If i switch up the order or reuse some components.
- If continue to develop in the future, replace !. Bad practice with typescript
- need to add tags to the book edit and creation
- ill probably change rating to enjoyment. Since noones gonna use this but me

# Getting Started

- DownLoad Zip
- Extract Zip
- Open in Terminal
- Navigate to MarcusWatson_Annotate
- Open 2 terminals. | One for the front. One for the back api points
- CD front
- - npm install
- CD back
- - npm install
- import the .sql file into your sql server environment
- `npm run start` on the `back` terminal
- `npm run dev` on the `front` terminal
- *Important to get those 2 steps correct else youll get a error
- navigate to `http://localhost:5173/` or where ever app posted.

- `npm run dev/start` are just configured scripts so we don't have to do `node ./scriptname`. It can be any command really.

## Using the App
- create an account in the login/signup button
- login once you cerate an account
- you will be directed to the home screen
- you can search books by name using the `search` bar at the top
- if you want to return home fron the ANOTATE letters
- create book by pressing the create button
- edit book by pressing the edit button on you books *may need to go to `my books` and click a book if you havnt already.
- can delete from their as well.
- Clicking on the square tiles taake you to books quotes to be read
- Clicking on my book take you to another generated list to read books.
- Clicking on create books take you to an editor, To edit books

