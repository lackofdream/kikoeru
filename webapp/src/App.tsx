import React from 'react';
import './App.css';
import Game from './game';

interface State {
    target: number
    started: boolean
}

class App extends React.Component<Object, State> {
    constructor(props: Object) {
        super(props);
        this.state = {
            target: -1,
            started: false
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
            <div className="App">
                {this.state.started ?
                    <div className="GameContainer">
                        {this.state.target === -1 ? "" : <Game target={this.state.target} newGame={this.newGame}/>}
                    </div>
                    :
                    <button onClick={() => this.setState({started: true})}>Start</button>
                }
            </div>
        );
    }
}

export default App;
