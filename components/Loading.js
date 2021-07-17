/* eslint-disable @next/next/no-img-element */
import { Grid } from '@material-ui/core';
import { Circle } from 'better-react-spinkit';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';

export default function Loading() {
    return (
        <center style={{ display:"grid", placeItems:"center",height:"100vh"}}>
            <div>
                
                <Circle color="#60c8b5" size={ 80 }/>
                <TitleHead variant="h5" component="h2">
                    Loading...
                </TitleHead>
            </div>
        </center>
    )
}

const TitleHead = styled(Typography)`
  &&& {
    margin-bottom: 10px;
    font-family: "Noto Sans JP";
    color:#60c8b5;
    font-weight:bold;
  }
`;

