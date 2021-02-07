import React, { useEffect } from "react";

import { Button, Box, Card, CardMedia, FormControl, InputLabel, List, MenuItem, Paper, Select, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import logo from './resources/logo.PNG'

const useStyles = makeStyles((theme) => ({
  backgroundDiv: {
    height: '100%',
    width: '100%',
    top: '0px',
    left: '0px',
    position: 'fixed',
    backgroundColor: "#FBFBFA",
    backgroundSize: 'cover',
  },
  selectionBox: {
    top: '5%',
    left: '5%',
    height: '30%',
    width: '20%',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  markerModeBox: {
    top: '15%',
    left: '85%',
    height: '10%',
    width: '10%',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  map: {
    top: '40%',
    left: '5%',
    height: '55%',
    width: '90%',
    position: 'absolute',
  },
  routeButton: {
    marginTop: '30px',
  },
  logoImage: {
    display: 'block',
    marginLeft: '38%',
    width: '50%',
    paddingTop: '100px',
  },

}));

function App(props) {
  const classes = useStyles();

  const [currentLocale, setLocale] = React.useState("Baltimore");
  const [currentMarkerMode, setCurrentMarkerMode] = React.useState("Origin")
  const [origin, setOrigin] = React.useState("");
  const [destination, setDestination] = React.useState("");
  const [originMarkerPos, setOriginMarkerPos] = React.useState(null);
  const [destinationMarkerPos, setDestinationMarkerPos] = React.useState(null);

  const updateLocale = (event) => {
    setLocale(event.target.value);
  };

  const updateOrigin = (event) => {
    setOrigin(event.target.value);
  };

  const updateDestination = (event) => {
    setDestination(event.target.value);
  };

  const updateCurrentMarkerMode = (event) => {
    console.log(event.target.value)
    setCurrentMarkerMode(event.target.value)
  }

  const handleMarkerOnClick = (t, map, coord) => {
    const { latLng } = coord;
    const latlng = { lat: latLng.lat(), lng: latLng.lng() }
    if (currentMarkerMode === "Origin") {
      setOriginMarkerPos(latlng)
    } else {
      setDestinationMarkerPos(latlng)
    }
  }

  return (
    <div className={classes.backgroundDiv}>
        <Box className={classes.selectionBox} elevation={1} boxShadow={2}>
          <FormControl>
            <InputLabel id="city">City</InputLabel>
            <Select value={currentLocale} onChange={updateLocale}>
              <MenuItem value={"Baltimore"}>Baltimore</MenuItem>
              <MenuItem value={"Boston"}>Boston</MenuItem>
              <MenuItem value={"WashingtonDC"}>Washington D.C.</MenuItem>
            </Select>
          </FormControl>
          <form value={origin} onChange={updateOrigin}>
            <TextField id="standard-basic" label="Origin" />
          </form>
          <form value={destination} onChange={updateDestination}>
            <TextField id="standard-basic" label="Destination" />
          </form>
          <Button className={classes.routeButton} variant="contained">Create Routes</Button>
        </Box>

      <div className={classes.logoImage}>
        <img src={logo}/>
      </div>

        <Box className={classes.map} elevation={1} boxShadow={2}>
          <Map
            google={props.google}
            onClick={handleMarkerOnClick}
          >
            {originMarkerPos === null ? null :
              <Marker
                position={originMarkerPos}
              />
            }
            {destinationMarkerPos === null ? null :
              <Marker
                position={destinationMarkerPos}
              />
            }
          </Map>
        </Box>
        <Box className={classes.markerModeBox} elevation={1} boxShadow={2}>
          <FormControl>
            <InputLabel id="Select">Select</InputLabel>
            <Select value={currentMarkerMode} onChange={updateCurrentMarkerMode}>
              <MenuItem value={"Origin"}>Origin</MenuItem>
              <MenuItem value={"Destination"}>Destination</MenuItem>
            </Select>
          </FormControl>
        </Box>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyBA1uVzpiZDnx0iG0qC_ZU1m1CpThmNWf4"),
})(App);