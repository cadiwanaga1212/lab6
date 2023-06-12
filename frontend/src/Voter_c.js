import React from "react";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

class VotersC extends React.Component {
    // It's a good practice to put all your state in one single state object
    state = {
        score: 0,
        score1: 0,
    };

    // These functions update the state of this component
    upVote = () => {
        this.setState(prevState => ({ score: prevState.score + 1 }));
    };

    downVote = () => {
        this.setState(prevState => ({ score1: prevState.score1 + 1 }));
    };

    render() {
        return (
            <div>
                {/* onClick calls the upVote function which updates the state */}
                <ThumbUpIcon id="upvotebutton" onClick={this.upVote}> 
                </ThumbUpIcon> {this.state.score}
                {/* onClick calls the downVote function which updates the state */}
                <ThumbDownIcon id="downvotebutton" onClick={this.downVote}> 
                </ThumbDownIcon>{this.state.score1}
            </div>
        )
    }
}

export default VotersC;
