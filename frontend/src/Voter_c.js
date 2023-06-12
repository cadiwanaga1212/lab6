import React from "react";
import img1 from './images/like.jpg';
import img2 from './images/dislike.jpg';

function upVote(item) {
    item.state.score++;
    item.setState({ state: item.state });
}

function downVote(item) {
    item.state.score1++;
    item.setState({ state: item.state });
}

class VotersC extends React.Component{
    constructor() {
        super();
        this.state = {score: 0};
    }
    render(){
        
        return(
            <div>
                <button id = "upvotebutton"
                onClick={() => upVote(this)}
                > <img src = {img1} alt="" style={{ transform: 'scale(0.1) translateX(-10px)' }}/> </button>
                <div id="scoreStore">  {this.state.score}  </div>
                <button id = "downvotebutton"
                onClick={() => downVote(this)}> <img src = {img2} alt="" style={{ transform: 'scale(0.1) translateX(-10px)' }}/> </button>
                <div id="scoreStore1">  {this.state.score1}  </div>
            </div>
        )
    }
}

export default VotersC;