import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import React, { useEffect, useState,useRef } from "react";
import { Grid,Chip,Button, Avatar, Typography,Divider,List,ListItem,IconButton,TextField,FormControl } from '@material-ui/core';
import styled from 'styled-components';
import EmailIcon from '@material-ui/icons/Email';
import RoomIcon from '@material-ui/icons/Room';
import PhoneIcon from '@material-ui/icons/Phone';
import PersonIcon from '@material-ui/icons/Person';
import Loading from './Loading';
import TodayIcon from '@material-ui/icons/Today';
import { Alert } from '@material-ui/lab';
export default function Profile() {
    const [user] = useAuthState(auth);
    const [userData, setUserData] = useState({})
    const [loading , setLoading] = useState(false);
    const [message , setMessage] = useState('');
    const usernameRef = useRef();
    const addressRef = useRef();
    const phoneRef = useRef();
    const cneRef = useRef();
    const birthDayRef = useRef();
    const permisRef = useRef();


    const handleUpdateInformation = (e)=>{
        e.preventDefault();
        setLoading(true);
        
        db.collection('users').doc(user.uid).update({
            tele:phoneRef.current.value ? phoneRef.current.value :'xx xx xx xx xx',
            address:addressRef.current.value ? addressRef.current.value : 'Your Adress',
            username:usernameRef.current.value ? usernameRef.current.value : user.displayName,
            cne:cneRef.current.value ? cneRef.current.value : 'xxxxxx',
            permis:permisRef.current.value ? permisRef.current.value : 'xxxxxx',
            birthDay:birthDayRef.current.value ? birthDayRef.current.value : 'xx/xx/xxxx',
        }).then(()=>{
            setMessage('Updated successfuly')
        })
        .catch((err)=>{
            setMessage(err.toString());
        })
        setLoading(false);
    }

   

    useEffect(() => {
        db.collection("users")
          .get()
          .then((snapshot) => {
            snapshot.docs.forEach((singleUser) => {
                if(user.email === singleUser.data().email){
                    setUserData({level:singleUser.data().level,
                        phone:singleUser.data().tele,
                        address:singleUser.data().address,
                        last:singleUser.data().lastSeen,
                        birthDay:singleUser.data().birthDay,
                        cne:singleUser.data().cne,
                        permis:singleUser.data().permis
                    });
                }
            });
          });
     
      }, []);

    return (
        <div>
            <Grid container>
          
            <Grid item lg={4} md={4} xs={6}>
                
                <LeftProfile>
                <TitleProfile
                        icon={<PersonIcon />}
                        label="Profile Informations "
                        color="basic"
                    />
                    <Container>
                 
                    <UserAvatar  alt={ user.displayName } src={ user.photoURL } />
                  
                    {/* <ButtonAvatar
                        variant="contained"
                        component="label"
                        >
                        Mise ajour Avatar
                      
                        </ButtonAvatar> */}
                    <Username variant="h5" component="h2">
                        {user.displayName }
                    </Username>
                    <List>
                        <ListItem>
                            <Username variant="h6" component="h6"><MenuBtn><EmailIcon/></MenuBtn> {  user.email }</Username>
                        </ListItem>
                        <Divider  component="li"/>
                        <ListItem>
                            <Username variant="h6" component="h6"><MenuBtn><RoomIcon/></MenuBtn> { userData.address }</Username>
                        </ListItem>
                        <Divider  component="li"/>
                        <ListItem>
                            <Username variant="h6" component="h6"><MenuBtn><PhoneIcon/></MenuBtn> {  userData.phone }</Username>
                        </ListItem>
                        <Divider  component="li"/>
                        <ListItem>
                            <Username variant="h6" component="h6"><MenuBtn><TodayIcon/></MenuBtn> {  userData.birthDay }</Username>
                        </ListItem>

                        
                        </List>
                        </Container>
                </LeftProfile>
                
            </Grid>
            <Grid item lg={8} md={8} xs={6}>
          
            <RightProfile>
                <TitleProfile
                        icon={<PersonIcon />}
                        label="Mise A jour Informations "
                        color="basic"
                    />
                      {
                       message && <Alert severity="info"  
                      >{ message } </Alert>
                   }
                <form onSubmit={ handleUpdateInformation }>
    
                    <Grid container spacing={2} >
                        <Grid item lg={6} md={6} xs={6} >
                        <FormControl style={{ width:"100%",marginTop:'16px'}}>
                            <Input defaultValue={ user.email } label="Email" disabled variant="outlined" />
                          </FormControl>
                        </Grid>
                        <Grid item lg={6} md={6} xs={6}>
                        <FormControl style={{ width:"100%",marginTop:'16px'}}>
                            <Input defaultValue={ user.displayName } inputRef={ usernameRef } name="username" label="Username"  variant="outlined" />
                           </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item lg={6} md={6} xs={6}>
                        <FormControl style={{ width:"100%",marginTop:'16px'}}>
                            <Input defaultValue={ userData.phone } inputRef={ phoneRef } name="phone"  label="Phone"  variant="outlined" />
                        </FormControl>
                        </Grid>
                        <Grid item lg={6} md={6} xs={6}>
                            <FormControl  style={{ width:"100%",marginTop:'16px'}}>
                            <Input  defaultValue={ userData.address }  name="adress" inputRef={ addressRef }   label="Address"  variant="outlined" />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item lg={6} md={6} xs={6}>
                        <FormControl style={{ width:"100%",marginTop:'16px'}}>
                            <Input defaultValue={ userData.cne } inputRef={ cneRef } name="cne"  label="CNE"  variant="outlined" />
                        </FormControl>
                        </Grid>
                        <Grid item lg={6} md={6} xs={6}>
                            <FormControl  style={{ width:"100%",marginTop:'16px'}}>
                            <Input  defaultValue={ userData.permis }  name="permis" inputRef={ permisRef }   label="Permis"  variant="outlined" />
                            </FormControl>
                        </Grid>
                        <Grid item lg={12} md={12} xs={12}>
                            <FormControl  style={{ width:"100%",marginTop:'16px'}}>
                            <Input  defaultValue={ userData.birthDay } type="date"  name="birthday" inputRef={ birthDayRef }   label="Date de naissance"  variant="outlined" />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <ButtonLogin variant="contained" disabled={ loading } type="submit">
                        Mise a Jour Les informations
                   </ButtonLogin>
                    
                    
                </form>
            </RightProfile>
            </Grid>
            
            </Grid>
        </div>
    )
}
const Container = styled.div`
    border:1px solid whitesmoke;
    display:flex;
    justify-content:center;
    align-items:center;
    padding:10px 0px;
    flex-direction:column;
    
`;
const Input = styled(TextField)`
    &&&{
        width:100%;
        max-width:100%;
    }
`;
const RightProfile = styled.div`
    padding:20px;
`;
const LeftProfile = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    padding:20px;
    flex-direction:column;
`;

const UserAvatar = styled(Avatar)`
    &&&{
        width:100px;
        height:100px;
    }
`;
const Username = styled(Typography)`
    &&&{
    margin-top: 10px;
    font-family: "Noto Sans JP";
    }
`;

const MenuBtn = styled(IconButton)`
    &&&{
        padding:0;
        color:#60c8b5;
    }
`;

const TitleProfile = styled(Chip)`
    width:90%;
    &&&{
    margin-bottom: 19px;
    font-family: "Noto Sans JP";
    }

`;
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

const ButtonAvatar = styled(Button)`
    &&&{
        margin-bottom: 5px;
    margin-top: 5px;
    font-family: "Noto Sans JP";
    background-color:#60c8b5;
    color:black;
    font-size:12px;
    }
`;