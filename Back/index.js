const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors());

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'coverImage') {
            cb(null, 'public/uploads/book-covers');
        } else if (file.fieldname === 'quoteImage') {
            cb(null, 'public/uploads/quote-images');
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'cs_445_project',
});


// User Routes
app.post('/register', async (req, res) => {

    const { username, email, password } = req.body;

    db.query(
        'INSERT INTO Users (username, email, naivePassword, created_at) VALUES (?, ?, ?, NOW())',
        [username, email, password],
        ((err,result)=>{
            if(err) throw err;
            
            res.status(201).send({ message: 'User created successfully' });
        })
    );


});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`We have ${email} and ${password}`);

    db.query('SELECT * FROM Users WHERE email = ?', [email], (err, result) => {
        if (err) {
            return res.status(500).send({ error: err.message });
        }

        if (result.length === 0) {
            return res.status(400).send({ error: 'User not found' });
        }

        const validPassword = password === result[0].naivePassword;
        if (!validPassword) {
            return res.status(400).send({ error: 'Invalid password' });
        }

        // Send the user data
        res.send({
            user_id: result[0].user_id,
            username: result[0].username,
            email: result[0].email
        });
    });
});

//////////////////////////////////////////////////////////////////
// User Data Editing and Routes for images

// GET Book By ID
app.get('/api/books/:id', (req, res) => {
    const bookId = req.params.id;
    db.query(
        'SELECT * FROM books WHERE book_id = ?',
        [bookId],
        (err, result) => {
            if (err) {
                return res.status(500).send({ error: err.message });
            }
            if (result.length === 0) {
                return res.status(404).send({ error: 'Book not found' });
            }
            res.send(result[0]);
        }
    );
});

// Random Book Request
app.get('/api/randomBook', (req, res) => {
    db.query(
        'SELECT * FROM books ORDER BY RAND() LIMIT 1', // RAND() limit 1 -> in the future may want to add a number in the query for number of request
        (err, result) => {
            if (err) {
                return res.status(500).send({ error: err.message });
            }
            if (result.length === 0) {
                return res.status(404).send({ error: 'No books found' });
            }
            res.send(result[0]);
        }
    );
});

// Tags
app.get('/api/tags', (req, res) => {
    const limit = req.query.limit || 10;
    db.query(
        'SELECT * FROM tags LIMIT ?',
        [parseInt(limit)],
        (err, result) => {
            if (err) {
                return res.status(500).send({ error: err.message });
            }
            res.send(result);
        }
    );
});

// Tags by book
app.get('/api/:bookId/tags', (req, res) => {
    const bookId = req.params.bookId;

    const query = `
        SELECT tags.tag_id, tags.name
        FROM tags
        INNER JOIN booktags ON tags.tag_id = booktags.tag_id
        WHERE booktags.book_id = ?
        ORDER BY tags.name
    `;

    db.query(query, [bookId], (err, results) => {
        if (err) {
            console.error('Error fetching tags:', err);
            return res.status(500).send({ 
                error: 'Error fetching tags',
                details: err.message 
            });
        }

        // If no tags found, return empty array instead of error
        if (results.length === 0) {
            return res.send([]);
        }

        res.send(results);
    });
});


// Random BOOK Image - may not be needed. Originally I was using faker but i have a real database now
app.get('/api/pictures/random', (req, res) => {
    const coverImagesPath = path.join(__dirname, 'public/uploads/book-covers');
    fs.readdir(coverImagesPath, (err, files) => {
        if (err) {
            return res.status(500).send({ error: 'Unable to scan directory' });
        }
        if (files.length === 0) {
            return res.status(404).send({ error: 'No images found' });
        }
        const randomFile = files[Math.floor(Math.random() * files.length)];
        res.send({ url: `/uploads/book-covers/${randomFile}` });
    });
});

// Might combine with the other imge api request so we dont have to worry about different endpoints since we store the location anyways
app.get('/api/book-covers/:filename', (req, res) => {
    const { filename } = req.params;
    const imagePath = path.join(__dirname, 'public/uploads/book-covers', filename);
  
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.status(404).send('Image not found');
    }
});

//Get Unique Books by tag and return the result.
//
app.get('/books/tag/:tagId', (req, res) => {
    const tagId = req.params.tagId;
    const query = `
        SELECT DISTINCT b.*
        FROM books b
        INNER JOIN booktags bt ON b.book_id = bt.book_id
        WHERE bt.tag_id = ?
    `;
    db.query(query, [tagId], (err, results) => {
        if (err) {
            return res.status(500).send({ error: err.message });
        }
        res.send(results);
    });
});

app.get('/books/:bookId/chapters', (req, res) => {
    const bookId = req.params.bookId;
    
    const query = `
        SELECT chapter_id, book_id, chapter_number, title 
        FROM chapters 
        WHERE book_id = ? 
        ORDER BY chapter_number ASC`;
    
    db.query(query, [bookId], (err, results) => {
        if (err) {
            console.error('Error fetching chapters:', err);
            return res.status(500).send({ error: 'Error fetching chapters' });
        }
        
        res.send(results);
    });
});

app.get('/getChapter/:bookId/:chapter', (req, res) => {
    const {bookId, chapter} = req.params;
    
    const query = `
        SELECT chapter_id, book_id, chapter_number, title 
        FROM chapters 
        WHERE book_id = ? AND chapter_id = ?
    `;
    
    db.query(query, [bookId, chapter], (err, results) => {
        if (err) {
            console.error('Error fetching chapters:', err);
            return res.status(500).send({ error: 'Error fetching chapters' });
        }
        
        res.send(results[0]);
    });
});

app.get('/chapterQuotes/:chapterId/quotes', (req, res) => {
    const chapterId = req.params.chapterId;
    
    const query = `
        SELECT * FROM quotes 
        WHERE chapter_id = ? 
        ORDER BY quote_number ASC`;
    
    db.query(query, [chapterId], (err, results) => {
        if (err) {
            console.error('Error fetching quotes:', err);
            return res.status(500).send({ error: 'Error fetching quotes' });
        }
        res.send(results);
    });
});


app.get('/quotes/:quoteId', (req, res) => {
    const quoteId = req.params.quoteId;
    
    db.query('SELECT * FROM quotes WHERE quote_id = ?', [quoteId], (err, results) => {
        if (err) {
            console.error('Error fetching quote:', err);
            return res.status(500).send({ error: 'Error fetching quote' });
        }
        if (results.length === 0) {
            return res.status(404).send({ error: 'Quote not found' });
        }
        res.send(results[0]);
    });
});

//SUBQUOTES!!!
app.get('/quotes/:quoteId/subquotes', (req, res) => {
    const quoteId = req.params.quoteId;
    
    const query = `
        SELECT * FROM subquotes 
        WHERE quote_id = ? 
        ORDER BY subquote_number ASC`;
    
    db.query(query, [quoteId], (err, results) => {
        if (err) {
            console.error('Error fetching subquotes:', err);
            return res.status(500).send({ error: 'Error fetching subquotes' });
        }
        res.send(results);
    });
});

//BOOKS BY USER
// Get books created by user
app.get('/users/:userId/books', (req, res) => {
    const userId = req.params.userId;
    
    const query = 'SELECT * FROM books WHERE created_by = ?';
    
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user books:', err);
            return res.status(500).send({ error: 'Error fetching user books' });
        }
        res.send(results);
    });
});

// User favorite books
app.get('/users/:userId/favorite-books', (req, res) => {
    const userId = req.params.userId;
    
    const query = `
        SELECT b.* 
        FROM books b
        JOIN userfavorites favs ON b.book_id = favs.book_id
        WHERE favs.user_id = ?`;
    
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching favorite books:', err);
            return res.status(500).send({ error: 'Error fetching favorite books' });
        }
        res.send(results);
    });
});

app.get('/GETALLDBBOOKS', (req, res) => {
    db.query('SELECT * FROM books', (err, results) => {
        if (err) {
            return res.status(500).send({ error: err.message });
        }
        console.log(results);
        res.send(results);
    });
});


// DELETE book by ID
app.delete('/api/books/:id', (req, res) => {
    const bookId = req.params.id;
    db.query(
        'DELETE FROM books WHERE book_id = ?',
        [bookId],
        (err, result) => {
            if (err) {
                return res.status(500).send({ error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).send({ error: 'Book not found' });
            }
            res.send({ message: 'Book deleted successfully' });
        }
    );
});

// UPDATE book by ID
// Quotes???
app.put('/api/books/:id', (req, res) => {
    const bookId = req.params.id;
    const { title, description, rating } = req.body;
    
    db.query(
        'UPDATE books SET title = ?, description = ?, rating = ? WHERE book_id = ?',
        [title, description, rating, bookId],
        (err, result) => {
            if (err) {
                return res.status(500).send({ error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).send({ error: 'Book not found' });
            }
            res.send({ message: 'Book updated successfully' });
        }
    );
});

// Get User Info By ID
app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    db.query(
        'SELECT user_id, username, email, created_at, last_login FROM users WHERE user_id = ?',
        [userId],
        (err, result) => {
            if (err) {
                return res.status(500).send({ error: err.message });
            }
            if (result.length === 0) {
                return res.status(404).send({ error: 'User not found' });
            }
            res.send(result[0]);
        }
    );
});






// Serve static files
app.use('/uploads', express.static('public/uploads'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
db.connect(err=>{
    if(err) throw (err);
    console.log("DB Connected");
})

console.log("Aye");