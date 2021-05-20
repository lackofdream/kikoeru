import {createRef, FunctionComponent, useEffect, useState} from "react";
import "./Game.css";
import {GameType, GameTypeText} from "./App";
import PianoComponent from "./Piano";

export interface GameProps {
    description: string
    gameType: GameType
    selections?: string[]
    answer: string
    onAnswered: (result: boolean) => void
    onNext: () => void
}

const GameResult = (props: { gameType: GameType, answer: string, guess: string }): JSX.Element => {
    let resultDiv: JSX.Element | null
    switch (props.gameType) {
        case "kikoeru":
            resultDiv = <div>The answer is {props.answer}, your guess is {props.guess}</div>
            break
        case "pitch":
            resultDiv = <PianoComponent onClick={() => {
                return
            }} highlighted={[[props.guess, "red"], [props.answer, "green"]]}/>
            break
        default:
            resultDiv = null
    }

    return (<div className="GameResult">
        {props.guess === props.answer ?
            <img width="180px" src={process.env.PUBLIC_URL + '/seikai.svg'}/>
            :
            <div>
                <img src={process.env.PUBLIC_URL + '/error.png'} width="180px"/>
                {resultDiv}
            </div>
        }
    </div>)
}

const GameForm: FunctionComponent<{ gameType: GameType, value: string, onValueChange: (v: string) => void, onEnter: () => void }> = props => {
    switch (props.gameType) {
        case "kikoeru":
            return <GameInputForm value={props.value} onValueChange={props.onValueChange} onEnter={props.onEnter}/>
        case "pitch":
            return <GamePianoForm onSelect={props.onValueChange}/>
        default:
            return null
    }
}

const GamePianoForm: FunctionComponent<{ onSelect: (v: string) => void }> = props => {
    const [selected, updateSelected] = useState("")
    return (
        <div className="GameForm">
            <PianoComponent onClick={(key: string) => {
                updateSelected(key)
                props.onSelect(key)
            }} highlighted={[[selected, "blue"]]}/></div>
    )
}

const GameInputForm: FunctionComponent<{ value: string, onValueChange: (v: string) => void, onEnter: () => void }> = props => {
    const inputRef = createRef<HTMLInputElement>()

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    })

    return (<div className="GameForm">
        <input ref={inputRef} value={props.value} onChange={(e) => props.onValueChange(e.target.value)}
               onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                       props.onEnter()
                   }
               }}/>
    </div>)
}

const Game: FunctionComponent<GameProps> = props => {
    const [guess, updateGuess] = useState("")
    const [submitted, updateSubmitted] = useState(false)

    const submitRef = createRef<HTMLButtonElement>()

    const submit = () => {
        if (submitted) {
            updateGuess("")
            props.onNext()
        } else {
            props.onAnswered(props.answer === guess)
        }
        updateSubmitted((prevSubmitted => {
            return !prevSubmitted
        }))
    }

    useEffect(() => {
        if (submitted) {
            if (submitRef.current) {
                submitRef.current.focus()
            }
        }
    }, [submitted])


    return (
        <div className="Game">
            <div className="GameType">{GameTypeText[props.gameType]}</div>
            {submitted ?
                <GameResult gameType={props.gameType} answer={props.answer} guess={guess}/>
                :
                <div>
                    <div className="GameDesc">{props.description}</div>
                    <div className="GameContent">{props.children}</div>
                    <GameForm gameType={props.gameType} value={guess} onValueChange={updateGuess} onEnter={submit}/>
                </div>
            }
            <div className="GameSubmit">
                <button ref={submitRef} onClick={submit}>{submitted ? "下一题" : "检查答案"}</button>
            </div>
        </div>
    )
}

export default Game;
