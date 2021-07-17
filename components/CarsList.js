import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import React, { useEffect, useState,useRef } from "react";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from "firebase";
import {
  Grid,
  Toolbar,
  Collapse,
  CardContent,
  Typography,
  Card,
  Button,
  CardActions,
  CardMedia,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import styled from "styled-components";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import CheckIcon from "@material-ui/icons/Check";
import { Divider } from "@material-ui/core";
import { useRouter } from 'next/router';

export default function CarsList() {
  const [carsList, setCarsList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedContract, setSelectedContract] = useState(0);
  const [selectedCarID, setSelectedCarID] = useState('');
  const contractRef = useRef(0);
  const router = useRouter();
  const [user,loading] = useAuthState(auth);
  const [levelUser, setLevelUser] = useState(0);


  const handleDemandCar = (carID) => {
    setOpenDialog(true);
    setSelectedCarID(carID);
  };

  const handleClose = (value) => {
    setOpenDialog(false);
  };

  const handleSubmitContract = (e) => {
      e.preventDefault();
      console.log('submit : '+contractRef.current.value);
      if(contractRef.current.value === 1){
            router.push({ pathname:'/create',query:{carID:selectedCarID}});
      }else{
        router.push({ pathname:'/more',query:{carID:selectedCarID}});
      }
  
  }

  const changeSelectValue = (e)=>{
    setSelectedContract(contractRef.current.value)
    console.log(selectedContract);
  }
   
  const handleEditCar = async(id)=>{
    await db.collection("cars").doc(id).set(
      {
        car_status: 0,
      },
      { merge: true }
    );
  }

  const fetchData = async()=>{
    await db
    .collection("users")
    .get()
    .then((snapshot) => {
      snapshot.docs.forEach((singleUser) => {
        if (singleUser.data().uid === user.uid) {
          setLevelUser(singleUser.data().level);
        }
      });
    });

  }
  useEffect(() => {
    let list = [];
    db.collection("cars")
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((car) => {
          list.push(car.data());
        });
        setCarsList(list);
      });
      fetchData();
     


  }, []);

  return (
    <CarsContainer>
      <Grid container spacing={1}>
        {carsList.map((car) => {
          return (
            <Grid key={car.car_id} item lg={4} md={4} xs={12}>
              <Card
                elevation={0}
                variant="outlined"
                style={car.car_status == 1 ? { background: "#ffb9b9" } : {}}
              >
                <CardContent>
                  <CarsDate color="textSecondary" gutterBottom>
                    Ajouter le :{" "}
                    {new Date(car.car_date.seconds * 1000).toLocaleDateString()}
                  </CarsDate>
                  <CarsMarque variant="h5" component="h2">
                    {car.car_marque}
                  </CarsMarque>
                  <CarsImage image={car.car_img} title=" Cars MARQUE" />

                  <CarsMarque variant="h6" component="h2">
                    <ItemCard label={"Model : " + car.car_model} />
                    <ItemCard
                      label={"Kilometrage : " + car.car_kilo + " Km "}
                    />
                    <ItemCard label={"Prix : " + car.car_prix + "DH/Jour "} />
                  </CarsMarque>
                  <Divider variant="middle" />
                  <CardActions
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <ActionButton
                      variant="contained"
                      color="primary"
                      disabled={car.car_status == 0 ? false : true}
                      startIcon={<CheckIcon />}
                      onClick={() => handleDemandCar(car.car_id)}
                    >
                      réserve
                    </ActionButton>
                    
                    { 
                      levelUser != 0 ? (<>{
                        car.car_status != 0 &&    <ActionButton
                        variant="contained"
                        color="primary"
                        startIcon={<CheckIcon />}
                        onClick={() => handleEditCar(car.car_id)}
                      >
                        Réinitialiser
                      </ActionButton>
                      }</> ) :('')
                    }

                  </CardActions>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={openDialog}
    >
      <DialogTitle id="simple-dialog-title" style={{ fontFamily:'Noto Sans JP'}}>
        Sélectionnez votre contrat
      </DialogTitle>
      <form onSubmit={ handleSubmitContract }>
      <Grid container style={{padding:'15px'}}>
        <Grid item lg={12} md={12} xs={12}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="demo-simple-select-label" style={{ fontFamily:'Noto Sans JP'}}>statut</InputLabel>
            <Select
            style={{ fontFamily:'Noto Sans JP'}}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              inputRef={ contractRef }
              onChange={ changeSelectValue }
              defaultValue = { 0 }
              label="Contrat"
            >
                 <MenuItem value={0}>Contrat de bail</MenuItem>
                <MenuItem value={1} >Contrat LLD</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item lg={12} md={12} xs={12}>
          <ActionButton variant="contained" type="submit" style={{ marginTop:'10px',width:'100%',marginBottom:'15px'}}>
            Selectionner
          </ActionButton>
        </Grid>
      </Grid>
      </form>
    </Dialog>
    </CarsContainer>
  );
}
const CarsContainer = styled.div`
  padding: 15px;
  height: 100%;
  overflow-y: scroll;
`;
const CarsDate = styled(Typography)`
  &&& {
    font-family: "Noto Sans JP";
  }
`;
const CarsMarque = styled(Typography)`
  &&& {
    font-family: "Noto Sans JP";
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    text-align: center;
  }
`;
const ActionButton = styled(Button)`
  &&& {
    font-weight: normal;
    font-family: "Noto Sans JP";
    background: #60c8b5;
    color: white;
  }
`;
const CarsImage = styled(CardMedia)`
  height: 0;
  padding-top: 50%;
`;

const ItemCard = styled(Chip)`
  &&& {
    font-family: "Noto Sans JP";
    margin-top: 3px;
    margin-bottom: 6px;
    background: whitesmoke;
    width: 100%;
  }
`;
