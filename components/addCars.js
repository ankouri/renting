import { auth, db,storage } from "../firebase";
import React, { useState,useRef } from "react";
import styled from "styled-components";
import CommuteIcon from '@material-ui/icons/Commute';
import {
  Grid,
  Chip,
  InputLabel,
  Select,
  Button,
  MenuItem,TextField,FormControl
} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';


export default function AddCars() {

    const [selectedFile, setSelectedFile] = useState('');
    const [status, setstatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [result, setResult] = useState('');
    const [carImageLink, setCarImageLink] = useState('');

    const marqueRef = useRef();
    const modelRef = useRef();
    const matRef = useRef();
    const prixRef = useRef();
    const colorRef = useRef();
    const nbRef = useRef();
    const statuRef = useRef();
    const kiloRef = useRef();

    const handleImageChange = ({ target })=>{
        setSelectedFile(target.files[0]);
    }

    const handleStatus = (event)=>{
        setstatus(event.target.value);
    }

    const handleUploadImageCar = async(event, file)=>{
        event.preventDefault();
        const ref = storage.ref(`/cars/${file.name}`);
        const uploadTask = ref.put(file);
         uploadTask.on('state_changed',
            snapshot => {
                console.log(snapshot)
            },
            error=>{
                console.log(error)
            },
            ()=>{
                 storage
                .ref("cars")
                .child(file.name)
                .getDownloadURL()
                .then(fireBaseUrl =>{
                    handleAddCar(fireBaseUrl)
                })
            }
        )
       
    }

    const handleAddCar = async(urlFirebase)=>{
        if(
            urlFirebase !== '' &&
            marqueRef.current.value !== '' &&
            modelRef.current.value !== '' &&
            matRef.current.value !== '' &&
            prixRef.current.value !== '' &&
            colorRef.current.value !== '' &&
            nbRef.current.value !== '' &&
            statuRef.current.value !== '' &&
            kiloRef.current.value !== '' 

        ){
            setMessage('')
            setLoading(true)
            db.collection('cars').add({})
            .then((docRef)=>{
                db.collection('cars').doc(docRef.id).set({
                    car_id:docRef.id,
                    car_img:urlFirebase,
                    car_marque: marqueRef.current.value,
                    car_model: modelRef.current.value,
                    car_mat: matRef.current.value,
                    car_prix: prixRef.current.value,
                    car_color: colorRef.current.value,
                    car_nb: nbRef.current.value,
                    car_status: statuRef.current.value,
                    car_kilo: kiloRef.current.value,
                    car_date: new Date()
                })
                setResult('voiture ajout??e avec succ??s')
                setSelectedFile('')
                document.getElementById('addCar').reset();
                return true;
            })
            .catch((err)=>{
                
                setMessage(err)
                return false;
            })
            setLoading(false)

        }else{
            setMessage('tout les champs sont obligatoir');
            return
        }
    }

    return (
        <div>
           <Grid container justify="center" align="center">
               <Grid item lg={10} md={10} xs={12} >
                   <CarsContainer>
                   <TitleProfile
                        icon={<CommuteIcon />}
                        label="Ajouter une voiture"
                        color="basic"
                    />
                    {
                        message && <Alert severity="error" style={{ marginBottom:'8px'}}>{ message }</Alert>
                    }
                    {
                        result && <Alert severity="success" style={{ marginBottom:'8px'}}>{ result }</Alert>
                    }
                    <form onSubmit={ (e) => { handleUploadImageCar(e, selectedFile) } } id="addCar"> 
                    <Grid container spacing={2}>
                            <Grid item lg={12} md={12} xs={12}>
                                <ImgePreview src={ selectedFile ? URL.createObjectURL(selectedFile) : ''} alt="" />
                                <InputFile type="file" accept="image/*" onChange={ handleImageChange } />
                            </Grid>
                    </Grid>
                        <Grid container spacing={2}>
                            <Grid item lg={6} md={6} xs={12}>
                                    <FormControl fullWidth>
                                    <TextField inputRef={ marqueRef } fullWidth type="text" placeholder="Marque"  label="Marque" variant="outlined" />
                                </FormControl>
                
                            </Grid>
                            <Grid item lg={6} md={6} xs={12}>
                                    <FormControl fullWidth>
                                    <TextField inputRef={ modelRef }  fullWidth type="text" placeholder="Model"  label="Model" variant="outlined" />
                                </FormControl>
                            </Grid>
                            <Grid item lg={6} md={6} xs={12}>
                                    <FormControl fullWidth>
                                    <TextField inputRef={ matRef }  fullWidth type="text" placeholder="Matricule"  label="Matricule" variant="outlined" />
                                </FormControl>
                            </Grid>
                            <Grid item lg={6} md={6} xs={12}>
                                    <FormControl fullWidth>
                                    <TextField inputRef={ kiloRef }  fullWidth type="text" placeholder="Kilometrage"  label="Kilometrage" variant="outlined" />
                                </FormControl>
                            </Grid>
                            <Grid item lg={6} md={6} xs={12}>
                                    <FormControl fullWidth>
                                    <TextField inputRef={ prixRef }  fullWidth type="text" placeholder="Prix par jour"  label="Prix" variant="outlined" />
                                </FormControl>
                            </Grid>
                            <Grid item lg={6} md={6} xs={12}>
                                    <FormControl fullWidth>
                                    <TextField  inputRef={ colorRef } fullWidth type="text" placeholder="Couleur"  label="Couleur" variant="outlined" />
                                </FormControl>
                            </Grid>

                            <Grid item lg={6} md={6} xs={12}>
                                <FormControl fullWidth>
                                    <TextField inputRef={ nbRef } fullWidth type="text" placeholder="Nombres des place"  label="Nombres des place" variant="outlined" />
                                </FormControl>
                            </Grid>

                            <Grid item lg={6} md={6} xs={12}>
                                <FormControl fullWidth variant="outlined">
                                <InputLabel id="demo-simple-select-label">statut</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    inputRef={ statuRef }
                                    value={ status }
                                    onChange={ handleStatus }
                                    label="statut"
                                    >
                                    <MenuItem value={1}>Lou??</MenuItem>
                                    <MenuItem value={0}>Lib??rer</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                        </Grid>
                        <Grid container justify="center" align="center">
                            <Grid item lg={6} md={6} xs={12}>
                            <ButtonLogin variant="contained" disabled={ loading } type="submit">
                        Ajouter voiture
                   </ButtonLogin>
                
                            </Grid>
                        </Grid>

                    </form>
                </CarsContainer>
               </Grid>
           </Grid>
        </div>
    )
}
const CarsContainer = styled.div`
    margin-top:35px;
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

const ImgePreview = styled.img`
    &&&{
    height:200px;
    border:1px solid whitesmoke;
    width:50%;
    }
`;
const InputFile = styled.input`
    font-size:16px;
    font-family:"Noto Sans JP";
    display: grid;
    
`;