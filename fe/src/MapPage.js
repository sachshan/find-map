import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Map, Marker, Overlay } from 'pigeon-maps';

const MapPage = () => {
  const { username, group_key } = useParams();
  const [markerPosition, setMarkerPosition] = useState(null); // Initialize with null
  const [usersLocations, setUsersLocations] = useState([]);

  useEffect(() => {
    // Function to get the user's current location
    const fetchUserLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMarkerPosition([latitude, longitude]);
          sendLocationToServer(latitude, longitude); // Send location to server immediately
        },
        (error) => {
          console.error('Error getting location:', error); // Error handling for geolocation
        }
      );
    };

    fetchUserLocation(); // Get user location on component mount
  }, []);

  useEffect(() => {
    if (!markerPosition) return; // Do not proceed until the initial position is fetched

    // Function to update marker position based on user's current location
    const updateMarkerPosition = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMarkerPosition([latitude, longitude]);
          sendLocationToServer(latitude, longitude); // Send location to server immediately
        },
        (error) => {
          console.error('Error getting location:', error); // Error handling for geolocation
        }
      );
    };

    // Update marker position every second
    const intervalId = setInterval(updateMarkerPosition, 1000);

    return () => {
      clearInterval(intervalId); // Clean up the interval on component unmount
    };
  }, [markerPosition]);

  // Function to send location data to server
  const sendLocationToServer = (latitude, longitude) => {
    const serverUrl = process.env.REACT_APP_SERVER_URL; // Access environment variable
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
      const serverUrl = process.env.REACT_APP_SERVER_URL; // Ensure to use REACT_APP_ prefix for environment variables
      if (!serverUrl) {
        console.error('Server URL is not defined.');
        return;
      }

      try {
        const response = await fetch(`${serverUrl}/map/${group_key}`, 
          {
            headers: {
              'ngrok-skip-browser-warning': 'true', // Add custom header here
            },
          }
        );
        console.log('response:', response)
        console.log(`${serverUrl}/map/${group_key}`)
        const data = await response.json();
        setUsersLocations(data); // Update state with fetched user locations
      } catch (error) {
        console.error('Error fetching users locations:', error);
      }
    };

    // Fetch users locations initially
    fetchUsersLocations();

    // Update users locations every 10 seconds
    const intervalId = setInterval(fetchUsersLocations, 10000);

    return () => {
      clearInterval(intervalId); // Clean up the interval on component unmount
    };
  }, [group_key]);

  return (
    <div>
      <h2>Map Page</h2>
      <p>Welcome, {username} from group {group_key}!</p>
      <Link to="/">Go Back to Login</Link> {/* Link to navigate back to login page */}
      <div style={{ height: '400px' }}>
        {markerPosition && ( // Only render the map if markerPosition is set
          <Map center={markerPosition} zoom={12} width={600} height={400}>
            {/* Render markers for all users */}
            {usersLocations.map((user, index) => (
              <Overlay key={index} anchor={user.location} offset={[0, 0]}>
                <div style={{ background: 'rgba(255, 0, 0, 0.6)', padding: '5px', borderRadius: '5px', color: 'white' }}>
                  {user.user_name}
                </div>
              </Overlay>
            ))}
            {/* Render marker for current user */}
            <Marker anchor={markerPosition} payload={username} onClick={({ event, anchor, payload }) => {}} />
          </Map>
        )}
      </div>
    </div>
  );
};

export default MapPage;
