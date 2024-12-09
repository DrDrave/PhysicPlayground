"use client";

import React from "react";
import "./AdvancedMenu.css"
import { Construction } from "@mui/icons-material";
// @ts-expect-error: TS with external library
import Matter from 'matter-js';
import Toolbox from "./Toolbox";

//TODO: Each Tab needs an close button
const AdvancedMenu = (props: { AdvancedMenuName: string, addBody: (body: Matter.Bodies) => void}) => {
  let content;
  switch (props.AdvancedMenuName) {
    case "Toolbox":
      content = <Toolbox addBody={props.addBody}/>;
      break;
    case "Cloud":
        content = <div className="construction-content">
                        <div className="construction-icon">
                            <Construction fontSize="large" />
                        </div>
                        <div className="construction-description">
                            Content specific to Cloud needs to be added. Planned for features like up and downloading scene.
                        </div>
                    </div>
      break;
    case "Tracking":
      content = <div className="construction-content">
                    <div className="construction-icon">
                        <Construction fontSize="large" />
                    </div>
                    <div className="construction-description">
                        Content specific to Tracking needs to be added. Planned for features like Graphs, Visualization.
                    </div>
                </div>
      break;
    default:
      content = <div>No content available</div>;
  }

  return (
    <div className="advanced-menu">
      <h2 className="advanced-menu-title">{props.AdvancedMenuName}</h2>
      <div className="advanced-menu-content">{content}</div>
    </div>
  );
};

export default AdvancedMenu;