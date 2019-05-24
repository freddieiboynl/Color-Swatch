import * as React from "react"
import {
    Frame,
    useCycle,
    addPropertyControls,
    ControlType,
    Color,
    Stack,
} from "framer"
import { hexToCMYK, brightnessByColor } from "./Utils"
const pant = require("nearest-pantone")

// TODO: add nice rgb label + toggle

export function Swatch(props) {
    function getFontColor() {
        return "#000"
    }

    const color = Color(props.color)
    const colorAlpha = color.a
    const hexColor = Color.toHex(color)
    const hexColorString = Color.toHexString(color)
    const rgbColorString = Color.toRgbString(color)
    let pantoneString = "Pantone Corollary Unavailable"
    if (pant.getClosestColor(hexColor) !== undefined) {
        const pantoneType = pant.getClosestColor(hexColor).pantone
        const pantoneName = pant.getClosestColor(hexColor).name
        pantoneString = `Pantone ${pantoneType}, ${pantoneName}`
    }

    return (
        <Stack center size={"100%"} gap={0}>
            <ColorBox
                color={color}
                colorString={hexColorString}
                colorAlpha={colorAlpha}
            />
            <ColorInfo
                displayOption={props.displayOption}
                parentWidth={props.width}
                hex={hexColorString.toUpperCase()}
                rgba={rgbColorString.toUpperCase()}
                cmyk={hexToCMYK(hexColor)}
                pantone={pantoneString}
            />
        </Stack>
    )
}

Swatch.defaultProps = {
    color: "#E23E24",
    fontSize: 40,
    displayOption: "hex",
}

addPropertyControls(Swatch, {
    color: {
        type: ControlType.Color,
        defaultValue: Swatch.defaultProps.color,
    },
    displayOption: {
        type: ControlType.Enum,
        defaultValue: "cmyk",
        options: ["hex", "rgba", "cmyk"],
        optionTitles: ["HEX", "RGBA", "CMYK"],
    },
})

function ColorBox({ color, colorString, colorAlpha }) {
    const alpha = Math.floor(colorAlpha * 100)
    return (
        <Stack
            alignment={"end"}
            width={"100%"}
            height={"60%"}
            background={color}
        >
            <Frame
                background={null}
                height={30}
                width={150}
                opacity={0.5}
                style={{
                    textAlign: "right",
                    marginTop: 10,
                    marginRight: 10,
                    fontSize: 16,
                    fontWeight: 800,
                    color:
                        brightnessByColor(colorString) > 127.5
                            ? "black"
                            : "white",
                }}
            >{`Alpha: ${alpha}%`}</Frame>
        </Stack>
    )
}

function ColorInfo({ displayOption, parentWidth, hex, rgba, cmyk, pantone }) {
    return (
        <Stack width={"100%"} height={"40%"} gap={0} background={"#F5F6FA"}>
            <SingleColorLabel label={hex} />
            <SingleColorLabel label={rgba} />
            <SingleColorLabel label={cmyk} />
            <SingleColorLabel label={pantone} />
        </Stack>
    )
}

function SingleColorLabel({ label }) {
    const [bg, setBg] = React.useState("rgba(255,255,255,0)")
    const [copyTitle, setCopyTitle] = React.useState("Copy")
    const css = `
        .SingleColorLabel:hover {
            cursor: pointer;
        }
    `
    function copyColor() {
        copyStringToClipboard(label)
        setBg("rgba(255,255,255,0)")
        setCopyTitle("Copied!")
        setTimeout(() => {
            setCopyTitle("Copy")
        }, 1000)
    }

    function copyStringToClipboard(str) {
        var el = document.createElement("textarea")
        el.value = str
        el.setAttribute("readonly", "")
        el.style = { position: "absolute", left: "-9999px" }
        document.body.appendChild(el)
        el.select()
        document.execCommand("copy")
        document.body.removeChild(el)
    }

    return (
        <>
            <style>{css}</style>
            <Stack
                onHoverStart={() => setBg("#eee")}
                onHoverEnd={() => setBg("rgba(255,255,255,0)")}
                onTapStart={() => setBg("#fff")}
                onTap={copyColor}
                backgroundColor={bg}
                className={"SingleColorLabel"}
                gap={0}
                alignment={"start"}
                direction={"horizontal"}
                width={"100%"}
                height={"25%"}
                style={{
                    borderBottom: "1px solid #ddd",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: 16,
                        fontWeight: 600,
                        height: "100%",
                        width: "80%",
                        paddingLeft: 20,
                    }}
                >
                    {label}
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        paddingRight: 20,
                        fontSize: 14,
                        fontWeight: 600,
                        height: "100%",
                        width: "20%",
                        color: "#999",
                    }}
                >
                    {copyTitle}
                </div>
            </Stack>
        </>
    )
}

// <Stack
//     center
//     background={props.color}
//     size={"100%"}
//     borderRadius={"100%"}
// >
//     <Stack
//         distribution={"center"}
//         background={null}
//         size={"100%"}
//         alignment={"center"}
//         style={{
//             fontSize:
//                 props.displayOption === "rgba" ||
//                 props.displayOption === "cmyk"
//                     ? props.width / 14
//                     : props.width / 6,
//             fontFamily: "sans-serif",
//             fontWeight: 600,
//             color:
//                 brightnessByColor(hexColorString) > 127.5
//                     ? "black"
//                     : "white",
//         }}
//     >
//         <p> {`${displayColor()}`}</p>
//     </Stack>
// </Stack>
