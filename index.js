require('dotenv').config();
const express = require('express');
let bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const dns = require('dns');
const { log } = require('console');

// Basic Configuration
const port = process.env.PORT || 3003;
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});


const shortOriginalUrlObj ={}
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

app.post('/api/shorturl/', (req, res) => {
  let url = req.body.url;


  if (isValidUrl(url)) {

   dns.lookup(new URL(url).hostname, (err, address) => {
      if (err) return res.json({error:'Invalid URL'})
      const shortUrl = Math.floor(Math.random() * 10000).toString();
       shortOriginalUrlObj[shortUrl] =url;
       res.json({ original_url: url, short_url: shortUrl })
    })
  }
  else {
    res.json({ error: 'Invalid URL' })
  }

})


app.get('/api/shorturl/:shorturl',(req,res)=>{
    const  short_url = req.params.shorturl;
    if(short_url){
      res.redirect(shortOriginalUrlObj[short_url])
    }
    else{
      res.json({error:'Invalid URL'})
    }

})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
