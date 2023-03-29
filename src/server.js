const express = require('express');
const app = express();



app.get('/', (req, res)=>{
    res.send('Hello')
})

app.get('/route1', function(req, res) {
    res.send('This is Route 1');
});


app.get('/route2', function(req, res) {
    res.send('This is Route 2');
});

app.get('/route3', function(req, res) {
    res.send('This is Route 3');
});

app.listen(3000, function() {
    console.log('Server started on port 3000');
});
