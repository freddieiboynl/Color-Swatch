import * as React from "react"
import {
    Frame,
    useCycle,
    addPropertyControls,
    ControlType,
    Color,
    Stack,
} from "framer"
import { KolorWheel } from "./kolorwheel"
import { Swatch } from "./Swatch"

export function GradientSwatch({ children, steps }) {
    console.log(
        "Color Swatch Package: Hey! The GradientSwatch component does not currently work with Shared Colors. This component is a quick test."
    )

    function createGradient() {
        const child1Color = children[0].props.children[0].props.color
        const child2Color = children[1].props.children[0].props.color
        const c1 = Color(child1Color)
        const c2 = Color(child2Color)

        const base = new KolorWheel(Color.toHexString(c1))
        const target = base.abs(Color.toHexString(c2), steps)

        const colorGradientSwatch = []
        for (let n = 0; n < steps; n++) {
            colorGradientSwatch.push(
                <Swatch
                    width={340}
                    // height={"100%"}
                    // borderRadius={"50%"}
                    // x={350 * n}
                    key={n}
                    color={target.get(n).getHex()}
                />
            )
        }
        return colorGradientSwatch
    }

    return (
        <>
            {children.length < 2 ? (
                <Stack
                    alignment={"center"}
                    distribution={"center"}
                    background={"salmon"}
                    size={"100%"}
                >
                    <h1 style={{ color: "white" }}>
                        {`Connect ${2 - children.length} ${
                            children.length === 1 ? "more" : ""
                        } color ${
                            children.length === 1 ? "swatch" : "swatches"
                        } to this ->`}
                    </h1>
                </Stack>
            ) : (
                <Stack
                    width={"100%"}
                    height={"100%"}
                    // alignment={"start"}
                    // distribution={"space-evenly"}
                    direction={"horizontal"}
                >
                    {createGradient()}
                </Stack>
            )}
        </>
    )
}

GradientSwatch.defaultProps = {
    color1: "#000",
    color2: "#fff",
    steps: 3,
}

addPropertyControls(GradientSwatch, {
    children: {
        type: ControlType.Array,
        propertyControl: {
            type: ControlType.ComponentInstance,
        },
    },
    steps: {
        type: ControlType.Number,
        defaultValue: 3,
        min: 1,
        max: 20,
        step: 1,
        displayStepper: true,
    },
})
