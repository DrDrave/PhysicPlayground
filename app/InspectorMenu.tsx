"use client";
import ToggleButton from '@mui/material/ToggleButton';
// @ts-expect-error: TS with external library
import Matter from 'matter-js';
import { useEffect, useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import "./InspectorMenu.css"

const InspectorMenu = (props: {clickedObject: Matter.Body | null}) => {
    
    const [objectStatic, setObjectStatic] = useState(false);

    // Aktualisiere den Status von objectStatic, wenn das geklickte Objekt wechselt
    useEffect(() => {
      if (props.clickedObject) {
        setObjectStatic(props.clickedObject.isStatic);
      }
    }, [props.clickedObject]);

    
    const changeStatic = () => {
        if(props.clickedObject){
            setObjectStatic(!props.clickedObject.isStatic)
            Matter.Body.setStatic(props.clickedObject,!props.clickedObject.isStatic)
            const oldVertices = props.clickedObject.vertices
            console.log(oldVertices)
            // let newVertices = oldVertices
            // newVertices[0].x = newVertices[0].x + 1
            // console.log(newVertices)
            // Matter.Body.setVertices(props.clickedObject,newVertices)
        }
    }

    return <div className="properties-panel">
        {props.clickedObject ? 
            //Zeile für die isStatic-Eigenschaft
            <div className="properties-panel">
                <div className="property-row">
                    <div className="property-name">isStatic</div>
                    <div className="property-toggle">
                        <ToggleButton
                        value="check"
                        selected={objectStatic}
                        onChange={changeStatic}
                        >
                            <CheckIcon/>
                        </ToggleButton>
                    </div>
                </div>
                <div className="property-row">
                    <div className="property-name">Vertices</div>
                    <div className="property-toggle">
                        {props.clickedObject.vertices[0].x}
                        Der Shit wird noch komplizierter, da alles nur in Eckpunkten angegeben ist, die miteinander verknüpft sind. 
                        Bringt aber auch viele möglichkeiten.
                    </div>
                </div>
            </div>
            //Weitere Zeilen für zusätzliche Eigenschaften
            : <div> Wählen Sie ein Objekt aus, um die Eigenschaften anzupassen.  </div>}
        </div>;
};

export default InspectorMenu;