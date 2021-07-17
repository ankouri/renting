/* eslint-disable @next/next/no-img-element */
import router, { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import PersonIcon from "@material-ui/icons/Person";
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Button,
  Chip,
  Grid,
  Avatar,
  Divider,
} from "@material-ui/core";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import PrintIcon from "@material-ui/icons/Print";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Loading from './../components/Loading';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
  table: {
    minWidth: 700,
  },
}));

export default function Create() {
  const route = useRouter();
  const [carID, setCarID] = useState(route.query.carID);
  const [carObject, setCarObject] = useState([]);
  const [userObject, setUserObject] = useState([]);
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  const fetchData = async () => {
    if (route.query.carID) {
      await db
        .collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          setUserObject(doc.data());
          console.log(userObject);
        })
        .catch((error) => {
          router.back();
        });

      await db
        .collection("cars")
        .doc(carID)
        .get()
        .then((docCard) => {
          setCarObject(docCard.data());
          console.log(carObject);
        })
        .catch((error) => {
          router.back();
        });
    } else {
      router.back();
    }
  };

  const generatePDF = async() => {
    setLoading(true);
   
    await html2canvas(document.querySelector("#pdfContainer")).then(canvas => {
      const divImage = canvas.toDataURL("image/jpg");
      const pdf = new jsPDF({orientation: "landscape",unit: "px"});
      pdf.addImage(divImage, 'PNG', 0, 0);
      pdf.save("contrat.pdf");
    });

    await db.collection('commands').add({})
    .then((docRef)=>{
        db.collection('commands').doc(docRef.id).set({
          cid:docRef.id,
          cuser:userObject.uid,
          cusername:userObject.username,
          ccar:carObject.car_id,
          cunread:0,
          cstatus:0,
          type:0,
        })
    })
    setLoading(false)
    route.push('/')
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Container>
        <Navbar position="static">
          <Toolbar>
            <TitleHead
              className={classes.title}
              variant="h6"
              noWrap
              onClick={() => {}}
            >
              Gestion des voitures
            </TitleHead>

            <div className={classes.grow} />

            <div>
              <MenuButton
                aria-label="Dashboard"
                color="inherit"
                variant="contained"
                disableElevation
                startIcon={<ArrowBackIosIcon />}
                onClick={() => {
                  router.back();
                }}
              >
                Annuler
              </MenuButton>

              <MenuButton
                aria-label="Dashboard"
                color="inherit"
                variant="contained"
                disableElevation
                startIcon={<PrintIcon />}
                onClick={generatePDF}
              >
                Valider
              </MenuButton>
            </div>
          </Toolbar>
        </Navbar>
        <Paper>
          { 
            loading ? <Loading /> : (<div style={{ width: "90%", margin: "0px auto" }}>
            <PDFContaienr id="pdfContainer">
            <TitleProfile
                icon={<PersonIcon />}
                label="Informations de contrat LLD "
                color="basic"
              />
              <Avatar
                src={userObject.photoURL}
                alt={userObject.username}
                style={{
                  width: "60px",
                  height: "60px",
                  margin: "2px auto",
                  border: "2px solid whitesmoke",
                }}
              />
              <Grid container>
                <TitlePart>Les Informations de client</TitlePart>
                <Grid item lg={12} md={12} xs={12}>
                  <Divider style={{ background: "#ddd", margin: "0px auto" }} />

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
                          style={{ background: "#ddd", margin: "5px auto" }}
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
                          style={{ background: "#ddd", margin: "5px auto" }}
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
                          style={{ background: "#ddd", margin: "5px auto" }}
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
                          style={{ background: "#ddd", margin: "5px auto" }}
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

                  <Divider style={{ background: "#ddd", margin: "0px auto" }} />
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
                          style={{ background: "#ddd", margin: "5px auto" }}
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
                          style={{ background: "#ddd", margin: "5px auto" }}
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
                          style={{ background: "#ddd", margin: "5px auto" }}
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
                          style={{ background: "#ddd", margin: "5px auto" }}
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
              </Grid>
            </PDFContaienr>
          </div>)
          }
        </Paper>
      </Container>
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
const PDFContaienr = styled.div`
  && {
    width: 100%;
    height: 600px;
  }
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
const TitleProfile = styled(Chip)`
    width:100%;
    margin:10px auto;
    &&&{
    font-family: "Noto Sans JP";
    }

`;