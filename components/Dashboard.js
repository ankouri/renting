import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import React, { useEffect, useState } from "react";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from "firebase";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Paper,
  Badge,
  Button,
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import styled from "styled-components";
import DashboardIcon from "@material-ui/icons/Dashboard";
import GroupIcon from "@material-ui/icons/Group";
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import CommuteIcon from '@material-ui/icons/Commute';
import {Line, Doughnut,Pie } from 'react-chartjs-2';
export default function Dashboard() {
    const [totalusers, setTotalUses] = useState(0);
    const [totalCars, setTotalCars] = useState(0);
    const [totalCommad, setTotalCommad] = useState(0);
    const stateCommands = {
        labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
        datasets: [
          {
            label: 'Demandes de l\'année ',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
            data: [1,2,3,1,4,6,3,2,1,5,5,4]
          }
        ]
     }
     const fetchData = async()=>{
        await db.collection("users")
        .get()
        .then((snapshot) => {
          setTotalUses(snapshot.docs.length);
        });

        await db.collection("cars")
        .get()
        .then((snapshot) => {
            setTotalCars(snapshot.docs.length);
        });

        await db.collection("commands")
        .get()
        .then((snapshot) => {
            setTotalCommad(snapshot.docs.length);
        });

        
     }
     useEffect(() => {

        fetchData()

     },[])

  return (
    <div>
      <Grid container justify="center" align="center">
        <Grid item lg={10} md={10} xs={12}>
          <TitleProfile
            icon={<DashboardIcon />}
            label="Tableau de bord"
            color="basic"
          />
          <Grid container spacing={2} justify="start" align="start">
            <Grid item lg={4} md={4} xs={12} >
              <Card elevation={1} style={{ height:'150px'}}>
                <CardContent>
                  <CardTitle color="textSecondary" gutterBottom>
                    last update : { new Date().toLocaleDateString() }
                  </CardTitle>

                  <CardMainTitle variant="h5" component="h2">
                    {"Nombre total d'utilisateurs"}
                  </CardMainTitle>
                  <GroupText>
                    <CardMainTitle
                      variant="h6"
                      component="h3"
                      style={{ fontSize: "40px", fontWeight: "bold" }}
                    >
                      {totalusers}
                    </CardMainTitle>
                    <GroupIcon style={{ fontSize: "62px" }} />
                  </GroupText>
                </CardContent>
              </Card>
            </Grid>
            <Grid item lg={4} md={4} xs={12}>
              <Card elevation={1} style={{ height:'150px'}}>
                <CardContent>
                  <CardTitle color="textSecondary" gutterBottom>
                    last update :  { new Date().toLocaleDateString() }
                  </CardTitle>

                  <CardMainTitle variant="h5" component="h2">
                    {"Nombre total des voitures"}
                  </CardMainTitle>
                  <GroupText>
                    <CardMainTitle
                      variant="h6"
                      component="h3"
                      style={{ fontSize: "40px", fontWeight: "bold" }}
                    >
                      { totalCars }
                    </CardMainTitle>
                    <DriveEtaIcon style={{ fontSize: "62px" }} />
                  </GroupText>
                </CardContent>
              </Card>
            </Grid>
            <Grid item lg={4} md={4} xs={12}>
              <Card elevation={1} style={{ height:'150px'}}>
                <CardContent>
                  <CardTitle color="textSecondary" gutterBottom>
                    last update :  { new Date().toLocaleDateString() }
                  </CardTitle>

                  <CardMainTitle variant="h5" component="h2">
                    {"Nombre total demandes"}
                  </CardMainTitle>
                  <GroupText>
                    <CardMainTitle
                      variant="h6"
                      component="h3"
                      style={{ fontSize: "40px", fontWeight: "bold" }}
                    >
                      {totalCommad}
                    </CardMainTitle>
                    <CommuteIcon style={{ fontSize: "62px" }} />
                  </GroupText>

                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Line
                data={stateCommands}
                options={{
                    title:{
                    display:false,
                    fontSize:20
                    },
                    legend:{
                    display:true,
                    position:'right'
                    }
                }}
                />
        </Grid>
      </Grid>
    </div>
  );
}
const CardTitle = styled(Typography)`
  &&& {
    font-family: "Noto Sans JP";
  }
`;
const TitleProfile = styled(Chip)`
  width: 90%;
  &&& {
    margin-bottom: 19px;
    font-family: "Noto Sans JP";
    margin-top: 20px;
  }
`;
const CardMainTitle = styled(Typography)`
  &&& {
    font-family: "Noto Sans JP";
    font-size:19px;
  }
`;
const GroupText = styled.div`
  display: flex;
  justify-content: space-between;
`;
