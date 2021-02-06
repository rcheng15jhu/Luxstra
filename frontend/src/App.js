import React, {useEffect} from "react";

import {Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  backgroundDiv: {
    height: '100%',
    width: '100%',
    top: '0px',
    left: '0px',
    position: 'fixed',
  },
  origin: {
    height: '100%',
    width: '100%',
    top: '0px',
    left: '0px',
    position: 'fixed',
  },
  map: {
    height: '100%',
    width: '100%',
    top: '0px',
    left: '0px',
    position: 'fixed',
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
      <div className={classes.selectionBox}>
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
        <Button></Button>
      </div>
      <div className={classes.map}>

      </div>
    </div>
  );
}

export default App;
