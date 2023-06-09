import react from "react";
import { Button, Grid, Snackbar } from "@mui/material";
import Form from '../Components/form'; // Assuming Form component is in the same directory

class Lobby extends react.Component {
    constructor(props){
        super(props);
        this.state = {
            rooms: undefined,
            createFormVisible: false,
            joinFormVisible: false,
            deleteFormVisible: false,
            error: null,
            openSnackbar: false,            
        }
    }

    handleErrorClose = () => {
        this.setState({
            openSnackbar: false,
            error: null
        });
    }

    componentDidMount(){
        // checking if the user has active session
        // if yes, then show lobby. if no, then show auth
        fetch(this.props.server_url + '/api/rooms/all', {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res) => {
            res.json().then((data) => {
                this.setState({rooms:data})
            });
        });
    }

    handleCreateRoom = () => {
        this.setState(prevState => ({createFormVisible: !prevState.createFormVisible}));
    }

    handleJoinRoom = () => {
        this.setState(prevState => ({joinFormVisible: !prevState.joinFormVisible}));
    }

    handleDeleteRoom = () => {
        this.setState(prevState => ({deleteFormVisible: !prevState.deleteFormVisible}));
    }

    logout = () => {
        fetch(this.props.server_url + "/api/auth/logout", {
            method: "GET",
            mode: 'cors',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Accept" : "application/json"
            }
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.status === true) {
                // Logout is successful, navigate to the login page or wherever you want
                this.props.changeScreen("auth");
            } else {
                // Logout failed, handle it here
                this.setState({
                    error: "Logout failed: " + data.msg,
                    openSnackbar: true
                });
            }
        })
        .catch((error) => {
            // Network or connection error, handle gracefully
            console.log("Logout error", error);
        });
    }
    

    createRoom = (data) => {
        fetch(this.props.server_url + "/api/rooms/create", {
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
            if (data.message === "Room created") {
                // Room creation is successful, refresh the list of rooms
                this.refreshRooms();
            } else {
                // Room creation failed, handle it here
                this.setState({
                    error: "Room creation failed: " + data.message,
                    openSnackbar: true
                });
            }
        })
        .catch((error) => {
            // Network or connection error, handle gracefully
            console.log("Room creation error", error);
        });
    }
    
    joinRoom = (data) => {
        fetch(this.props.server_url + "/api/rooms/join", {
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
            if (data.message === "Joined room") {
                // Room join is successful, refresh the list of rooms
                this.refreshRooms();
            } else {
                // Room creation failed, handle it here
                this.setState({
                    error: "Room creation failed: " + data.message,
                    openSnackbar: true
                });
            }
        })
        .catch((error) => {
            // Network or connection error, handle gracefully
            console.log("Room join error", error);
        });
    }
    
    deleteRoom = (data) => {
        fetch(this.props.server_url + "/api/rooms/leave", {
            method: "DELETE",
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
            if (data.message === "Left room") {
                // Room deletion is successful, refresh the list of rooms
                this.refreshRooms();
            } else {
                // Room creation failed, handle it here
                this.setState({
                    error: "Room creation failed: " + data.message,
                    openSnackbar: true
                });
            }
        })
        .catch((error) => {
            // Network or connection error, handle gracefully
            console.log("Room deletion error", error);
        });
    }
    
    refreshRooms = () => {
        fetch(this.props.server_url + '/api/rooms/all', {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res) => {
            res.json().then((data) => {
                this.setState({rooms:data})
            });
        });
    }
    
    render(){
        return(
            <div>
                <h1 style={{marginTop: '0%',paddingTop: '6%', textAlign: 'left', marginLeft: '10%'}}>Lobby</h1>
                <Grid container spacing={1} style={{width: '1230px', height: '600px', position: 'absolute', marginLeft: '100px'}}>
                    <Grid item xs={12}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Button color='secondary' style={{position: 'relative', margin: '20px', width: '190px', height: '70px'}} variant="contained" onClick={this.handleCreateRoom}>
                                Create Room
                            </Button>
                            {this.state.createFormVisible && 
                                <div style={{ position: 'relative' }}>
                                    <div style={{ backgroundColor: 'green', position: 'absolute', marginLeft: '50px', marginTop: '50px',width: '50px',zIndex: -1 }}></div>
                                <Form
                                    type='Create Room'
                                    fields={['name']}
                                    submit={this.createRoom} // replace with the function that sends a request to create a room
                                    close={this.handleCreateRoom}
                                />
                                </div>
                            }
                            <br/>
                            <Button style={{position: 'static', margin: '20px', width: '190px', height: '70px'}} variant="contained" onClick={this.handleJoinRoom}>
                                Join Room
                            </Button>
                            {this.state.joinFormVisible && 
                                <Form
                                    type='Join Room'
                                    fields={['roomName']}
                                    submit={this.joinRoom} // replace with the function that sends a request to join a room
                                    close={this.handleJoinRoom}
                                />
                            }
                            <br/>
                            <Button style={{backgroundColor: "rgba(255, 0, 0,.6)", position: 'static', margin: '20px', width: '190px', height: '70px'}} variant="contained" onClick={this.handleDeleteRoom}>
                                Leave Room
                            </Button>
                            {this.state.deleteFormVisible && 
                                <Form
                                    type='Delete Room'
                                    fields={['roomName']}
                                    submit={this.deleteRoom} // replace with the function that sends a request to delete a room
                                    close={this.handleDeleteRoom}
                                />
                            }
                            <br/>
                            <Button variant="contained" onClick={this.logout} style={{backgroundColor: 'rgba(128,128,128, .8)', position: 'static', margin: '20px', width: '190px', height: '70px'}}>
                            Logout
                        </Button>
                        </div>
                    </Grid>
                    <Grid item xs={12} style={{ position: 'relative', marginLeft: '660px', width: '30%', boxSizing: 'content-box', marginTop: '-550px'}}> 
                    <div style={{ paddingBottom: '15px',paddingTop: '5px', overflowY: 'auto', maxHeight: '500px', backgroundColor: 'rgba(255, 255, 255, .15)', maxWidth: '600px', border: '1px solid white'}}>
                    <h2>Chatrooms</h2>
                    {this.state.rooms ? this.state.rooms.map((room) => {
                    return (
                        <Button style={{position: 'relative', margin: '15px', height: '50px', fontSize: '15px', padding: '25px', width: '150px',  overflowY: 'auto',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'}} 
                        variant="contained" 
                        key={"roomKey"+room._id} 
                        onClick={() => this.props.changeScreen("chatroom", room.name)}>
                            {room.name}
                        </Button>
                    )
                    }) : "loading..."}
                    </div>
                    </Grid>
                </Grid>
                <Snackbar
                    open={this.state.openSnackbar}
                    autoHideDuration={6000}
                    onClose={this.handleErrorClose}
                    message={this.state.error}
                    action={
                        <Button color="secondary" size="small" onClick={this.handleErrorClose}>
                            Close
                        </Button>
                    }
                />
            </div>
        );
    }
}

export default Lobby;
