import router, { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import React, { useEffect, useState,useRef } from "react";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from "firebase";
import Image from "next/image";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Paper,
  Chip,
  Button,
  Grid,
  Avatar,
  ListItemIcon,
  List,
  Divider,
  ListItem,
  ListItemText,
  FormControl,
  TextField,
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import jsPDF from "jspdf";
import CommuteIcon from "@material-ui/icons/Commute";
import PersonIcon from "@material-ui/icons/Person";
import InboxIcon from "@material-ui/icons/Inbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import Loading from "../components/Loading";
import  ArrowForwardIosIcon  from '@material-ui/icons/ArrowForwardIos';
import { Alert } from "@material-ui/lab";
import PrintBail from './../components/PrintBail';
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@material-ui/icons/Print";

const html2pdf =  dynamic(() => import('html2pdf.js'));

import { ReactToPrint } from 'react-to-print'
import { Head } from 'next/head';
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

export default function More() {
  const route = useRouter();
  const nameRef = useRef('');
  const emailRef = useRef('');
  const telRef = useRef('');
  const adressRef = useRef('');
  const [carID, setCarID] = useState(route.query.carID);
  const [message, setMessage] = useState('');
  const [valider, setValider] = useState(false);
  const classes = useStyles();
  const [carObject, setCarObject] = useState([]);
  const [userObject, setUserObject] = useState([]);
  const [agenceObject, setAgenceObject] = useState([]);
  const [user] = useAuthState(auth);


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

  const generatePDF = async(e)=>{
  
    var element = document.getElementById('pdfContainer');
    var opt = {
      margin:       1,
      filename:     'contrat.pdf',
      image:        { type: 'jpg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'pt', format: 'letter', orientation: 'portrait' }
    };

    await html2pdf().set(opt).from(element).save();
  
    route.push('/');

  }

  const handleSubmitAgence = async(e)=>{
    e.preventDefault();
    if(nameRef.current.value === '' || emailRef.current.value === '' || telRef.current.value === ''
    || adressRef.current.value === ''){
      setMessage('toutes les champs sont obligatoire');
      return
    }else{

      await db.collection('commands').add({})
      .then((docRef)=>{
          db.collection('commands').doc(docRef.id).set({
            cid:docRef.id,
            cuser:userObject.uid,
            cusername:userObject.username,
            ccar:carObject.car_id,
            cunread:0,
            cstatus:0,
            type:1,
          })

          db.collection('agence').doc(docRef.id).set({
            id:docRef.id,
            name:nameRef.current.value,
            email:emailRef.current.value,
            adress:adressRef.current.value,
            tele:telRef.current.value,
            commandID:docRef.id
          })

      })
   

      setValider(true);

    }

   

  }

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
                Retourner
              </MenuButton>

              {
                valider ? ( <MenuButton
                  aria-label="Dashboard"
                  color="inherit"
                  variant="contained"
                  disableElevation
                  startIcon={<PrintIcon />}
                  onClick={generatePDF }
                >
                  Print
                </MenuButton>) : ('')
              }

            </div>
          </Toolbar>
        </Navbar>
        <Paper style={ {width:'100%', margin:'0 auto', textAlign:'center'}}>
        <TitleProfile
                icon={<PersonIcon />}
                label="Informations d'agence de credit bail "
                color="basic"
              />
          {
            valider ? (
              <>
             <PrintBail  userObject={ userObject} carObject={ carObject } agence={ 
               {name:nameRef.current.value,
                email:emailRef.current.value,
                tele:telRef.current.value,
                adress:adressRef.current.value
               } }  />


              </>
            ) : ( 
           <>
            {
              message && <Alert severity="error" style={{width:'70%', margin:'0 auto'}}>{ message }</Alert>
            }
        <form onSubmit={ handleSubmitAgence } style={{ padding:'40px'}}>
    
        <Grid container spacing={2} >
            <Grid item lg={6} md={6} xs={6} >
            <FormControl style={{ width:"100%",marginTop:'16px'}}>
                <Input  inputRef={ nameRef } name="nom" label="nom de l'agence" variant="outlined"/>
              </FormControl>
            </Grid>
            <Grid item lg={6} md={6} xs={6}>
            <FormControl style={{ width:"100%",marginTop:'16px'}}>
                <Input  inputRef={ telRef } name="Telephone" label="Numbero Telephone"  variant="outlined" />
              </FormControl>
            </Grid>
        </Grid>
        <Grid container spacing={2}>
            <Grid item lg={6} md={6} xs={6}>
            <FormControl style={{ width:"100%",marginTop:'16px'}}>
                <Input type="email" inputRef={ emailRef } name="Email"  label="Email "  variant="outlined" />
            </FormControl>
            </Grid>
            <Grid item lg={6} md={6} xs={6}>
                <FormControl  style={{ width:"100%",marginTop:'16px'}}>
                <Input inputRef={ adressRef }   label="Address"  variant="outlined" />
                </FormControl>
            </Grid>
        </Grid>
      
        <ButtonLogin variant="contained"  type="submit">
            Valider
      </ButtonLogin>
</form>
           </>)
          }
         

        </Paper>
      </Container>
    </div>
  );
}
const ButtonLogin = styled(Button)`
  &&& {
    width: 100%;
    margin-bottom: 5px;
    margin-top: 20px;
    font-family: "Noto Sans JP";
    background-color:#60c8b5;
    color:black;
  }
`;

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

const TitleProfile = styled(Chip)`
    width:80%;
    margin:10px auto;
    &&&{
    font-family: "Noto Sans JP";
    }

`;
const Input = styled(TextField)`
    &&&{
        width:100%;
        max-width:100%;
    }
`;