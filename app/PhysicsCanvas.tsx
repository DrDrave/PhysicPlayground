"use client";

import { useEffect, useRef, useState } from 'react';
// @ts-expect-error: TS with external library
import Matter from 'matter-js';
import ToolboxWrapper from './ToolboxWrapper';
// @ts-expect-error: TS with external library
import _ from 'lodash';
import { parse, stringify } from 'flatted';

//TODO:
//Verändern der Parameter in der Simulation
//Wände erzeugen und Verschieben
//Objekte dort erzeugen wo die Maus ist
//Objekte außerhalb des Bildschirms löschen
//Aktuell unklar was genau composites und constraints sind

//Notizen
//Beim Laden und Speichern werden Constraints aktuell nicht berrücksichtig, aber ich verstehe deren Auswirkung auch nicht

//Infos for the Docs
/*Body:
* einzelne Körper können Geschwindigkeit, Kraft oder auch schlafen gelegt werden
*/

const PhysicsCanvas = () => {
    const sceneRef = useRef(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const runnerRef = useRef<Matter.Runner | null>(null);
    const renderRef = useRef<Matter.Renderer | null>(null);
    
    // SEHR UNSICHER OB DAS DER RICHTIG WEG IST DAS OBJEKT NEBEN DEM GEKLICKTEN OBJECT DARZUSTELLEN!!!
    // State, um ein neues Klickereignis auszulösen
    const clickedBodyRef = useRef<Matter.Body | null>(null);
    const [clickedObject, setClickedObject] = useState<Matter.Body | null>(null);
    
    //currently unsure how bodies, composites and constraintes interact
    let bodiesSaveState: Matter.Body[] = []
    let compositesSaveState: Matter.Composite[] = []
    //let constraintsSaveState: any[] = []


    //Funktionen die die API testen
    const fetchData = async () => {
        const response = await fetch('/api/supaBaseTest');
        const savedState = await response.json();
        const savedStateParsed = parse(savedState[0].scene)
        if (savedStateParsed) {
            // savedStateParsed die Bodies und Composites aus dem gespeicherten Zustand
            bodiesSaveState = savedStateParsed.bodies || [];
            compositesSaveState = savedStateParsed.composites || [];
    
            console.log('Bodies restored:', bodiesSaveState);
            console.log('Composites restored:', compositesSaveState);

            loadSavedState();
        } else {
            console.log('No saved state to restore.');
        }
    };

    const serializeSceneState = () => {
        const serializedState = stringify({
            bodies: bodiesSaveState,
            composites: compositesSaveState,
        });
        return serializedState
    };

    const postData = async () => {
        const saveStateJson = serializeSceneState()
        const response = await fetch('/api/supaBaseTest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ scene: saveStateJson }),
        });
        console.log(await response.json());
    };
    
    const saveOnline = () => {
        postData();
    }

    const loadOnline = () => {
        fetchData();
    }

    useEffect(() => {
        // Matter.js Setup
        const Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner;

        const engine = Engine.create();
        const render = Render.create({
        element: sceneRef.current,
        engine: engine,
        options: {
            width: innerWidth,
            height: innerHeight,
            wireframes: false, // Set to true for debugging
        },
        });
        
        // run the renderer
        Render.run(render);

        // create runner
        const runner = Runner.create();
        
        // run the engine
        Runner.run(runner, engine);

        //Is that the correct way?
        engineRef.current = engine;
        runnerRef.current = runner;
        renderRef.current = render

        // add mouse control
        addMouseControl();

        // Erstellt Erste Objekte in der Welt
        initializeObjectsInWorld();

        // Cleanup on component unmount
        return () => {
        Matter.Render.stop(render);
        Matter.Engine.clear(engine);
        render.canvas.remove();
        };
    }, []);

    const initializeObjectsInWorld = () => {
        // create two boxes and a ground
        const boxA = Matter.Bodies.rectangle(300, 150, 80, 80);
        const boxB = Matter.Bodies.rectangle(500, 50, 80, 80);
        const groundA = Matter.Bodies.rectangle(400, 250, 800, 20, { isStatic: true, angle: Math.PI / 8});
        const groundB = Matter.Bodies.rectangle(800, 700, 810, 20, { isStatic: true, angle: -Math.PI / 8 });
        const groundC = Matter.Bodies.rectangle(400, 1000, 810, 20, { isStatic: true, angle: Math.PI / 8 });
        const groundD = Matter.Bodies.rectangle(1200, 1300, 2400, 20, { isStatic: true});
        const bodiesTest = [boxA,boxB,groundA,groundB,groundC,groundD]

        // add all of the bodies to the world
        Matter.Composite.add(engineRef.current.world, bodiesTest);

        //addExampleChain to the System
        addChain()
    }

    const addChain = () => {
        // Schritt 1: Rechtecke als Kettenglieder erstellen
        const chain = Matter.Composites.stack(1000, 200, 10, 1, 10, 10, (x: number, y: number) => {
            return Matter.Bodies.rectangle(x, y, 50, 20, { density: 0.01 });
        });

        // Schritt 2: Rechtecke mit Constraints verbinden
        Matter.Composites.chain(chain, 0.5, 0, -0.5, 0, {
            stiffness: 0.8,
            length: 5,
            render: {
                visible: true
            }
        });

        // Schritt 3: Kette an einem fixen Punkt verankern
        const firstBody = chain.bodies[0];
        const anchor = { x: 1000, y: 100 }; // Startpunkt der Kette
        Matter.Composite.add(chain, Matter.Constraint.create({
            pointA: anchor,
            bodyB: firstBody,
            pointB: { x: 0, y: 0 },
            stiffness: 1,
            render: {
                visible: true
            }
        }));

        // Kette zur Welt hinzufügen
        Matter.Composite.add(engineRef.current.world, chain);
    }

    // Contains all Function for the Mouse - That are: 
    // Controlling objects with the mouse
    // On Click open menu next to the object
    const addMouseControl = () => {
        const render = renderRef.current; // Zugriff auf das Render-Objekt
        const engine = engineRef.current;
    
        // Maussteuerung hinzufügen
        const mouse = Matter.Mouse.create(render.canvas);
        const mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.8,
                render: {
                    visible: true
                }
            }
        });
    
        // Maussteuerung zur Welt hinzufügen
        Matter.Composite.add(engine.world, mouseConstraint);

        // Klickereignis überwachen
        Matter.Events.on(mouseConstraint, 'mousedown', (event: { mouse: { position: Matter.Vector; }; }) => {
            const mousePosition = event.mouse.position;

            // Finde den Körper, der unter der Maus liegt
            const clickedBody = Matter.Query.point(
                Matter.Composite.allBodies(engineRef.current!.world),
                mousePosition
            )[0];

            // Setzt den State mit dem geclickten Objekt gleich
            if (clickedBody) {
                clickedBodyRef.current = clickedBody;
                setClickedObject(clickedBody); // Setze den State, um das ObjectOptionController zu aktualisieren
                console.log(clickedObject)
            }
        });
        
        // Mouse-Daten mit dem Renderer verknüpfen
        render.mouse = mouse;
    };

    //Function to add body to the scene
    const addBody = (body: Matter.Body) => {
        if (engineRef.current) {
          Matter.World.add(engineRef.current.world, body);
        }
    };

    const saveCurrentState = () => {
        if (engineRef.current) {
            bodiesSaveState = _.cloneDeep(Matter.Composite.allBodies(engineRef.current.world));
            compositesSaveState = _.cloneDeep(Matter.Composite.allComposites(engineRef.current.world));
            //constraintsSaveState = _.cloneDeep(Matter.Composite.allConstraints(engineRef.current.world));

            // In compositesSaveState können bodies gespeichert sein die auch in bodiesSaveState sind, dort müssen duplikate entfernt werden
            // IDs aller Körper in den Composites sammeln
            const compositeBodies = new Set(
                compositesSaveState.flatMap(composite => composite.bodies.map((body: { id: number; }) => body.id))
            );

            // Nur die Körper behalten, die nicht in einem Composite sind
            bodiesSaveState = bodiesSaveState.filter(body => !compositeBodies.has(body.id));
        }
    }

    const loadSavedState = () => {
        if(engineRef.current && (bodiesSaveState.length > 0 || compositesSaveState.length > 0)){
            // Welt leeren
            Matter.Composite.clear(engineRef.current.world, false);

            // Engine einmal aktualisieren, um die Kollisionserkennung zu stabilisieren
            Matter.Engine.update(engineRef.current, 0);

            // Gespeicherte Objekte hinzufügen
            Matter.Composite.add(engineRef.current.world, bodiesSaveState);
            Matter.Composite.add(engineRef.current.world, compositesSaveState);
            //Matter.Composite.add(engineRef.current.world, constraintsSaveState);
            
            // Maussteuerung neu hinzufügen
            addMouseControl();

            // Zustand speichern
            saveCurrentState();
        }
    }

    //Puts the whole enginge into sleep mode.
    //Objects cant be moved if paused. Is pretty complicated, how should velocities be handeld.
    const PausePlay = () => {
        console.log(clickedBodyRef.current)
        if(runnerRef.current){
            runnerRef.current.enabled = !runnerRef.current.enabled
        }
    }

    return <div>
            {/*Pause/Play*/}
            <button
                onClick={PausePlay}
                style={{
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
                borderRadius: "5px",
                position: 'absolute', left: '20px', top: '20px'
                }}
            >
                Pause/Play
            </button>
            {/*Save*/}
            <button
                onClick={saveCurrentState}
                style={{
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
                borderRadius: "5px",
                position: 'absolute', left: '200px', top: '20px'
                }}
            >
                Save
            </button>
            {/*Load*/}
            <button
                onClick={loadSavedState}
                style={{
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
                borderRadius: "5px",
                position: 'absolute', left: '300px', top: '20px'
                }}
            >
                Load
            </button>
            <button
                onClick={saveOnline}
                style={{
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
                borderRadius: "5px",
                position: 'absolute', left: '650px', top: '20px'
                }}
            >
                Save Online
            </button>

            <button
                onClick={loadOnline}
                style={{
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
                borderRadius: "5px",
                position: 'absolute', left: '800px', top: '20px'
                }}
            >
                Load Online
            </button>
            {/*Option menu next to the clicked Object*/}
            {/*{clickedObject && <ObjectOptionController clickedObject={clickedObject} />}*/}
            <div ref={sceneRef}></div>    
            <ToolboxWrapper addBody={addBody}/>
        </div>;
};

export default PhysicsCanvas;