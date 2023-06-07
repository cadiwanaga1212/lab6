import react from "react";
import Form from "../Components/form.js";
import { Box, Button, Typography } from "@mui/material";

class Auth extends react.Component{
    constructor(props){
        super(props);
        this.state = {
            showForm: false,
            selectedForm: undefined,
        }
    }

    closeForm = () => {
        this.setState({showForm: false});
    }

    login = (data) => {
        fetch(this.props.server_url + "/api/auth/login", {
          method: "POST",
          mode: 'cors',
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Accept" : "application/json"
          },
          body: JSON.stringify(data),
        })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.status === true) {
            // Login is successful, change the screen to Lobby
            this.props.changeScreen("lobby");
          } else {
            // Login failed, handle it here
            console.log("Login failed: " + data.msg);
          }
        })
        .catch((error) => {
          // Network or connection error, handle gracefully
          console.log("Login error", error);
        });
      }
      

    register = (data) => {
        fetch(this.props.server_url + "/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then((response) => {
            if (response.status == 201) {
                // User registration successful, you can redirect them to the login page, or show a success message
                this.setState({showForm: false});
            }
            else {
                // User registration failed, handle it here
                console.log("Registration failed");
            }
        })
        .catch((error) => {
            // Network or connection error, handle gracefully
            console.log("Registration error", error);
        });
      }
      
    


render() {
    let display = null;
    if (this.state.showForm) {
        let fields = [];
        if (this.state.selectedForm === "login") {
            fields = ['username', 'password'];
            display = <Form fields={fields} close={this.closeForm} type="login" submit={this.login} key={this.state.selectedForm}/>;
        }
        else if (this.state.selectedForm === "register") {
            fields = [ 'username', 'password', 'name'];
            display = <Form fields={fields} close={this.closeForm} type="register" submit={this.register} key={this.state.selectedForm}/>;
        }   
    }
    else {
        display = 
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Button variant="contained" color="primary" onClick={() => this.setState({showForm: true, selectedForm:"login"})}> Login </Button>
                <Button variant="contained" color="secondary" onClick={() => this.setState({showForm: true, selectedForm: "register"})}> Register </Button>
            </Box>;
    }
    return(
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, m: 4, marginTop: '0%',paddingTop: '6%'}}>
            <Typography variant="h3" component="h1"> Welcome to Our Messaging App! </Typography>
            <Typography variant="subtitle1">Stay connected with your friends and colleagues in real-time</Typography>
            <Box sx={{ width: '100%', maxWidth: 400 }}>
                {display}
            </Box>
        </Box>
    );
}
}


export default Auth;