import { useState, useEffect } from 'react'
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

const CLIENT_ID = "7970c1f6add245fbab73ae26f428b224";
const CLIENT_SECRET = "7c346484b65540138b92c3440f7c0878";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);


  useEffect(() => {
    // APi Access Token
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token));
  }, [])

  // Search
  async function search() {
    console.log("Search for " + searchInput);

    // GET
    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    
    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
      .then(respose => respose.json())
      .then(data => { return data.artists.items[0].id });

    console.log("Artist ID is " + artistID);

    var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&US&limit=50', searchParameters)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setAlbums(data.items);
      });
  }
  console.log(albums);
  return (
    <div className="App">
      <Container>
        <InputGroup className='mb-3' size='lg'>
          <FormControl
            placeholder='Search For Artist'
            type="input"
            onKeyPress={event => {
              if (event.key == "Enter") {
                search();
              }
            }}
            onChange={event => setSearchInput(event.target.value)}
          />
          <Button onClick={search} >
            Search
          </Button>
        </InputGroup>
      </Container>

      <Container>
        <Row className='mx-2 row row-cols-4'>
          {albums.map((album, i) => {
            console.log(album);
            return (
              <Card>
                <Card.Img src={album.images[0].url}/>
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
                </Card.Body>
              </Card>
            )
          })}
        </Row>
      </Container>
    </div>
  )
}

export default App
