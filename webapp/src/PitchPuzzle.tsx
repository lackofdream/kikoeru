import {Component} from "react";
import Vex from "vexflow";

export default class PitchPuzzle extends Component<{ target: string, targetClef: "treble" | "bass" }, unknown> {

    constructor(props: { target: string, targetClef: "treble" | "bass" }) {
        super(props);
    }

    componentDidMount(): void {
        const div = document.getElementById('vex')
        if (!div) return
        const renderer = new Vex.Flow.Renderer(div, Vex.Flow.Renderer.Backends.SVG)

        renderer.resize(120, 150)

        const context = renderer.getContext()

        const stave = new Vex.Flow.Stave(10, 20, 100)

        stave.addClef(this.props.targetClef)

        stave.setContext(context).draw()

        const key = this.props.target[0] + '/' + this.props.target[1]

        const notes = [
            new Vex.Flow.StaveNote({clef: this.props.targetClef, keys: [key], duration: "q"}),
        ]

        const voice = new Vex.Flow.Voice({num_beats: 1, beat_value: 4})
        voice.addTickables(notes)

        new Vex.Flow.Formatter().joinVoices([voice]).format([voice], 100)
        voice.draw(context, stave)
    }

    render(): JSX.Element {
        return (
            <div id="vex"/>
        )
    }
}
