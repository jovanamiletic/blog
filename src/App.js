import "./app.css";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { useEffect, useState, useRef } from "react";
import { Room, Star } from "@material-ui/icons";
import L from "leaflet";
import {Icon} from "leaflet";
import "leaflet/dist/leaflet.css";

import axios from "axios";
import { format } from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const myStorage = window.localStorage;
  const mapRef = useRef(null);
  // const [trenutnoKorisnickoIme, setTrenutnoKorisnickoIme] = useState(myStorage.getItem("user"));
  const [trenutnoKorisnickoIme, setTrenutnoKorisnickoIme] = useState(null);
  const [pins, setPins] = useState([]);
  const [novoMesto, setNovoMesto] = useState(null);
  const [naslov, setNaslov] = useState(null);
  const [opis, setOpis] = useState(null);
  const [ocena, setOcena] = useState(0);
  const [viewport, setViewport] = useState({
    sirina: 47.040182,
    duzina: 17.071727,
    zoom: 4,
  });
  const [showRegister, setShowRegister] = useState(false); 
  const [showLogin, setShowLogin] = useState(false);
  const myIcon = L.icon({
    iconUrl: '/map-marker-my.svg',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
  const guestIcon = L.icon({
    iconUrl: '/map-marker-guest.svg',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

  // const handleMarkerClick = (id, lat, long) => {
  //   setCurrentPlaceId(id);
  //   setViewport({ ...viewport, sirina:lat, duzina:long });
  // };

  const handleAddClick = (e) => {
    console.log(e)
    const { lat, lng } = e.latlng;
    setNovoMesto({
      sirina: lat,
      duzina: lng,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      korisnickoime: trenutnoKorisnickoIme,
      naslov,
      opis,
      ocena: ocena,
      sirina: novoMesto.sirina,
      duzina: novoMesto.duzina,
    };

    try {
      console.log(newPin)
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      console.log(pins)
      setNovoMesto(null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get("/pins");
        setPins(allPins.data.filter(p=> p.sirina< 100));
        console.log(allPins.data.filter(p=> p.sirina< 100))
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleLogout = () => {
    setTrenutnoKorisnickoIme(null);
    myStorage.removeItem("user");
  };

  
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[viewport.sirina, viewport.duzina]}
        zoom={viewport.zoom}
        style={{ height: "100%", width: "100%" }}
        doubleClickZoom={false}
        whenCreated={(map) => (mapRef.current = map)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {pins.map(pin => (
          <Marker key={pin._id} position={[pin.sirina, pin.duzina]}
          icon={trenutnoKorisnickoIme === pin.korisnickoime ? myIcon: guestIcon}>
            <Popup>
            <div className="card">
                <label>Mesto</label>
                <h4 className="place">{pin.naslov}</h4>
                <label>Recenzija</label>
                <p className="desc">{pin.opis}</p>
                <label>Ocena</label>
                <div className="stars">
                  {Array(pin.ocena).fill(<Star className="star" />)}
                </div>
                <label>Informacije</label>
                <span className="username">
                  Kreirao/la <b>{pin.korisnickoime}</b>
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {novoMesto && (
          <Marker position={[novoMesto.sirina, novoMesto.duzina]}  icon={myIcon} >
            <Popup>
              <form onSubmit={handleSubmit}>
                <label>Naslov</label>
                <input
                  placeholder="Unesite naslov"
                  autoFocus
                  onChange={(e) => setNaslov(e.target.value)}
                />
                <label>Opis</label>
                <textarea
                  placeholder="Kazite nam nesto o ovom mestu."
                  onChange={(e) => setOpis(e.target.value)}
                />
                <label>Ocena</label>
                <select onChange={(e) => setOcena(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button type="submit" className="submitButton">
                  Dodaj pin
                </button>
              </form>
            </Popup>
          </Marker>
        )} 
         <MapEventsComponent onMapClick={handleAddClick} />
      </MapContainer>
      {trenutnoKorisnickoIme ? (
        <button className="button logout" onClick={handleLogout}>
          Log out
        </button>
      ) : (
        <div className="buttons">
          <button className="button login" onClick={() => setShowLogin(true)}>
            Log in
          </button>
          <button
            className="button register"
            onClick={() => setShowRegister(true)}
          >
            Register
          </button>
        </div>
      )}
      {showRegister && <Register setShowRegister={setShowRegister}/>}
      {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setTrenutnoKorisnickoIme={setTrenutnoKorisnickoIme}/>}
    </div>
  );
}

const MapEventsComponent = ({ onMapClick }) => {
  const map = useMapEvents({
    click: onMapClick,
  });
  return null;
};

export default App;
