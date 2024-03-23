const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cons = require('consolidate');
const dust = require('dustjs-helpers');
const { Pool } = require('pg'); // Import Pool from pg module
const app = express();

// DB Connect String
const connect = 'postgres://projectRecipe:R5f@t87D@localhost:5432/recipebookdb';

// Assign Dust Engine to .dust files
app.engine('dust', cons.dust);

// Set default Ext .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Route(url)
app.get('/', (req, res) => {
    // Create a new pool
    const pool = new Pool({
        connectionString: connect
    });

    // Use the pool to execute query
    pool.query('SELECT * FROM recipes', (err, result) => {
        if (err) {
            console.error('Error running query', err);
            res.status(500).send('Error retrieving data');
        } else {
            res.render('index', { recipes: result.rows });
        }
        
        // Release the client from the pool
        pool.end();
    });
});

app.post('/add', (req, res) => {
    //create a new poos again
    const pool = new Pool({
        connectionString: connect
    });

    // use the pool to execute query
    pool.query('INSERT INTO recipes(name, ingredients, directions) VALUES($1, $2, $3)', [req.body.name, req.body.ingredients, req.body.directions], (err, result) =>{
        if(err){
            console.error("Error running query", err);
            res.status(500).send("error retrieving data");
        }
        else{
            res.redirect('/');
        }
        //release the client from the pool
        pool.end(); 
    });
});

app.delete('/delete/:id', (req, res)=>{
    //create a new poos again
    const pool = new Pool({
        connectionString: connect
    });

    pool.query('DELETE FROM recipes WHERE id = $1', [req.params.id], (err, result) =>{
        if(err){
            console.error("Error running query", err);
            res.status(500).send("error retrieving data");
        }
        else{
            res.send(200);
        }
        //release the client from the pool
        pool.end(); 
    });
});

app.post('/edit', (req, res)=>{
    const pool = new Pool({
        connectionString: connect
    });

    pool.query('UPDATE recipes SET name=$1, ingredients=$2, directions=$3 WHERE id = $4' , [req.body.name, req.body.ingredients, req.body.directions, req.body.id], (err, result)=>{
        if(err){
            console.error("Error running query", err);
            res.status(500).send("error retrieving data");
        }
        else{
            res.redirect('/');
        }
        //release the client from the pool
        pool.end(); 
    })
})

// Server
app.listen(3000, () => {
    console.log('Server Started On Port 3000');
});
