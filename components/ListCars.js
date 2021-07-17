import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import React, { useEffect, useState } from "react";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from "firebase";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Paper,
  Badge,
  Button,
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import styled from "styled-components";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { makeStyles } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Profile from "./Profile";
import Notifications from "./Notifications";
import AddCars from "./addCars";
import CarsList from "./CarsList";
import DashboardIcon from "@material-ui/icons/Dashboard";
import Dashboard from "./Dashboard";
import Response from './Response';
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },

  inputRoot: {
    color: "inherit",
  },
}));

export default function ListCars() {
  const [user, loading] = useAuthState(auth);
  const [levelUser, setLevelUser] = useState(0);
  const [commands, setCommands] = useState([]);
  const [commandsAdmin, setCommandsAdmin] = useState([]);
  const [userObject, setUserObject] = useState([]);
  const classes = useStyles();
  const [page, setPage] = useState(0);

  const fetchData = async () => {
    let listCommands = [];
    let listCommandsAdmin = [];
    let userlist= [];
    await db
      .collection("users")
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((singleUser) => {
          if (singleUser.data().email === user.email) {
            userlist.push(singleUser.data());
            setLevelUser(singleUser.data().level);
            return;
          }
        });
        setUserObject(userlist[0]);
      });
    await db
      .collection("commands")
      .get()
      .then((snapshot) => {
        snapshot.docs.map((item) => {
          if(item.data().cunread !== 1){
            listCommandsAdmin.push(item.data())
          }
          
          if(item.data().cuser === user.uid){
            listCommands.push(item.data());
          }
        });
        setCommandsAdmin(listCommandsAdmin)
        setCommands(listCommands);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className={classes.grow}>
        <Container maxWidth="lg">
          <Navbar position="static">
            <Toolbar>
              <TitleHead
                className={classes.title}
                variant="h6"
                noWrap
                onClick={() => setPage(0)}
              >
                Gestion des voitures
              </TitleHead>

              <div className={classes.grow} />

              <div>
                {levelUser === 1 ? (
                  <>
                    <MenuButton
                      aria-label="Dashboard"
                      color="inherit"
                      variant="contained"
                      disableElevation
                      startIcon={<DashboardIcon />}
                      onClick={() => setPage(4)}
                    >
                      Tableau de bord
                    </MenuButton>
                    <MenuButton
                      color="inherit"
                      variant="contained"
                      disableElevation
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={() => setPage(3)}
                    >
                      Ajouter Voiture
                    </MenuButton>
                    
                  </>
                ) : (
                  ""
                )}
                    {
                      levelUser !== 1 ? (<IconButton color="inherit" onClick={() => setPage(5)}>
                      <Badge badgeContent={commands.length} color="secondary">
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>) : (<IconButton color="inherit" onClick={() => setPage(2)}>
                        <Badge badgeContent={commandsAdmin.length} color="secondary">
                          <NotificationsIcon />
                        </Badge>
                      </IconButton>)
                    }
                     
                  
                

                <IconButton
                  aria-label="account of current user"
                  color="inherit"
                  onClick={() => setPage(1)}
                >
                  <AccountCircle />
                </IconButton>

                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  onClick={() => auth.signOut()}
                  color="inherit"
                >
                  <ExitToAppIcon />
                </IconButton>
              </div>
         
            </Toolbar>
            
          </Navbar>
         
          { 

            userObject.address === 'Your address'  &&
                <Alert severity="error" style={{fontFamily:'Noto Sans JP'}}  action={
                  <Button style={{fontFamily:'Noto Sans JP'}} onClick={ ()=> setPage(1)} color="inherit" size="small">
                    Profil
                  </Button>
                }>Please complete your profile informations from here </Alert>
              }
          <Paper style={{ height: "80vh" }}>
            {page === 0 ? (
              <CarsList />
            ) : page === 1 ? (
              <Profile />
            ) : page === 2 ? (
              <Notifications />
            ) : page === 5 ? (
              <Response />
            )
             : page === 3 ? (
              <AddCars />
            ) : page === 4 ? (
              <Dashboard />
            ) : (
              <CarsList />
            )}
          </Paper>
        </Container>
      </div>
    </div>
  );
}

const TitleHead = styled(Typography)`
  &&& {
    font-family: "Noto Sans JP";
    flex-grow: 1;
    cursor: pointer;
  }

  :hover {
    color: white;
  }
`;

const Navbar = styled(AppBar)`
  &&& {
    background: #60c8b5;
    color: black;
    font-family: "Noto Sans JP";
  }
`;

const MenuButton = styled(Button)`
  &&& {
    background: #60c8b5;
    color: black;
    font-family: "Noto Sans JP";
  }
`;
