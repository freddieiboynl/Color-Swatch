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
import { GradientSwatch } from "./GradientSwatch"

export function Swatch(props) {
    let mainColorToWorkWith = props.color
    const allColorRegex = /(#([\da-f]{3}){1,2}|(rgb|hsl)a\((\d{1,3}%?,\s?){3}(1|0?\.\d+)\)|(rgb|hsl)\(\d{1,3}%?(,\s?\d{1,3}%?){2}\))/g

    if (props.color.includes("var")) {
        const extractedVarColor = allColorRegex.exec(props.color)
        mainColorToWorkWith = extractedVarColor[0]
    }

    // console.log(mainColorToWorkWith)

    const color = Color(mainColorToWorkWith)
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
        <>
            <Stack
                mainColor={mainColorToWorkWith}
                center
                x={props.x}
                height={"100%"}
                width={props.width}
                gap={0}
            >
                <ColorBox
                    color={props.color}
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
        </>
    )
}

// if (props.goToColor !== undefined) {
//     if (props.goToColor.length > 0) {
//         return (
//             <GradientSwatch
//                 color1={mainColorToWorkWith}
//                 color2={"#000"}
//                 steps={3}
//             />
//         )
//     } else {
//         return (
//             <>
//                 <Stack
//                     center
//                     x={props.x}
//                     height={"100%"}
//                     width={props.width}
//                     gap={0}
//                 >
//                     <ColorBox
//                         color={props.color}
//                         colorString={hexColorString}
//                         colorAlpha={colorAlpha}
//                     />
//                     <ColorInfo
//                         displayOption={props.displayOption}
//                         parentWidth={props.width}
//                         hex={hexColorString.toUpperCase()}
//                         rgba={rgbColorString.toUpperCase()}
//                         cmyk={hexToCMYK(hexColor)}
//                         pantone={pantoneString}
//                     />
//                 </Stack>
//             </>
//         )
//     }
// }

// {props.goToColor.length > 0 ? (
//     <GradientSwatch children={props.goToColor} steps={3} />
// ) : (

Swatch.defaultProps = {
    height: 500,
    width: 340,
    color: "#E23E24",
    fontSize: 40,
    displayOption: "hex",
}

addPropertyControls(Swatch, {
    color: {
        type: ControlType.Color,
        defaultValue: Swatch.defaultProps.color,
    },
    // goToColor: {
    //     type: ControlType.ComponentInstance,
    // },
})

function ColorBox({ color, colorString, colorAlpha }) {
    const alpha = Math.floor(colorAlpha * 100)

    function getColorTokenName(token) {
        const myre = /\/\*.*?\*\//g
        const parsed = myre.exec(token)
        const parsed1 = parsed[0].replace(/\*\//g, "")
        const parsed2 = parsed1.replace(/\/\*/g, "")
        const parsedObject = JSON.parse(parsed2)
        const parsedName = parsedObject.name

        return parsedName
    }

    return (
        <Stack
            alignment={"end"}
            direction={"vertical"}
            width={"100%"}
            height={"60%"}
            background={color}
            distribution={"start"}
        >
            <Frame
                background={null}
                height={20}
                width={"100%"}
                opacity={0.6}
                style={{
                    textAlign: "right",
                    marginTop: 10,
                    fontSize: 16,
                    fontWeight: 800,
                    color:
                        brightnessByColor(colorString) > 127.5
                            ? "black"
                            : "white",
                }}
            >
                <p
                    style={{ margin: 0, paddingRight: 20 }}
                >{`Alpha: ${alpha}%`}</p>
            </Frame>
            {color.includes("name") ? (
                <Frame
                    background={null}
                    height={20}
                    width={"100%"}
                    opacity={0.6}
                    style={{
                        textAlign: "right",
                        marginTop: 10,
                        fontSize: 16,
                        fontWeight: 800,
                        color:
                            brightnessByColor(colorString) > 127.5
                                ? "black"
                                : "white",
                    }}
                >
                    <p
                        style={{ margin: 0, paddingRight: 20 }}
                    >{`Token: ${getColorTokenName(color)}`}</p>
                </Frame>
            ) : null}
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
