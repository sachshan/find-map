import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Map, Marker, Overlay } from 'pigeon-maps';
import './css/MapPage.css';

const MapPage = () => {
  const { username, group_key } = useParams();
  const [markerPosition, setMarkerPosition] = useState(null);
  const [usersLocations, setUsersLocations] = useState([]);
  const [places, setPlaces] = useState([]);
  const [place_type, setPlaceType] = useState('');

  useEffect(() => {
    const fetchUserLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMarkerPosition([latitude, longitude]);
          sendLocationToServer(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    };

    fetchUserLocation();
  }, []);

  useEffect(() => {
    if (!markerPosition) return;

    const updateMarkerPosition = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMarkerPosition([latitude, longitude]);
          sendLocationToServer(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    };

    const intervalId = setInterval(updateMarkerPosition, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [markerPosition]);

  const sendLocationToServer = (latitude, longitude) => {
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    if (!serverUrl) {
      console.error('Server URL is not defined.');
      return;
    }

    fetch(`${serverUrl}/map/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: username, group_key, lat: latitude, long: longitude }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Location data sent successfully:', data);
      })
      .catch(error => {
        console.error('Error sending location data:', error);
      });
  };

  useEffect(() => {
    const fetchUsersLocations = async () => {
      const serverUrl = process.env.REACT_APP_SERVER_URL;
      if (!serverUrl) {
        console.error('Server URL is not defined.');
        return;
      }

      try {
        const response = await fetch(`${serverUrl}/map/${group_key}`, {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        });
        const data = await response.json();
        setUsersLocations(data);
      } catch (error) {
        console.error('Error fetching users locations:', error);
      }
    };

    fetchUsersLocations();

    const intervalId = setInterval(fetchUsersLocations, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [group_key]);

  const handleNameClick = (location) => {
    setMarkerPosition(location);
  };

  const fetchPlaces = async (placeType) => {
    if (placeType === 'restaurant') {
      setPlaceType('Restaurants');
    } else if (placeType === 'night_club') {
      setPlaceType('Night Clubs');
    } else if (placeType === 'cafe') {
      setPlaceType('Cafes');
    }

    const serverUrl = process.env.REACT_APP_SERVER_URL;
    if (!serverUrl) {
      console.error('Server URL is not defined.');
      return;
    }

    try {
      const response = await fetch(`${serverUrl}/map/${placeType}/${group_key}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });
      const data = await response.json();
      setPlaces(data);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  return (
    <div className='layout-container'>
      <h2>Pigeon Hangout App</h2>
          <h4>Welcome, {username} from group {group_key}!</h4>
          <Link to="/">Go Back to Login</Link>
      <div className='top-container'>
        <div className="map-container">
          <div className="map">
            <Map center={markerPosition} zoom={12} width={1100} height={800}>
              {usersLocations.map((user, index) => (
                <Overlay key={index} anchor={user.location} offset={[0, 0]}>
                  <div
                    className="overlay"
                    onClick={() => handleNameClick(user.location)}
                  >
                    {user.user_name}
                  </div>
                </Overlay>
              ))}
              {places.map((place, index) => (
                <Overlay key={index} anchor={place.location} offset={[0, 0]}>
                  <div className="place-number" style={{ fontWeight: 'bold' }}>{index + 1}</div>
                </Overlay>
              ))}
              {markerPosition && (
                <Marker anchor={markerPosition} payload={username} onClick={({ event, anchor, payload }) => { 
                  
                }} />
              )}
            </Map>
          </div>
          <div className="place-buttons">
            <button onClick={() => fetchPlaces('restaurant')}>Restaurants</button>
            <button onClick={() => fetchPlaces('night_club')}>Night Clubs</button>
            <button onClick={() => fetchPlaces('cafe')}>Cafes</button>
          </div>
        </div>
      </div>
      <div className="places-list">
        <h3>{place_type}</h3>
        <ol>
          {places.map((place, index) => (
            <li key={index}>{place.user_name}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default MapPage;
