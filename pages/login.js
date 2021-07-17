import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";
import { auth, provider,db } from "../firebase";

export default function Login() {

  const handleSignInWithGoogle = () => {
    auth.signInWithPopup(provider).catch(alert);

  };





  return (
    <Container>
      <LoginContainer>
            <Logo src="https://firebasestorage.googleapis.com/v0/b/cars-8bccf.appspot.com/o/logo2.png?alt=media&token=2c009785-888d-4bce-a3e0-8d1dc6daf046" />
            <TitleHead variant="h4" component="h2">
              Gestion des Voitures
            </TitleHead>
            <ButtonLogin variant="contained" onClick={handleSignInWithGoogle}>
              Connectez-vous avec Google
            </ButtonLogin>

      </LoginContainer>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background: whitesmoke;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 100px;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;

const Logo = styled.img`
  height: 150px;
  width: 200px;
  margin-bottom: 50px;
`;
const TitleHead = styled(Typography)`
  &&& {
    margin-bottom: 10px;
    font-family: "Noto Sans JP";
  }
`;
const ButtonLogin = styled(Button)`
  &&& {
    width: 100%;
    margin-bottom: 5px;
    margin-top: 5px;
    font-family: "Noto Sans JP";
    background-color:#60c8b5;
    color:black;
  }
`;

