import './App.css';
import io from 'socket.io-client';
import React, { useEffect, useRef, useState } from 'react';

import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';

const socket = io('http://localhost:3001');

const VideoCall = () => {
    const userVideo = useRef();

    const [video, setVideo] = useState(false);
    const [audio, setAudio] = useState(false);
    const [screen, setScreen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [screenAvailable, setScreenAvailable] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [newMessages, setNewMessages] = useState(0);
    const [askForUsername, setAskForUsername] = useState(true);
    const [username, setUsername] = useState("");
    const [videoAvailable, setVideoAvailable] = useState(false);
    const [audioAvailable, setAudioAvailable] = useState(false);

    useEffect(() => {
        getUserInitMedia();
    }, []);

    const getUserInitMedia = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(str => {
            userVideo.current.srcObject = str;
        });
    }

    const getPermissions = async () => {
        try{
            await navigator.mediaDevices.getUserMedia({ video: true })
                .then(() => setVideoAvailable(true))
                .catch(() => setVideoAvailable(false))

            await navigator.mediaDevices.getUserMedia({ audio: true })
                .then(() => setAudioAvailable(true))
                .catch(() => setAudioAvailable(false))

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable})
                    .then((stream) => {
                        window.localStream = stream
                    })
                    .catch((e) => console.log(e))
            }
        } catch(e) { console.log(e) }
    }

    const connect = () => {
        setAskForUsername(false);
    }

    return (

        <div>
            {askForUsername === true ?
                <div>
                    <div style={{
                        background: "white", width: "30%", height: "auto", padding: "20px", minWidth: "400px",
                        textAlign: "center", margin: "auto", marginTop: "50px", justifyContent: "center"
                    }}>
                        <p style={{margin: 0, fontWeight: "bold", paddingRight: "50px"}}>Set your username</p>
                        <Input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}/>
                        <Button variant="contained" color="primary" onClick={connect} style={{margin: "20px"}}>Connect</Button>
                    </div>

                    <div style={{justifyContent: "center", textAlign: "center", paddingTop: "40px"}}>
                        <video id="my-video" ref={userVideo} autoPlay muted style={{
                            borderStyle: "solid", borderColor: "#bdbdbd", objectFit: "fill", width: "60%", height: "30%"
                        }}></video>
                    </div>
                </div>
                :
                <div>
                    <button>Toggle Video</button>
                    <button>Toggle Audio</button>
                    <button>End Call</button>
                </div>
            }
        </div>
    )
}

export default VideoCall;
