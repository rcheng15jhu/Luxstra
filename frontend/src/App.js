import React, { useEffect } from "react";

import { Button, Box, Card, CardMedia, FormControl, InputLabel, List, MenuItem, Paper, Select, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import logo from './resources/logo.PNG'
import { GoogleApiWrapper, Map, Marker, Polyline } from "google-maps-react";

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
    top: '8%',
    left: '83%',
    height: '20%',
    width: '12%',
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
    backgroundColor: "lightblue",
  },
  logoImage: {
    display: 'block',
    marginLeft: '37.8%',
    width: '50%',
    paddingTop: '100px',
  },
  detailsBox: {
    top: '5%',
    left: '50%',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  }

}));

const colors = ['blue', 'red', 'green', 'orange', 'yellow']

function App(props) {
  const classes = useStyles();

  const [currentLocale, setLocale] = React.useState("Baltimore");
  const [currentMarkerMode, setCurrentMarkerMode] = React.useState("Origin")
  const [origin, setOrigin] = React.useState("");
  const [destination, setDestination] = React.useState("");
  const [originMarkerPos, setOriginMarkerPos] = React.useState(null);
  const [destinationMarkerPos, setDestinationMarkerPos] = React.useState(null);

  const [parsedLines, setParsedLines] = React.useState(null);
  const [details, setDetails] = React.useState(null);

  const [selected, setSelected] = React.useState(colors[0])

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
    };
  }

  const updateSelected = (event) => {
    setSelected(event.target.value)
  }

  const getDirections = () => {
    fetch('/api/fetch_route_directions?start=' + origin.normalize().replace(/ /g, "+") + '&end=' + destination.normalize().replace(/ /g, "+"))
      .then(response => response.json())
      .then(data => {
        let temp = []
        let temp1 = []
        for (let i = 0; i < data.routes.length; i++) {
          temp.push(<Polyline path={data.routes[i].overviewPolyline} strokeColor={colors[i]} key={colors[i]} />);
          temp1.push({ color: colors[i], directions: data.routes[i].HTMLDirections, summary: data.routes[i].summary })
        }
        setParsedLines(temp);
        setDetails(temp1)
      })
  };

  const renderRouteSelector = () => {
    if (parsedLines === null || details === null) {
      return null
    } else {
      const colors = details.map(direction => <MenuItem value={direction.color} key={direction.color}>{direction.color}</MenuItem>)
      return (
        <FormControl>
          <InputLabel id="route">Route</InputLabel>
          <Select value={selected} onChange={updateSelected}>
            {colors}
          </Select>
        </FormControl>
      )
    }
  }

  const renderRouteDetails = () => {
    if (details === null || selected === null) {
      return null
    } else {
      const directions = details.filter(direction => direction.color === selected)[0].directions.map(direction => <li dangerouslySetInnerHTML={{ __html: direction }}></li>)
      return (
        <Box className={classes.detailsBox} elevation={1} boxShadow={2}>
          {renderRouteSelector()}
          <lu>{directions}</lu>
          <div dangerouslySetInnerHTML={{ __html: details.filter(direction => direction.color === selected)[0].summary }} />
        </Box>
      )
    }
  }

  return (
    <div className={classes.backgroundDiv}>
      {parsedLines === null ?
        <div className={classes.logoImage}>
          <img src={logo} />
        </div>
        :
        null
      }

      <Box className={classes.map} elevation={1} boxShadow={2}>
        <Map
          google={props.google}
          onClick={handleMarkerOnClick}
          initialCenter={{ lat: 39.289, lng: -76.612 }}
        >
          {parsedLines}
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
        <Button className={classes.routeButton} variant="contained">Create Routes</Button>
      </Box>
      <Box className={classes.selectionBox} elevation={1} boxShadow={2}>
        <FormControl>
          <InputLabel id="city">City</InputLabel>
          <Select value={currentLocale} onChange={updateLocale}>
            <MenuItem value={"Baltimore"}>Baltimore</MenuItem>
            <MenuItem value={"Boston"}>Boston</MenuItem>
            <MenuItem value={"WashingtonDC"}>Washington D.C.</MenuItem>
          </Select>
        </FormControl>
        <form id="origin" value={origin} onChange={updateOrigin}>
          <TextField label="Origin" />
        </form>
        <form id="destination" value={destination} onChange={updateDestination}>
          <TextField label="Destination" />
        </form>
        <Button className={classes.routeButton} onClick={getDirections} variant="contained">Create Routes</Button>
      </Box>

      {renderRouteDetails()}

    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyBA1uVzpiZDnx0iG0qC_ZU1m1CpThmNWf4"),
})(App);