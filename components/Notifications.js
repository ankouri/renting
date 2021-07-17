import { useAuthState } from "react-firebase-hooks/auth";
import router, { useRouter } from "next/router";
import { auth, db } from "../firebase";
import React, { useEffect, useState, useRef } from "react";
import {
  Grid,
  Paper,
  Button,
  Avatar,
  ListItemSecondaryAction,
  ListSubheader,
  ListItemIcon,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  FormControl,
  Divider,
} from "@material-ui/core";
import DraftsIcon from "@material-ui/icons/Drafts";
import FiberNewIcon from "@material-ui/icons/FiberNew";
import styled from "styled-components";
import Loading from "./Loading";
import Alert from "@material-ui/lab/Alert";
import CheckIcon from "@material-ui/icons/CheckCircleOutline";
import { DeleteOutlined } from "@material-ui/icons";

export default function Notifications() {
  const route = useRouter();
  const [user] = useAuthState(auth);
  const [carObject, setCarObject] = useState([]);
  const [userObject, setUserObject] = useState([]);
  const [commandObject, setCommandObject] = useState([]);
  const [agenceObject, setAgenceObject] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [nbNotification, setNbNotifications] = useState(0);
  const [selectedCar, setSelectedCar] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [notificationSelected, setNotificationSelected] = useState("");
  const [levelUser, setLevelUser] = useState(0);

  const fetchData = async () => {
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
    await db
      .collection("commands")
      .get()
      .then((snapshot) => {
        setNbNotifications(snapshot.docs.length);
        setNotifications(snapshot.docs);
      });
  
  };

  const handleDetailsNotification = async (userID, carID, cid) => {
    setLoading(true);
    setOpen(true);
    setNotificationSelected(cid);
    setSelectedCar(carID);
    await db.collection("commands").doc(cid).set(
      {
        cunread: 1,
      },
      { merge: true }
    );
    await db
      .collection("users")
      .doc(userID)
      .get()
      .then((doc) => {
        setUserObject(doc.data());
      });
    await db
      .collection("cars")
      .doc(carID)
      .get()
      .then((doc) => {
        setCarObject(doc.data());
      });

    await db
      .collection("commands")
      .doc(cid)
      .get()
      .then((doc) => {
        setCommandObject(doc.data());
      });

    await db
      .collection("agence")
      .doc(cid)
      .get()
      .then((doc) => {
        setAgenceObject(doc.data());
      });
    setLoading(false);
  };

  const handleDelteRequest = async () => {
    await db.collection("commands").doc(notificationSelected).set(
      {
        cstatus: -1,
      },
      { merge: true }
    );
  };
  const handleAcceptRequest = async () => {
    setLoading(true);
    await db.collection("commands").doc(notificationSelected).set(
      {
        cstatus: 1,
      },
      { merge: true }
    );
    await db.collection("cars").doc(selectedCar).update(
      {
        car_status: 1,
      },
      { merge: true }
    );
      setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Grid container>
        <Grid item lg={3} md={3} xs={12}>
          <ListContainer elevation={0}>
            <List
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Toutes Les Notifications :
                </ListSubheader>
              }
            >
              {notifications.map((notification) => {
                  return (
                    <>
                      <ListItem
                        key={notification.cid}
                        button
                        onClick={() => {
                          handleDetailsNotification(
                            notification.data().cuser,
                            notification.data().ccar,
                            notification.data().cid
                          );
                        }}
                      >
                        <ListItemIcon>
                          <DraftsIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            "Notification de " + notification.data().cusername
                          }
                        />
                        {notification.data().cunread === 0 ? (
                          <ListItemSecondaryAction>
                            <BadgeNew />
                          </ListItemSecondaryAction>
                        ) : (
                          ""
                        )}
                      </ListItem>
                      <Divider />
                    </>
                  );
                
              })}
            </List>
          </ListContainer>
        </Grid>
        <Grid item lg={9} md={9} xs={12}>
          {open ? (
            levelUser === 1 ? (
              <div style={{ width: "100%", margin: "0 auto" }}>
                <div
                  style={{
                    fontSize: "19px",
                    color: "#b0b0b0",
                    padding: "5px",
                    marginLeft: "10px",
                  }}
                >
                  Demande Détails :{" "}
                </div>
                <PDFContaienr id="pdfContainer">
                  <Avatar
                    src={userObject.photoURL}
                    alt={userObject.username}
                    style={{
                      width: "100px",
                      height: "100px",
                      margin: "2px auto",
                      border: "2px solid whitesmoke",
                    }}
                  />
                  <Grid container>
                    <TitlePart>Les Informations de client</TitlePart>
                    <Grid item lg={12} md={12} xs={12}>
                      <Divider
                        style={{ background: "#ddd", margin: "0px auto" }}
                      />

                      <Grid container>
                        <Grid item lg={6} md={6} xs={12}>
                          <ul>
                            <li
                              style={{
                                padding: "5px",
                                fontFamily: "monospace",
                                fontSize: "20px",
                              }}
                            >
                              Nom et Prenom : {userObject.username}
                            </li>
                            <Divider
                              style={{
                                background: "#ddd",
                                margin: "5px auto",
                              }}
                            />
                            <li
                              style={{
                                padding: "5px",
                                fontFamily: "monospace",
                                fontSize: "20px",
                              }}
                            >
                              Email : {userObject.email}
                            </li>
                            <Divider
                              style={{
                                background: "#ddd",
                                margin: "5px auto",
                              }}
                            />
                            <li
                              style={{
                                padding: "5px",
                                fontFamily: "monospace",
                                fontSize: "20px",
                              }}
                            >
                              Addresse : {userObject.address}
                            </li>
                          </ul>
                        </Grid>
                        <Grid item lg={6} md={6} xs={12}>
                          <ul>
                            <li
                              style={{
                                padding: "5px",
                                fontFamily: "monospace",
                                fontSize: "20px",
                              }}
                            >
                              CNE : {userObject.cne}
                            </li>
                            <Divider
                              style={{
                                background: "#ddd",
                                margin: "5px auto",
                              }}
                            />
                            <li
                              style={{
                                padding: "5px",
                                fontFamily: "monospace",
                                fontSize: "20px",
                              }}
                            >
                              telephone : {userObject.tele}
                            </li>
                            <Divider
                              style={{
                                background: "#ddd",
                                margin: "5px auto",
                              }}
                            />
                            <li
                              style={{
                                padding: "5px",
                                fontFamily: "monospace",
                                fontSize: "20px",
                              }}
                            >
                              Permis : {userObject.permis}
                            </li>
                          </ul>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item lg={12} md={12} xs={12}>
                      <TitlePart>Les Informations de voiture</TitlePart>

                      <Divider
                        style={{ background: "#ddd", margin: "0px auto" }}
                      />
                      <Grid container>
                        <Grid item lg={6} md={6} xs={12}>
                          <ul>
                            <li
                              style={{
                                padding: "5px",
                                fontFamily: "monospace",
                                fontSize: "20px",
                              }}
                            >
                              Marque : {carObject.car_marque}
                            </li>
                            <Divider
                              style={{
                                background: "#ddd",
                                margin: "5px auto",
                              }}
                            />
                            <li
                              style={{
                                padding: "5px",
                                fontFamily: "monospace",
                                fontSize: "20px",
                              }}
                            >
                              Matriculation : {carObject.car_mat}
                            </li>
                            <Divider
                              style={{
                                background: "#ddd",
                                margin: "5px auto",
                              }}
                            />
                            <li
                              style={{
                                padding: "5px",
                                fontFamily: "monospace",
                                fontSize: "20px",
                              }}
                            >
                              Model : {carObject.car_model}
                            </li>
                          </ul>
                        </Grid>
                        <Grid item lg={6} md={6} xs={12}>
                          <ul>
                            <li
                              style={{
                                padding: "5px",
                                fontFamily: "monospace",
                                fontSize: "20px",
                              }}
                            >
                              Kilometrage : {carObject.car_kilo}
                            </li>
                            <Divider
                              style={{
                                background: "#ddd",
                                margin: "5px auto",
                              }}
                            />
                            <li
                              style={{
                                padding: "5px",
                                fontFamily: "monospace",
                                fontSize: "20px",
                              }}
                            >
                              Couleur : {carObject.car_color}
                            </li>
                            <Divider
                              style={{
                                background: "#ddd",
                                margin: "5px auto",
                              }}
                            />
                            <li
                              style={{
                                padding: "5px",
                                fontFamily: "monospace",
                                fontSize: "20px",
                              }}
                            >
                              Prix /Jour : {carObject.car_prix}
                            </li>
                          </ul>
                        </Grid>
                      </Grid>
                      <Divider />
                    </Grid>
                    { 
                      commandObject.type === 1 ? (<Grid item lg={12} md={12} xs={12}>
                        <TitlePart>{"Les Informations d'agence de bail"} </TitlePart>
  
                        <Divider
                          style={{ background: "#ddd", margin: "0px auto" }}
                        />
                        <Grid container>
                          <Grid item lg={6} md={6} xs={12}>
                            <ul>
                              <li
                                style={{
                                  padding: "5px",
                                  fontFamily: "monospace",
                                  fontSize: "20px",
                                }}
                              >
                                {"Nom d'agence : "}  {agenceObject.name}
                              </li>
                              <Divider
                                style={{
                                  background: "#ddd",
                                  margin: "5px auto",
                                }}
                              />
                              <li
                                style={{
                                  padding: "5px",
                                  fontFamily: "monospace",
                                  fontSize: "20px",
                                }}
                              >
                                Email : {agenceObject.email}
                              </li>
                              <Divider
                                style={{
                                  background: "#ddd",
                                  margin: "5px auto",
                                }}
                              />
                      
                            </ul>
                          </Grid>
                          <Grid item lg={6} md={6} xs={12}>
                            <ul>
                              <li
                                style={{
                                  padding: "5px",
                                  fontFamily: "monospace",
                                  fontSize: "20px",
                                }}
                              >
                                Telephone : {agenceObject.tele}
                              </li>
                              <Divider
                                style={{
                                  background: "#ddd",
                                  margin: "5px auto",
                                }}
                              />
                              <li
                                style={{
                                  padding: "5px",
                                  fontFamily: "monospace",
                                  fontSize: "20px",
                                }}
                              >
                                Adresse : {agenceObject.adress}
                              </li>
                              <Divider
                                style={{
                                  background: "#ddd",
                                  margin: "5px auto",
                                }}
                              />
                      
                            </ul>
                          </Grid>
                        </Grid>
                        <Divider />
                      </Grid>) :('')
                    }
                    <div
                      style={{
                        width: "100%",
                        margin: "5px auto",
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      {commandObject.cstatus === 0 ? (
                        <>
                          <MenuButtonDanger
                            aria-label="Dashboard"
                            color="inherit"
                            variant="contained"
                            disableElevation
                            startIcon={<DeleteOutlined />}
                            onClick={handleDelteRequest}
                            disabled={ loading }
                          >
                            Refuser
                          </MenuButtonDanger>
                          <MenuButtonSuccess
                            aria-label="Dashboard"
                            color="inherit"
                            variant="contained"
                            disableElevation
                            startIcon={<CheckIcon />}
                            onClick={handleAcceptRequest}
                            disabled={ loading }
                          >
                            Accepter
                          </MenuButtonSuccess>
                        </>
                      ) : (
                        <Alert severity="info">
                          {" "}
                          Cette commande déjà confirmée{" "}
                        </Alert>
                      )}
                    </div>
                  </Grid>
                </PDFContaienr>
              </div>
            ) : (
                commandObject.cstatus === 1 ? ( <DefaultMessage><Alert severity="success"> Your demmand was accepted succefully </Alert> </DefaultMessage>):
                commandObject.cstatus === -1 ?  ( <DefaultMessage><Alert severity="error"> Your demmand was rejected </Alert></DefaultMessage>) : 
				( <DefaultMessage><Alert severity="error"> Your demmand waitting for a response </Alert></DefaultMessage>)
            )
          ) : (
            <DefaultMessage>Sélectionnez Notification pour ouvrir</DefaultMessage>
          )}
        </Grid>
      </Grid>
    </div>
  );
}
const BadgeNew = styled(FiberNewIcon)`
  &&& {
    color: #f50058;
  }
`;

const ListContainer = styled(Paper)`
  &&& {
    height: 80vh;
    overflow-y: scroll;
  }
`;
const DefaultMessage = styled.div`
  width: 100%;
  font-size: 36px;
  font-family: "Noto Sans JP";
  margin: 36vh auto;
  text-align: center;
  color: #b0b0b0;
  display: flex;
  align-items: center;
  align-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;
const TitlePart = styled.div`
  width: 100%;
  &&& {
    margin: 10px auto;
    font-size: 20px;
    text-align: center;
    font-family: "Noto Sans JP";
  }
`;
const PDFContaienr = styled.div`
  && {
    width: 100%;
    height: 700px;
    overflow-y:scroll;
  }
`;

const MenuButtonSuccess = styled(Button)`
  &&& {
    background: #60c8b5;
    color: white;
    font-family: "Noto Sans JP";
    margin-bottom:10px;
  }

`;

const MenuButtonDanger = styled(Button)`
  &&& {
    background: #ff6262;
    color: white;
    font-family: "Noto Sans JP";
    margin-Bottom:10px;
  }
`;
