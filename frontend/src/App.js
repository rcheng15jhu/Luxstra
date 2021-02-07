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
    top: '5%',
    left: '80%',
    height: '30%',
    width: '15%',
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
    marginTop: '20px',
    backgroundColor: "lightblue",
  },
  logoImage: {
    display: 'block',
    top: '10%',
    left: '35%',
    width: '50%',
    position: 'absolute',
  },
  detailsBox: {
    top: '5%',
    left: '27.5%',
    height: '30%',
    width: '50%',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    overflow: 'scroll',
  },
  selectRoute: {
    top: '15%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute'
  },
  directions: {
    top: '35%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute'
  },

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

  const [selected, setSelected] = React.useState(0);
  const [lamps, setLamps] = React.useState(null);

  useEffect(() => {
    console.log('lamps', lamps);
    if(lamps !== null) {
      console.log(lamps[selected]);
    } else {
      console.log('no lamp');
    }
  }, [selected, lamps]);

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

  const updateSelected = (event) => {
    setSelected(event.target.value)
  }

  const injestData = data => {
    let temp = [];
    let temp1 = [];
    let temp2 = [];
    for (let i = 0; i < data.routes.length; i++) {
      const newOverviewPolyline = data.routes[i].overviewPolyline.map(prevlatlng => (
      {
            lat: prevlatlng.latitude,
            lng: prevlatlng.longitude
      }));
      const allRouteLamps = data.routes[i].allLights.map(light => (
      {
            lat: light.lat,
            lng: light.lng
      })).map(coord => <Marker key={coord} position={coord}/>);
      temp.push(<Polyline path={newOverviewPolyline} strokeColor={colors[i]} key={colors[i]} />);
      temp1.push({ color: colors[i], directions: data.routes[i].HTMLDirections, summary: data.routes[i].summary });
      temp2.push(allRouteLamps);
    }
    setParsedLines(temp);
    setDetails(temp1);
    setLamps(temp2);
    console.log(temp2);
  };

  const getDirections = () => {
    fetch('/api/analyse_paths?start=' + origin.normalize().replace(/ /g, "+") + '&end=' + destination.normalize().replace(/ /g, "+"))
        .then(response => response.json())
        .then(injestData);
  };

  const getDirectionsFromMarkers =() => {
    const origin = originMarkerPos.lat + ',' + originMarkerPos.lng;
    const destination = destinationMarkerPos.lat + ',' + destinationMarkerPos.lng;
    fetch('/api/analyse_paths?start=' + origin + '&end=' + destination)
    .then(response => response.json())
    .then(injestData);
  };

  const renderRouteSelector = () => {
    if (parsedLines === null || details === null) {
      return null
    } else {
      const colors = details.map((direction, index) => <MenuItem value={index} key={direction.color}>{direction.color}</MenuItem>)
      return (
        <FormControl className={classes.selectRoute}>
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
      const directions = details.filter(direction => direction.color === colors[selected])[0].directions.map(direction => <li key={direction} dangerouslySetInnerHTML={{__html: direction}}/>)
      return (
        <Paper className={classes.detailsBox} elevation={1}>
          {renderRouteSelector()}
          <div dangerouslySetInnerHTML={{ __html: details.filter(direction => direction.color === colors[selected])[0].summary }} />
          <ul className={classes.directions}>{directions}</ul>
        </Paper>
      )
    }
  }

  return (
    <div className={classes.backgroundDiv}>
      {parsedLines === null ?
        <div className={classes.logoImage}>
          <img src={logo}  alt="logo"/>
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
          {lamps === null ? null :
            lamps[selected]
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
        <Button className={classes.routeButton} onClick={getDirectionsFromMarkers} variant="contained">Create Routes</Button>
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