"use client";
// @ts-expect-error: TS with external library
import Matter from 'matter-js';

const Toolbox = (props: {addBody: (body: Matter.Bodies) => void}) => {

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

    return <div style={{display: 'flex', width: '100%' ,justifyContent: 'space-between'}} >
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
        </div>;
};

export default Toolbox;