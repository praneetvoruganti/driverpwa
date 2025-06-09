import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';
import L from 'leaflet';

// Custom marker icon
const driverIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAzNiA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTggMEMxMS4zNzMgMCA2IDUuMzczIDYgMTJDNiAyMC40NjIgMTcuMzE2IDQxLjE2MSAxNy4zMTYgNDEuMTYxQzE3LjQ4NTkgNDEuNDIwMiAxNy43MzQxIDQxLjYxNjMgMTguMDIyNCA0MS43MjA3QzE4LjMxMDcgNDEuODI1MSAxOC42MjYgNDEuODMxMyAxOC45MTg2IDQxLjczODRDMTkuMjExMiA0MS42NDU1IDE5LjQ2NjcgNDEuNDU5MSAxOS42NDQ3IDQxLjIwNUMyMC4zNDI2IDQwLjE3NTggMzAgMjMuMTQ2MiAzMCAxMkMzMCA1LjM3MyAyNC42MjcgMCAxOCAwWiIgZmlsbD0iIzRDQUY1MCIvPjxwYXRoIGQ9Ik0xOCAxOEMyMS4zMTM3IDE4IDI0IDEzLjMxMzcgMjQgMTJDMjQgOC42ODYyOSAyMS4zMTM3IDYgMTggNkMxNC42ODYzIDYgMTIgOC42ODYyOSAxMiAxMkMxMiAxNS4zMTM3IDE0LjY4NjMgMTggMTggMThaIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
  iconSize: [36, 48],
  iconAnchor: [18, 48],
  popupAnchor: [0, -48],
});

const MapCard = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease-in-out;
`;

const MapHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f5f5f5;
`;

const MapTitle = styled.h2`
  font-size: 18px;
  color: #333;
  margin: 0;
  font-weight: 600;
  letter-spacing: -0.01em;
`;

const MapStatus = styled.div`
  font-size: 13px;
  color: ${props => props.active ? '#43A047' : '#757575'};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const MapWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1.6;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  position: relative;
  
  .leaflet-container {
    width: 100%;
    height: 100%;
    z-index: 1;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
  }
  
  .leaflet-control-attribution {
    font-size: 9px;
    background: rgba(255, 255, 255, 0.7);
    padding: 2px 5px;
  }
  
  .custom-pulse-icon {
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
    }
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
    }
  }
`;

const AddressBar = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #f9f9f9;
  border-radius: 12px;
  gap: 0.75rem;
  overflow: hidden;
`;

const LocationIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  color: #757575;
`;

const LocationText = styled.div`
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f9f9f9;
  border-radius: 16px;
  padding: 2rem;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #f1f1f1;
  border-top: 3px solid #43A047;
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
  margin-bottom: 1rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  font-size: 14px;
  color: #757575;
`;

const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  color: #d32f2f;
  background-color: #f9f9f9;
  border-radius: 16px;
  
  svg {
    margin-bottom: 1rem;
  }
`;

// Component to handle map recenter whenever location changes
function MapUpdater({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.flyTo(center, map.getZoom(), {
        duration: 1.5
      });
    }
  }, [center, map]);
  
  return null;
}

const LiveMap = () => {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState('Determining your location...');
  
  // Get user's current location
  useEffect(() => {
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          setLoading(false);
          
          // Reverse geocode to get address
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`)
            .then(response => response.json())
            .then(data => {
              if (data.display_name) {
                setAddress(data.display_name);
              }
            })
            .catch(error => {
              console.error('Error fetching address:', error);
            });
        },
        (error) => {
          setError(error.message);
          setLoading(false);
          console.error('Error getting location:', error);
        },
        { 
          enableHighAccuracy: true, 
          timeout: 30000, 
          maximumAge: 0
        }
      );
      
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
    }
  }, []);
  
  const defaultPosition = [12.9716, 77.5946]; // Default position (Bengaluru)
  
  const SignalIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="currentColor" />
      <circle cx="12" cy="12" r="5" fill="currentColor" />
    </svg>
  );
  
  const LocationPinIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor" />
    </svg>
  );
  
  const WarningIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#d32f2f" />
    </svg>
  );
  
  return (
    <MapCard>
      <MapHeader>
        <MapTitle>Live Location</MapTitle>
        {!loading && !error && position && (
          <MapStatus active>
            <SignalIcon />
            Active
          </MapStatus>
        )}
      </MapHeader>
      
      <MapWrapper>
        {loading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Locating your position...</LoadingText>
          </LoadingContainer>
        ) : error ? (
          <ErrorMessage>
            <WarningIcon />
            <div>{error}</div>
            <div style={{ fontSize: '12px', marginTop: '0.5rem', color: '#757575' }}>
              Please enable location services and refresh the page
            </div>
          </ErrorMessage>
        ) : (
          <MapContainer 
            center={position || defaultPosition} 
            zoom={16} 
            zoomControl={false}
            attributionControl={true}
            scrollWheelZoom={false}
            dragging={true}
            tap={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {position && (
              <>
                <Marker position={position} icon={driverIcon} />
                <Circle 
                  center={position}
                  radius={150}
                  pathOptions={{ 
                    color: '#4CAF50', 
                    fillColor: '#4CAF50', 
                    fillOpacity: 0.1,
                    weight: 1
                  }}
                />
              </>
            )}
            <MapUpdater center={position} />
          </MapContainer>
        )}
      </MapWrapper>
      
      {!loading && !error && position && (
        <AddressBar>
          <LocationIcon>
            <LocationPinIcon />
          </LocationIcon>
          <LocationText title={address}>
            {address}
          </LocationText>
        </AddressBar>
      )}
    </MapCard>
  );
};

export default LiveMap;
