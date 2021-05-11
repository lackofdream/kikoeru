import * as React from "react";
import axios from "axios";

interface GameState {
    guess: string
    isResult: boolean
    timer: number
    audioURL: string
    timeLimit: number
}

export interface GameProps {
    target: number
    newGame: () => void
}

export default class Game extends React.Component<GameProps, GameState> {
    private inputRef = React.createRef<HTMLInputElement>();
    private audioRef = React.createRef<HTMLAudioElement>();

    constructor(props: GameProps) {
        super(props);
        this.state = {
            guess: "",
            isResult: false,
            timer: -1,
            audioURL: "",
            timeLimit: 5,
        }
    }

    componentDidMount() {
        this.reset()
        this.inputRef.current!.focus()
    }

    reset() {
        if (this.state.audioURL.length > 0) {
            URL.revokeObjectURL(this.state.audioURL)
        }
        this.setState({isResult: false, guess: "", timeLimit: 5})
        this.playVoice()
    }

    startCountDown = () => {
        const timer = window.setInterval(() => {
            this.setState({timeLimit: this.state.timeLimit - 1})
        }, 1000)
        this.setState({timer})
    }

    componentDidUpdate(prevProps: Readonly<GameProps>, prevState: Readonly<GameState>, snapshot?: any) {
        if (prevProps.target !== this.props.target) {
            this.reset()
        }
        if (prevState.timeLimit !== this.state.timeLimit && this.state.timeLimit === 0) {
            this.showResult()
        }
        if (prevState.isResult !== this.state.isResult && !this.state.isResult) {
            this.inputRef.current!.focus()
        }
    }

    guessToNumber(): number {
        if (this.state.guess.length > 0) {
            return parseInt(this.state.guess)
        }
        return -1
    }

    playVoice() {
        axios.post("http://localhost:1145/api/read",
            {"number": this.props.target}, {responseType: "blob"})
            .then(r => {
                const audioURL = URL.createObjectURL(r.data)
                this.setState({audioURL: audioURL})
                this.audioRef.current!.src = audioURL
                this.audioRef.current!.autoplay = true
            })
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
                    : <div>time left: {this.state.timeLimit}s</div>}
                <audio ref={this.audioRef} onEnded={this.startCountDown}/>
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
