import React, { useEffect } from "react";

import { Button, Card, CardMedia, FormControl, InputLabel, List, MenuItem, Paper, Select, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { GoogleApiWrapper, Map, Marker, Polyline } from "google-maps-react";

const useStyles = makeStyles((theme) => ({
  backgroundDiv: {
    height: '100%',
    width: '100%',
    top: '0px',
    left: '0px',
    position: 'fixed',
    backgroundColor: '#998866',
  },
  mainBox: {
    height: '90%',
    width: '90%',
    top: '5%',
    left: '4%',
    position: 'fixed',
    backgroundColor: '#bbaa88',
  },
  selectionBox: {
    top: '5%',
    left: '5%',
    height: '30%',
    width: '90%',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    top: '40%',
    left: '5%',
    height: '55%',
    width: '90%',
    position: 'absolute',
  },
}));

function App(props) {
  const classes = useStyles();

  const [currentLocale, setLocale] = React.useState("Baltimore");
  const [origin, setOrigin] = React.useState("");
  const [destination, setDestination] = React.useState("");

  const updateLocale = (event) => {
    setLocale(event.target.value);
  };

  const updateOrigin = (event) => {
    setOrigin(event.target.value);
  };

  const updateDestination = (event) => {
    setDestination(event.target.value);
  }; 

  const getRoute = (start, end) => {
    fetch('/api/fetch_route_coords?start=' + origin.normalize().replace(/ /g,"+") + '&end=' + destination.normalize().replace(/ /g,"+")).then(
      response => {return response.json()}
    ).then(data => {
      console.log(JSON.stringify(data));
      document.getElementById("mapLine").path = {data};
    })
  };

  return (
    <div className={classes.backgroundDiv}>
      <Paper className={classes.mainBox} elevation={2}>
        <Paper className={classes.selectionBox} elevation={1}>
          <FormControl>
            <InputLabel id="city">City</InputLabel>
            <Select value={currentLocale} onChange={updateLocale}>
              <MenuItem value={"Baltimore"}>Baltimore</MenuItem>
              <MenuItem value={"Boston"}>Boston</MenuItem>
              <MenuItem value={"WashingtonDC"}>Washington D.C.</MenuItem>
            </Select>
          </FormControl>
          <form value={origin} onChange={updateOrigin}>
            <TextField label="Origin" />
          </form>
          <form value={destination} onChange={updateDestination}>
            <TextField label="Destination" />
          </form>
          <Button variant="contained" onClick={getRoute}>Create Routes</Button>
        </Paper>
        <Card className={classes.map} elevation={1}>
	  <Map google={props.google} initialCenter={{lat: 39.289, lng: -76.612}} id="map">
            <Polyline id="mapLine" strokeColor="#FFFF00" strokeOpacity={0.8} strokeWeight={2}/>
          </Map>
        </Card>
      </Paper>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: (""),
})(App);