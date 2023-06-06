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
                <h1 style={{marginTop: '0%',paddingTop: '6%'}}>Lobby</h1>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <div >
                            <Button style={{backgroundColor: "green"}}variant="contained" onClick={this.handleCreateRoom}>
                                Create Room
                            </Button>
                            {this.state.createFormVisible && 
                                <Form
                                    type='Create Room'
                                    fields={['name']}
                                    submit={this.createRoom} // replace with the function that sends a request to create a room
                                    close={this.handleCreateRoom}
                                />
                            }

                            <Button style={{backgroundColor: "green"}} variant="contained" onClick={this.handleJoinRoom}>
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

                            <Button style={{backgroundColor: "red"}} variant="contained" onClick={this.handleDeleteRoom}>
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
                            <Button variant="contained" onClick={this.logout}>
                            Logout
                        </Button>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                    {this.state.rooms ? this.state.rooms.map((room) => {
                    return (
                        <Button variant="contained" key={"roomKey"+room._id} onClick={() => this.props.changeScreen("chatroom", room.name)}>
                            {room.name}
                        </Button>
                    )
                    }) : "loading..."}
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
