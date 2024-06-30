const express = require('express')
const path = require('path');
const app = express()
const port = 5000

// Static Files
app.use(express.static('public'));
// Specific folder example
app.use('/css', express.static(__dirname + '/css'))
app.use('/js', express.static(__dirname + '/js'))
app.use('/Images', express.static(__dirname + '/Images'))

// Set View's
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    console.log('Root route accessed'); // Add this line for debugging
    console.log(__dirname);
    res.render('index', { text: 'Hey' });
});

app.get('/index', (req, res) => {
    console.log(`Current directory is: ${__dirname}`);
    res.render('index', { text: 'Hey' });
});




app.get('/AdminDashboard', (req, res) => {
//    res.sendFile(__dirname + '/views/about.html')
    res.render(__dirname + '/view/AdminDashboard')
})

app.get('/FoodItemEdit', (req, res) => {
    //    res.sendFile(__dirname + '/views/about.html')
        res.render(__dirname + '/view/FoodItemEdit')
    })

app.get('/Details', (req, res) => {
        //    res.sendFile(__dirname + '/views/about.html')
            res.render(__dirname + '/view/Detail')
    })

app.get('/forgotpass', (req, res) => {
        //    res.sendFile(__dirname + '/views/about.html')
            res.render(__dirname + '/view/forgotpass')
    })

app.get('/login', (req, res) => {
        //    res.sendFile(__dirname + '/views/about.html')
            res.render(__dirname + '/view/login')
    })
    app.get('/loginmob', (req, res) => {
        //    res.sendFile(__dirname + '/views/about.html')
            res.render(__dirname + '/view/loginmob')
    })
    app.get('/signupmob', (req, res) => {
        res.render(__dirname + '/view/signupmob')
    })
    app.get('/Menu', (req, res) => {
        //    res.sendFile(__dirname + '/views/about.html')
            res.render(__dirname + '/view/Menu')
    })
    app.get('/termsandconditions', (req, res) => {
        //    res.sendFile(__dirname + '/views/about.html')
            res.render(__dirname + '/view/Terms&Condi')
    })

    app.get('/Order', (req, res) => {
        //    res.sendFile(__dirname + '/views/about.html')
            res.render(__dirname + '/view/Order')
    })
    app.get('/OrdersTobePrepared', (req, res) => {
        //    res.sendFile(__dirname + '/views/about.html')
            res.render(__dirname + '/view/OrdersTobePrepared')
    })
    app.get('/profile', (req, res) => {
        //    res.sendFile(__dirname + '/views/about.html')
            res.render(__dirname + '/view/profile')
    })
    app.get('/sample', (req, res) => {
        //    res.sendFile(__dirname + '/views/about.html')
            res.render(__dirname + '/view/profile')
    })

app.listen(port, () => console.info(`App listening on port ${port}`))
