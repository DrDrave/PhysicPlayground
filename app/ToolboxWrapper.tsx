"use client";
import { useState } from "react";
// @ts-expect-error: TS with external library
import Matter from "matter-js";

const ToolboxWrapper = (props: { addBody: (body: Matter.Bodies) => void}) => {
    const [isToolboxOpen, setToolboxOpen] = useState(false);

    const addBody = (body: Matter.Bodies) => {
        if (props.addBody) {
            props.addBody(body)
        }
    }

    const addRectangle = () =>{
        const left = window.innerWidth;
        const top = window.innerHeight;
        const width = 50;
        const height = 50;

        // Erstelle ein neues Element und füge es der Szene hinzu
        const newBox = Matter.Bodies.rectangle(left / 2, top / 2, width, height, {
            restitution: 0.5,
        });
        addBody(newBox)
    }

    const addCircle = () =>{
        const left = window.innerWidth;
        const top = window.innerHeight;
        const radius = 50;

        // Erstelle ein neues Element und füge es der Szene hinzu
        const newBox = Matter.Bodies.circle(left / 2, top / 2, radius, {
            restitution: 0.5,
        });
        addBody(newBox)
    }

    return (
        <div style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}>
        {/* Button zum Öffnen/Schließen der Toolbox */}
        <button
            onClick={() => setToolboxOpen(!isToolboxOpen)}
            style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "5px",
            }}
        >
            {isToolboxOpen ? "Close Toolbox" : "Open Toolbox"}
        </button>

        {/* Toolbox */}
        {isToolboxOpen && (
            <div
            style={{
                marginTop: "10px",
                padding: "10px",
                background: "#ddd",
                border: "1px solid #aaa",
                borderRadius: "5px",
            }}
            >
            <button
                onClick={addRectangle}
                style={{
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
                borderRadius: "5px",
                }}
            >
                Rectangle
            </button>
            <button
                onClick={addCircle}
                style={{
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
                borderRadius: "5px",
                }}
            >
                Circle
            </button>
            </div>
        )}
        </div>
    );
};

export default ToolboxWrapper;