import react from "react";
import { Button, TextField } from "@mui/material";

class Form extends react.Component{
    constructor(props){
        super(props);
        // for each item in props.fields, create an item in this.state.fields
        let fields = [];
        for (let i = 0; i < props.fields.length; i++) {
            fields.push(["", props.fields[i]]);
        }
        this.state = {
            fields: fields,
        }
    }

    handleChange = (event, index) => {
        let fields = this.state.fields;
        fields[index][0] = event.target.value;
        this.setState({fields: fields});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let fields = this.state.fields;
        let data = {};
        for (let i = 0; i < fields.length; i++) {
            data[fields[i][1]] = fields[i][0];
        }
        this.props.submit(data);
    }

    render(){
        return (
            <div style={{backgroundColor: 'rgba(255, 255, 255, .3)', border: '1px solid white', padding: '10px'}}>
                <div>
                    <Button onClick={this.props.close}> x </Button>
                    <h3> {this.props.type} </h3>
                </div>

                <form onSubmit={this.handleSubmit}>
                    {this.state.fields.map((field, index) => {
                        return(
                            <div>
                                <TextField 
                                    variant="standard" 
                                    key={"auth"+field[1]} 
                                    label={field[1]} 
                                    onChange={(event) => this.handleChange(event, index)}
                                />
                            </div>
                        );
                    })}
                    <input type="submit" style={{marginLeft: '100px', marginTop: '-25px', position: 'absolute', padding: '5px'}}></input>
                </form>

            </div>
        );
    }
}

export default Form;