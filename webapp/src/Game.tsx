import { createRef, useEffect, useState } from "react";
import "./Game.css";

export interface GameProps {
    type: "input" | "selection"
    audioURL?: string
    selections?: string[]
    answer: string
    onAnswered: (result: boolean) => void
}

export default function Game(props: GameProps): JSX.Element {
    const [guess, updateGuess] = useState("")
    const [submitted, updateSubmitted] = useState(false)

    const inputRef = createRef<HTMLInputElement>()
    const nextbuttonRef = createRef<HTMLButtonElement>()

    const puzzleTypeText = {
        "input": "问答题",
        "selection": "选择题",
    }

    const formClassName = {
        "input": "GameInput",
        "selection": "GameSelect",
    }


    const submit = () => {
        updateSubmitted(true)
    }

    const reset = () => {
        updateGuess("")
        updateSubmitted(false)
    }

    useEffect(() => {
        if (submitted && nextbuttonRef.current) {
            nextbuttonRef.current.focus()
            return
        }
        if (!submitted && inputRef.current) {
            inputRef.current.focus()
            return
        }
    }, [submitted])

    return (
        <div className="Game">
            {submitted ?
                <div>
                    <div className="GameResult">
                        {guess === props.answer ?
                            <div className="GameResultIcon"><img width="180px" src={process.env.PUBLIC_URL + '/seikai.svg'}></img></div>
                            :
                            <div><img src={process.env.PUBLIC_URL + '/error.png'} width="180px" />
                                <div>The answer is {props.answer}, your guess is {guess}</div></div>
                        }
                    </div>
                    <div className="GameSubmit">
                        <button ref={nextbuttonRef} onClick={() => {
                            props.onAnswered(guess === props.answer)
                            reset()
                        }}>下一题</button>
                    </div>
                </div>
                :
                <div>
                    <div className="GameType">{puzzleTypeText[props.type]}</div>
                    <div className="GameDesc">将听到的数字填入下框</div>
                    {props.audioURL !== undefined ?
                        props.audioURL === "" ? <div className="GameAudio">
                            Loading...
            </div> :
                            <div className="GameAudio">
                                <audio src={props.audioURL} controls autoPlay />
                            </div> : ""}
                    <div className={formClassName[props.type]}>
                        <input ref={inputRef} value={guess} onChange={(e) => updateGuess(e.target.value)} onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                submit()
                            }
                        }} />
                    </div>
                    <div className="GameSubmit">
                        <button onClick={submit}>检查答案</button>
                    </div>
                </div>
            }
        </div>
    )
}
