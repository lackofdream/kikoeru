import React from 'react';
import './App.css';
import Game from './game';

interface State {
    target: number
}

class App extends React.Component<Object, State> {
    constructor(props: Object) {
        super(props);
        this.state = {
            target: -1
        }
    }

    componentDidMount() {
        this.newGame()
    }

    newGame = () => {
        this.setState({target: Math.floor(Math.random() * 100000)})
    };


    render() {
        return (
            <div className="GameContainer">
                {this.state.target === -1 ? "" : <Game target={this.state.target} newGame={this.newGame}/>}
            </div>
        );
    }
}


export default App;
