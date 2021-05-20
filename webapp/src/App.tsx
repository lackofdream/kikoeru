import axios from 'axios';
import {ChangeEvent, Component, FunctionComponent} from 'react';
import './App.css';
import Game from './Game';
import PitchPuzzle from "./PitchPuzzle";

export type GameType = "kikoeru" | "pitch";
export type GameTypeMap = { [key in GameType]: string; }
const GameTypeText: GameTypeMap = {
    kikoeru: "听写日语数字",
    pitch: "看谱识音",
}
const GameTypeDescription: GameTypeMap = {
    kikoeru: "将听到的数字填入下框",
    pitch: "识别五线谱上标记的音高",
}
export {GameTypeText, GameTypeDescription};

interface State {
    allowedTypes: { [key in GameType]: boolean }
    target: string
    started: boolean
    audioURL: string
    currentPuzzleType: GameType
    totalCount: number
    correctCount: number
    targetClef: "treble" | "bass"
}

const KikoeruPuzzle: FunctionComponent<{ audioUrl: string }> = props => {
    return (
        <div>
            {props.audioUrl.length > 0 ?
                <audio controls autoPlay src={props.audioUrl}/> : "Loading..."}
        </div>
    )
}

const PuzzleBody: FunctionComponent<{ currentPuzzleType: GameType, audioUrl: string, target: string, targetClef: "treble" | "bass" }> = props => {
    switch (props.currentPuzzleType) {
        case "kikoeru":
            return <KikoeruPuzzle audioUrl={props.audioUrl}/>
        case "pitch":
            return <PitchPuzzle target={props.target} targetClef={props.targetClef}/>
        default:
            return null
    }
}

const StartPage: FunctionComponent<{ started: boolean, allowedTypes: { [key in GameType]: boolean }, onAllowChanged: (e: ChangeEvent<HTMLInputElement>) => void, onStart: () => void }> = props => {

    if (props.started) {
        return null
    }
    return (
        <div>

            {Object.keys(GameTypeText).map((text) => (
                <div key={text}>
                    <label>
                        <input name={text} type="checkbox" checked={props.allowedTypes[text as GameType]}
                               onChange={props.onAllowChanged}/>{GameTypeText[text as GameType]}
                    </label>
                </div>
            ))}
            <button
                disabled={!Object.keys(props.allowedTypes).map(x => props.allowedTypes[x as GameType]).reduce((previousValue, currentValue) => previousValue || currentValue)}
                className="AppStart"
                onClick={props.onStart}>Start
            </button>
        </div>
    )
}

class App extends Component<unknown, State> {
    constructor(props: unknown) {
        super(props);
        this.state = {
            allowedTypes: {
                pitch: false,
                kikoeru: false,
            },
            target: "",
            started: false,
            audioURL: "",
            currentPuzzleType: "kikoeru",
            correctCount: 0,
            totalCount: 0,
            targetClef: "treble",
        }
    }

    rollGameType = (): GameType => {
        const items: GameType[] = Object.keys(this.state.allowedTypes).filter(x => this.state.allowedTypes[x as GameType]) as GameType[]
        return items[Math.floor(Math.random() * items.length)]
    }

    rollPitch = (): string[] => {
        const clefList = ["treble", "bass"]
        const clef = clefList[Math.floor(Math.random() * clefList.length)]
        let pitchList: string[], octaveList: number[];
        if (clef === "treble") {
            pitchList = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
            octaveList = [3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6]
        } else {
            pitchList = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
            octaveList = [1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4]
        }
        const pitch = pitchList[Math.floor(Math.random() * pitchList.length)]
        const octave = octaveList[Math.floor(Math.random() * octaveList.length)]
        return [clef, `${pitch}${octave}`]
    }

    componentDidUpdate(prevProp: unknown, prevState: State): void {
        if (prevState.started !== this.state.started) {
            this.newGame()
        }
        if (this.state.started && this.state.currentPuzzleType === "kikoeru" && prevState.target !== this.state.target) {
            void axios.post("http://localhost:1145/api/read", {"number": parseInt(this.state.target)}, {responseType: "blob"}).then((r) => {
                this.setState({audioURL: URL.createObjectURL(r.data)})
            })
        }
    }

    newGame = (): void => {
        // clean previous resource
        if (this.state.audioURL) {
            URL.revokeObjectURL(this.state.audioURL)
            this.setState({audioURL: ""})
        }
        // new game
        const gameType = this.rollGameType()
        let pt, ptc;
        switch (gameType) {
            case "kikoeru":
                this.setState({currentPuzzleType: "kikoeru", target: String(Math.floor(Math.random() * 100000))})
                break
            case "pitch":
                [ptc, pt] = this.rollPitch()
                this.setState({currentPuzzleType: "pitch", target: pt, targetClef: ptc as "treble" | "bass"})
        }
    };

    start = (): void => {
        this.setState({started: true})
    }

    handleAllowChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const target = e.target.name as GameType
        this.setState(prev => {
            const state = {allowedTypes: {...prev.allowedTypes}}
            state.allowedTypes[target] = e.target.checked
            return state
        })
    }

    render(): JSX.Element {
        return (
            <div className="App">
                <StartPage allowedTypes={this.state.allowedTypes}
                           onAllowChanged={this.handleAllowChange}
                           onStart={this.start} started={this.state.started}/>
                {this.state.started &&
                <Game description={GameTypeDescription[this.state.currentPuzzleType]} answer={String(this.state.target)}
                      gameType={this.state.currentPuzzleType}
                      onAnswered={(res: boolean) => {
                          this.setState(prev => {
                              return {totalCount: prev.totalCount + 1}
                          })
                          res && this.setState(prev => {
                              return {correctCount: prev.correctCount + 1}
                          })

                      }}
                      onNext={() => this.newGame()}>
                    <PuzzleBody target={this.state.target} currentPuzzleType={this.state.currentPuzzleType}
                                audioUrl={this.state.audioURL}
                                targetClef={this.state.targetClef}/>
                </Game>}
            </div>
        );
    }

}

export default App;
