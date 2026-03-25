# Express_CRUD
This is a CRUD template for Node JS Express and PostgreSQL Database. 


![banner](https://user-images.githubusercontent.com/27864374/132133123-5b59f84a-a3e2-46f9-8111-08317c74a075.png)

## *Objective*
* To create, update, read, delete records from a user table
* To connect to PostgreSQL database using pg and stash the secrets in dotenv
* To connect with a esj view and use the view folder
* Use basic bootstrap for front-end

*next repo objective*
* Use the node express-generator to create a template using router context.
* Understand how to better seperate out app.js code using router.
* Learn how to use partials for front end.
* Understand the async await and when to use

## How this was set up

Step 1: install nodeJS into your system
`node -v` to check
`npm init`
* change index.js to app.js

Step 2: Install the packages
`npm install --save express pg ejs`
`npm install -g nodemon`

Step 3: add these to app.js
```javascript
const path = require('path');
const express = require('express');
const ejs = require('ejs');
const { Pool } = require('pg');
const { maxHeaderSize } = require('http');
const app = express();
require('dotenv').config()

//listen to server
app.listen(3000, () => {
    console.log('server is running at port 3000');
});
```

Step 4: Create the database connection

> To connect to PostgreSQL database, we use this pg package, remember to run `npm install pg`

```javascript
const { Pool } = require('pg');
const pgPool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASS,
    port: process.env.PG_PORT || 5432,
    database: 'crud_express'
});
```

Step 5: Define the index path '/' and the ejs view

```javascript

//this sets the views to be directed to the views folder, try removing the 's' from views and try it out
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	res.render('user_index', {
	    title : 'This is the user_index page',
	});
});

```

Create view folder within the app and add `user_index.ejs`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Bootstrap 4 Example</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <link rel="stylesheet" href="public\stylesheets\styles.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</head>
<body>

<div class="container">
	hello
</div>
</body>
</html>
```

Step 6: To run the application
`npm start` or `nodemon app`

## To run this locally on your computer...

Step 1: create a folder to store projects

ie: desktop -> projects folder
`cd projects`
`git clone https://github.com/kwokcheong/Express_CRUD.git`

open in VSC code.

Step 2: run `npm install`

Step 3: Edit the SQL connection -> look at `connecting to PostgreSQL`

Step 4: `nodemon app`

#### NOTICE
> use the pg package for PostgreSQL
```npm install pg```
```const { Pool } = require('pg')```

### Connecting to PostgreSQL
> We will be using PostgreSQL, first run this inside psql

```SQL
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    email VARCHAR(256) NOT NULL,
    phone_no VARCHAR(26)
);
```

- After you install PostgreSQL, you will need
    1. user
    2. password

- create a file called  `.env` and paste this in
```
PG_HOST=localhost
PG_USER=crud_user
PG_PASS=your_password_here
PG_PORT=5432
```

- create a new database in psql and call it 'crud_express'


> To connect to PostgreSQL database, we use this pg package, remember to run `npm install pg`

```javascript
const { Pool } = require('pg');
const pgPool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASS,
    port: process.env.PG_PORT || 5432,
    database: 'crud_express'
});
```

success, if the pool connects, we can now use queries using `pgPool` const keyword

### View set up

```
//this sets the views to be directed to the views folder, try removing the 's' from views and try it out
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
```

as you can see, express let's us have the freedom to choose which view engine to use. I have chosen ejs as it is pretty simple and great to use.
this view engine let's use the data from our backend!

create a folder called `view` and add your views in there

## CRUD create read update delete

*create*

```javascript
app.get('/add', (req, res) => {
    res.render('user_add', {
        title: 'This is the create user page',
    });
});

app.post('/save', (req , res) => {
    let params = [req.body.name, req.body.email, req.body.phone_no];
    let sql = "INSERT INTO users (name, email, phone_no) VALUES ($1, $2, $3)";
    pgPool.query(sql, params, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});
```

steps: 

1. app.get('/add')

- This looks for the /add route. Hence within the button in the / route, the create button routes to /add, this triggers the app.get('add')
- the app.get has 2 things
    req -> request which allows us to grab data coming from the route
    res -> the response we will be returing to user

    we will respond with a simple render to the form creation page called 'user_add'

2. Create view called 'user_add.ejs' under the view folder
    ```html
    <form action="/save" method="post">
    ```
    notice we created a form with an action "/save" method="post"

    so our backend will be getting this data from the front-end, directed to the "/save" action. 

    So let's create a save action

3. Create `/save'

```javascript
app.post('/save', (req , res) => {
    let params = [req.body.name, req.body.email, req.body.phone_no];
    let sql = "INSERT INTO users (name, email, phone_no) VALUES ($1, $2, $3)";
    pgPool.query(sql, params, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});
```

    now you can see, we have the req coming in from the front-end which we can grab using req.body.''
    we use pgPool.query() 
    which takes in the sql query line, the params it needs to fill in the $1, $2, $3 placeholders and also gives us back the error and result.
    from there we can respond with a redirect back to the original page. 




#### placeholder code

```
// app.get('/create', async(req, res) => {
//     let sql = "INSERT INTO users VALUES (4, 'test', 'test@gmail.com', 123)";
//     pgPool.query(sql, (err, rows) => {
//         if (err) throw err;
//         res.render('user_index', {
//             title : 'This is the user_index page',
//             users : rows
//         });
//     });
// });

// app.post('/save', (req , res) => {
//     let params;
//     let sql = "INSERT INTO users (name, email, phone_no) VALUES ($1, $2, $3)";
//     let query = "SELECT COUNT(id) AS max_id FROM users"
//     pgPool.query(query, (err, rows) => {
//         if (err) throw err;
//         params = [req.body.name, req.body.email, req.body.phone_no];
//         pgPool.query(sql, params, (err, results) => {
//             if (err) throw err;
//             res.redirect('/');
//         });
//     });
// });
```
