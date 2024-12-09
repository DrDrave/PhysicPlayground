"use client";

import "./PhysicsCanvas.css"
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SaveIcon from '@mui/icons-material/Save';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import CloudIcon from '@mui/icons-material/Cloud';
import TimelineIcon from '@mui/icons-material/Timeline';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import ReplayIcon from '@mui/icons-material/Replay';
import BuildIcon from '@mui/icons-material/Build';

const MenuTabLeft = (props: {PausePlay: () => void, saveCurrentState: () => void, loadSavedState: () => void, saveOnline: () => void, loadOnline: () => void, handleActiveAndvancedMenu: (advandedMenuName: string) => void}) => {


    //TODO: All Buttons currently use sx Styling and not specific classes
    return <div className="menu-select-left">
        {/* Pause/Play */}
        <div className="menu-item-left">
            <IconButton aria-label="pause-play" onClick={props.PausePlay}>
                <PlayArrowIcon className="icon" />
            </IconButton>
            <div className="menu-text">Play</div>
        </div>
        <div className="menu-divider"></div>
        {/* Save */}
        <div className="menu-item-left">
            <IconButton aria-label="save" onClick={props.saveCurrentState}>
                <SaveIcon className="icon" />
            </IconButton>
            <div className="menu-text">Save</div>
        </div>
        <div className="menu-divider"></div>
        {/*Load*/}
        <div className="menu-item-left">
            <IconButton aria-label="pause-play" onClick={props.loadSavedState}>
                <ReplayIcon className="icon" />
            </IconButton>
            <div className="menu-text">Load</div>
        </div>
        <div className="menu-divider"></div>
        {/*Save Online*/}
        <div className="menu-item-left">
            <IconButton aria-label="pause-play" onClick={props.saveOnline}>
                <UploadIcon className="icon" />
            </IconButton>
            <div className="menu-text">Save Online</div>
        </div>
        <div className="menu-divider"></div>
        {/*Load Online*/}
        <div className="menu-item-left">
            <IconButton aria-label="pause-play" onClick={props.loadOnline}>
                <DownloadIcon className="icon" />
            </IconButton>
            <div className="menu-text">Load Online</div>
        </div>
        <div className="menu-divider"></div>
        {/*Toolbox*/}
        <div className="menu-item-left">
            <IconButton aria-label="pause-play" onClick={() => props.handleActiveAndvancedMenu('Toolbox')}>
                <HomeRepairServiceIcon className="icon" />
            </IconButton>
            <div className="menu-text">Toolbox</div>
        </div>
        <div className="menu-divider"></div>
        {/*Anpassen*/}
        <div className="menu-item-left">
            <IconButton aria-label="pause-play" onClick={() => props.handleActiveAndvancedMenu('Inspector')}>
                <BuildIcon className="icon" />
            </IconButton>
            <div className="menu-text">Inspector</div>
        </div>
        <div className="menu-divider"></div>
        {/*Cloud*/}
        <div className="menu-item-left">
            <IconButton aria-label="pause-play" onClick={() => props.handleActiveAndvancedMenu('Cloud')}>
                <CloudIcon className="icon" />
            </IconButton>
            <div className="menu-text">Cloud</div>
        </div>
        <div className="menu-divider"></div>
        {/*Tracking*/}
        <div className="menu-item-left">
            <IconButton aria-label="pause-play" onClick={() => props.handleActiveAndvancedMenu('Tracking')}>
                <TimelineIcon className="icon" />
            </IconButton>
            <div className="menu-text">Tracking</div>
        </div>
        <div className="menu-divider"></div>
    </div>;
};

export default MenuTabLeft;