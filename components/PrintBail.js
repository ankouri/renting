import router, { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import React, { useEffect, useState,useRef } from "react";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from "firebase";
import Image from "next/image";
import ReactToPrint from 'react-to-print';
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

export default function PrintBail(props) {
    const {userObject, carObject, agence} = props;


    useEffect(()=>{
      
    },[])

    return (
        <PDFContaienr id="pdfContainer">
            <Avatar
              src={userObject.photoURL}
              alt={userObject.username}
              style={{
                width: "50px",
                height: "50px",
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
                          padding: "6px",
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
                          padding: "6px",
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
                          padding: "6px",
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
                          padding: "6px",
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
                          padding: "6px",
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
                          padding: "6px",
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
                          padding: "6px",
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
                          padding: "6px",
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
                          padding: "6px",
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
                          padding: "6px",
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
                          padding: "6px",
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
                          padding: "6px",
                          fontFamily: "monospace",
                          fontSize: "20px",
                        }}
                      >
                        Prix /Jour : {carObject.car_prix}
                      </li>
                    </ul>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item lg={12} md={12} xs={12}>
                <TitlePart>{"Les Informations d'agence de bail"}</TitlePart>

                <Divider style={{ background: "#ddd", margin: "0px auto" }} />
                <Grid container>
                  <Grid item lg={6} md={6} xs={12}>
                    <ul>
                      <li
                        style={{
                          padding: "6px",
                          fontFamily: "monospace",
                          fontSize: "20px",
                        }}
                      >
                       {" Nom d'agence"} : {agence.name}
                      </li>
                      <Divider
                        style={{ background: "#ddd", margin: "5px auto" }}
                      />
                      <li
                        style={{
                          padding: "6px",
                          fontFamily: "monospace",
                          fontSize: "20px",
                        }}
                      >
                        Email : {agence.email}
                      </li>
                    
               
                    </ul>
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                    <ul>
                    <li
                        style={{
                          padding: "6px",
                          fontFamily: "monospace",
                          fontSize: "20px",
                        }}
                      >
                        Telephone : {agence.tele}
                      </li>
                      <Divider
                        style={{ background: "#ddd", margin: "5px auto" }}
                      />
                      <li
                        style={{
                          padding: "6px",
                          fontFamily: "monospace",
                          fontSize: "20px",
                        }}
                      >
                        Address : {agence.adress}
                      </li>
                    
                    </ul>
                  </Grid>
                </Grid>
                <Divider />
              </Grid>
            </Grid>
          </PDFContaienr>
    )
}
const PDFContaienr = styled.div`
  && {
    width: 100%;
    height: 700px;
    margin:0 auto;
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