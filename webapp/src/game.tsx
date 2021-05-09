import * as React from "react";
import axios, {AxiosResponse} from "axios";

interface GameState {
    guess: string
    isResult: boolean
    timer: number
}

export interface GameProps {
    target: number
    newGame: () => void
}


export default class Game extends React.Component<GameProps, GameState> {
    private inputRef = React.createRef<HTMLInputElement>();

    constructor(props: GameProps) {
        super(props);
        this.state = {
            guess: "",
            isResult: false,
            timer: -1,
        }
    }

    componentDidMount() {
        this.reset()
    }

    reset() {
        this.setState({isResult: false, guess: ""})
        this.playVoice().then(() => {
            const timer = window.setTimeout(() => {
                this.showResult()
            }, 5000)
            this.setState({timer})
            this.inputRef.current!.focus()
        })
    }

    componentDidUpdate(prevProps: Readonly<GameProps>, prevState: Readonly<GameState>, snapshot?: any) {
        if (prevProps.target !== this.props.target) {
            this.reset()
        }
    }

    guessToNumber(): number {
        if (this.state.guess.length > 0) {
            return parseInt(this.state.guess)
        }
        return -1
    }

    playVoice(): Promise<AxiosResponse> {
        return axios.post("http://localhost:1145/api/read", {"number": this.props.target})
    }

    showResult() {
        this.setState({isResult: true})
        if (this.state.timer !== -1) window.clearTimeout(this.state.timer)
        window.setTimeout(() => {
            this.props.newGame()
        }, 2000)
    }

    render() {
        return (
            <div>
                {this.state.isResult ?
                    <div>{this.props.target === this.guessToNumber() ? "OK"
                        : `Wrong, the answer is ${this.props.target}, your guess is ${this.state.guess}`}</div>
                    : ""}
                <input ref={this.inputRef} disabled={this.state.isResult} pattern="[0-9]*" onKeyDown={(event) => {
                    if (event.key !== 'Enter') return;
                    this.showResult();
                }} value={this.state.guess} onChange={(e) => {
                    this.setState({guess: e.target.value})
                }}/>
            </div>
        )
    }

}
