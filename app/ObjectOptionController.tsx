"use client";

// @ts-expect-error: TS with external library
import Matter from 'matter-js';
import { useState, useEffect } from 'react';

const ObjectOptionController = (props: { clickedObject: Matter.Body | null }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        // Funktion, um die Position des angeklickten Objekts zu aktualisieren
        const updatePosition = () => {
            if (props.clickedObject) {
                setPosition({
                    x: props.clickedObject.position.x,
                    y: props.clickedObject.position.y,
                });
            }
        };

        // Event-Loop mit Matter.js kontinuierlich synchronisieren
        const interval = setInterval(updatePosition, 1); // 60 FPS (16ms)
        return () => clearInterval(interval); // Cleanup bei unmount
    }, [props.clickedObject]);

    return (
        <div
            style={{
                position: 'absolute',
                left: `${position.x + 50}px`, // Rechts neben dem Objekt
                top: `${position.y}px`,
                background: 'lightblue',
                color: 'red',
                padding: '10px',
                border: '1px solid black',
            }}
        >
            Hello
        </div>
    );
};

export default ObjectOptionController;