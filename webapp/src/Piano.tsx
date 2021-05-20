import {FunctionComponent} from "react";
import "./Piano.css";

const PianoComponent: FunctionComponent<{ onClick: (key: string) => void, highlighted: [string, string][] }> = props => {

    const keys = [[0, 1], [0],
        [0, 1], [0, 1], [0], [0, 1], [0, 1], [0, 1], [0],
        [0, 1], [0, 1], [0], [0, 1], [0, 1], [0, 1], [0],
        [0, 1], [0, 1], [0], [0, 1], [0, 1], [0, 1], [0],
        [0, 1], [0, 1], [0], [0, 1], [0, 1], [0, 1], [0],
        [0, 1], [0, 1], [0], [0, 1], [0, 1], [0, 1], [0],
        [0, 1], [0, 1], [0], [0, 1], [0, 1], [0, 1], [0],
        [0, 1], [0, 1], [0], [0, 1], [0, 1], [0, 1], [0],
        [0]]

    const idxToKeyName = (idx: [number, number]): string => {
        const [combIdx, keyIdx] = idx
        if (combIdx < 2) {
            if (keyIdx === 0) {
                return `${['A', 'B'][combIdx]}0`
            }
            return `${['A', 'B'][combIdx]}0#`
        }
        const octave = Math.floor((combIdx - 2) / 7 + 1)
        const pitch = ['C', 'D', 'E', 'F', 'G', 'A', 'B'][(combIdx - 2) % 7]
        if (keyIdx === 0) {
            return `${pitch}${octave}`
        }
        return `${pitch}${octave}#`
    }

    return (
        <div className="Piano">
            {keys.map((keyComb, combIdx) => {
                return <div key={`comb${combIdx}`} className="KeyComb">
                    {keyComb.map((key, idx) => {
                        const keyName = idxToKeyName([combIdx, idx]);
                        let className: string;
                        let style = {};
                        if (key === 0) className = 'KeyWhite'
                        else className = 'KeyBlack'
                        props.highlighted.forEach(value => {
                            if (keyName === value[0]) {
                                style = {background: value[1]}
                            }
                        })
                        return <div onClick={() => {
                            props.onClick(keyName)
                        }} key={`key${combIdx}${idx}`} className={className}
                                    style={style}/>
                    })}
                </div>
            })}
        </div>
    )
}

export default PianoComponent;
