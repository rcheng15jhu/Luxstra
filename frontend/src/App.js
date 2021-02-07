import React, {useEffect} from "react";

import {Button, Card, CardMedia, FormControl, InputLabel, List, MenuItem, Paper, Select, TextField, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";

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
    width: '20%',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  directionsBox: {
    top: '5%',
    left: '30%',
    height: '30%',
    width: '65%',
    position: 'absolute',
  },
  map: {
    top: '40%',
    left: '5%',
    height: '55%',
    width: '90%',
    position: 'absolute',
  },
}));

function App() {
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
          <Button variant="contained">Create Routes</Button>
        </Paper>
        <Paper className={classes.directionsBox} elevation={1}>
          <List style={{maxHeight: '100%', overflow: 'auto'}} />
        </Paper>
        <Card className={classes.map} elevation={1}>
          <CardMedia src="https://www.google.com/maps/embed/v1/place?key=API_KEY&q=Space+Needle,Seattle+WA" />
        </Card>
      </Paper>
      <Map google={this.props.google} />
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyBA1uVzpiZDnx0iG0qC_ZU1m1CpThmNWf4"),
})(App);