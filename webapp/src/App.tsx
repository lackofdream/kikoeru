import axios from 'axios';
import React from 'react';
import './App.css';
import Game from './Game';

interface State {
    target: string
    started: boolean
    audioURL: string
}

class App extends React.Component<unknown, State> {
    constructor(props: unknown) {
        super(props);
        this.state = {
            target: "",
            started: false,
            audioURL: "",
        }
    }


    componentDidUpdate(prevProp: unknown, prevState: State): void {
        if (prevState.started !== this.state.started) {
            this.newGame()
        }
        if (this.state.started && prevState.target !== this.state.target) {
            void axios.post("http://localhost:1145/api/read", { "number": parseInt(this.state.target) }, { responseType: "blob" }).then((r) => {
                this.setState({ audioURL: URL.createObjectURL(r.data) })
            })
        }
    }

    newGame = (): void => {
        if (this.state.audioURL) {
            URL.revokeObjectURL(this.state.audioURL)
            this.setState({ audioURL: "" })
        }
        this.setState({ target: String(Math.floor(Math.random() * 100000)) })
    };


    render(): JSX.Element {
        return (
            <div className="App">
                {!this.state.started ?
                    <button className="AppStart" onClick={() => this.setState({ started: true })}>Start</button> :
                    <Game answer={String(this.state.target)} type="input" onAnswered={() => { this.newGame() }} audioURL={this.state.audioURL} />
                }
            </div>
        );
    }
}

export default App;
