import React, { useEffect } from "react";

import { Button, Card, CardMedia, FormControl, InputLabel, List, MenuItem, Paper, Select, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import background from "./resources/mainBackground3.png";

const useStyles = makeStyles((theme) => ({
  backgroundDiv: {
    height: '100%',
    width: '100%',
    top: '0px',
    left: '0px',
    position: 'fixed',
    backgroundImage: `url(${background})`,
    //backgroundImage: 'linear-gradient(#FF8235, #30E8BF)',
    backgroundSize: 'cover',
  },
  mainBox: {
    height: '90%',
    width: '90%',
    top: '5%',
    left: '4%',
    position: 'fixed',
    backgroundColor: "#e6f2ff",
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
    setOrigin(event.target.value);
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
            <TextField id="standard-basic" label="Origin" />
          </form>
          <form value={destination} onChange={updateDestination}>
            <TextField id="standard-basic" label="Destination" />
          </form>
          <Button className={classes.routeButton} variant="contained">Create Routes</Button>
        </Paper>
        <Card className={classes.map} elevation={1}>
          <Map
            google={props.google}
            onClick={(t, map, coord) => {
              const { latLng } = coord;
              const lat = latLng.lat();
              const lng = latLng.lng();
            }}
          />
        </Card>
        <Paper className={classes.markerModeBox} elevation={1}>
          <FormControl>
              <InputLabel id="Select">Select</InputLabel>
              <Select value={""} onChange={() => {}}>
                <MenuItem value={"Origin"}>Origin</MenuItem>
                <MenuItem value={"Destination"}>Destination</MenuItem>
              </Select>
            </FormControl>
        </Paper>
      </Paper>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyBA1uVzpiZDnx0iG0qC_ZU1m1CpThmNWf4"),
})(App);