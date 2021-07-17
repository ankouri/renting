import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import React, { useEffect, useState, useRef } from "react";
import {
  Grid,
  Paper,
  Button,
  ListItemSecondaryAction,
  ListSubheader,
  ListItemIcon,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@material-ui/core";
import DraftsIcon from "@material-ui/icons/Drafts";
import FiberNewIcon from "@material-ui/icons/FiberNew";
import styled from "styled-components";
import Loading from "./Loading";
import Alert from "@material-ui/lab/Alert";

export default function Response() {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [user] = useAuthState(auth);
    const [carObject, setCarObject] = useState([]);
    const [userObject, setUserObject] = useState([]);
    const [commandObject, setCommandObject] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(0);

    const fetchData = async () => {
        let list = [];
        await db
          .collection("commands")
          .get()
          .then((snapshot) => {
            snapshot.docs.map(doc=>{
                if(doc.data().cuser === user.uid){
                    list.push(doc.data())
                }
            })
            setCommandObject(list);
          });
    };
    const viewNotification = (user, car, status)=>{
        setLoading(true);
        setOpen(true);
        setSelectedMessage(status);
    }
    useEffect(() => {
        fetchData();
      }, []);


    return (
        <div>
        <Grid container>
          <Grid item lg={3} md={3} xs={6}>
            <ListContainer elevation={0}>
              <List
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Toutes Les Notifications :
                  </ListSubheader>
                }
              >
                {commandObject.map((command) => {
                    return (
                      <>
                        <ListItem
                          key={command.cid}
                          button
                          onClick={() => {
                            viewNotification(
                                command.cuser,
                                command.ccar,
                                command.cstatus
                            );
                          }}
                        >
                          <ListItemIcon>
                            <DraftsIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              "Notification Administrative "
                            }
                          />
                          {command.cunread === 0 ? (
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
          <Grid item lg={9} md={9} xs={6}>
            {open ? (
                  selectedMessage === 1 ? ( <DefaultMessage><Alert severity="success"> Votre demande a été acceptée avec succès </Alert> </DefaultMessage>):
                  selectedMessage === -1 ?  ( <DefaultMessage><Alert severity="error"> Votre demande a été rejetée</Alert></DefaultMessage>) : 
                  ( <DefaultMessage><Alert severity="error"> Votre demande en attente de réponse </Alert></DefaultMessage>)
              
            ) : (
              <DefaultMessage>Select Notification to open</DefaultMessage>
            )}
          </Grid>
        </Grid>
      </div>
    )
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
  }
`;

const MenuButtonSuccess = styled(Button)`
  &&& {
    background: #60c8b5;
    color: white;
    font-family: "Noto Sans JP";
  }
`;

const MenuButtonDanger = styled(Button)`
  &&& {
    background: #ff6262;
    color: white;
    font-family: "Noto Sans JP";
  }
`;

