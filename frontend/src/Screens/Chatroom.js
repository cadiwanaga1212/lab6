import React from "react";
import { Button, TextField, List, ListItem, ListItemText, Typography, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {io} from 'socket.io-client';
import VotersC from '../Voter_c.js';

class Chatroom extends React.Component{
    constructor(props){
        super(props);
        this.socket = io('http://localhost:3001');
        this.messagesEndRef = React.createRef();
        this.state = {
            messages: [], // for storing the chat messages
            messageInput: "", // for storing the current input message
            searchInput: "",
            loading: true,
        };
    }

    componentDidMount() {
        // Fetch messages from the server
        fetch(this.props.server_url + `/api/messages/${this.props.room}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }    
        }).then((res) => {
            res.json().then((data) => {
                this.setState({messages:[...data, ...this.state.messages], loading: false})
            });
        });

        this.socket.emit('join',{room: this.props.room,
                                 username: this.props.username})

        this.socket.on('message', message => {
            if(message.room === this.props.room){
            this.setState({ messages: [...this.state.messages, message.message] });
        }
        });
    }

    handleMessageChange = (event) => {
        this.setState({ messageInput: event.target.value });
    }

    // This function will be used to send the message
// This function will be used to send the message
handleMessageSend = () => {
    if (this.state.messageInput !== "") {
        const payload = {
            message:  this.props.username + ': ' + this.state.messageInput,
            username: this.props.username,
        };

        // Emit the message event to the server
        this.socket.emit('message', payload);

        this.setState({ messageInput: ""});
    }
}


    handleBackClick = () => {
        this.socket.emit('leave', {room: this.props.room, username: this.props.username});
        this.props.changeScreen("lobby");
    }

    scrollToBottom = () => {
        this.messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    
    componentDidUpdate() {
        this.scrollToBottom();
    }    

    handleSearchChange = (event) => {
        this.setState({ searchInput: event.target.value });
    }

    render(){

        if(this.state.loading) return <div>Loading...</div>

        const filteredMessages = this.state.messages.filter(message => 
            message.toLowerCase().includes(this.state.searchInput.toLowerCase())
        );

        return(
            <Box display="flex" flexDirection="column" height="100vh">
                <Box p={2}>
                    <TextField
                        fullWidth
                        variant="standard"
                        placeholder="Search messages"
                        value={this.state.searchInput}
                        onChange={this.handleSearchChange}
                    />
                </Box>
                <Box p={2} display="flex" justifyContent="center" alignItems="center">
                    <IconButton color="primary" aria-label="Go back" component="span" onClick={this.handleBackClick}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" component="div">
                        Current Room: {this.props.room}
                    </Typography>
                </Box>
                {/* Message display area */}
                <Box flexGrow={1} overflow="auto" p={2}>
                    <List>
                        {filteredMessages.map((message, index) => {
                            return (
                                <ListItem key={index}>
                                    <ListItemText primary={`${message}`} />
                                    <VotersC></VotersC>
                                </ListItem>
                            
                            )
                        })}
                        <div ref={this.messagesEndRef} />
                    </List>
                </Box>
                {/* Input field */}
                <Box p={2} borderTop={1} borderColor="divider" bgcolor="background.paper">
                    <TextField
                        fullWidth
                        variant="standard"
                        placeholder="Type a message"
                        value={this.state.messageInput}
                        onChange={this.handleMessageChange}
                        InputProps={{
                            endAdornment: (
                                <Button onClick={this.handleMessageSend}>
                                    Send
                                </Button>
                                
                            ),
                        }}
                        
                    />
                </Box>
            </Box>
        );
    }
}

export default Chatroom;
