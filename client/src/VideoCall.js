import './App.css';
import io from 'socket.io-client';
import React, { useEffect, useRef, useState } from 'react';
import { Row } from 'reactstrap';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import CallEndIcon from '@mui/icons-material/CallEnd';

const socket = io('http://localhost:3001');

const VideoCall = () => {
    const userVideo = useRef();

    const [video, setVideo] = useState(false);
    const [audio, setAudio] = useState(false);
    const [askForUsername, setAskForUsername] = useState(true);
    const [username, setUsername] = useState("");

    useEffect(() => {
        getUserInitMedia();

        socket.on('message', (message) => {
            console.log("Received message from server:", message);
        });

        return () => {
            socket.off('message');
        };
    }, []);

    const getUserInitMedia = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                userVideo.current.srcObject = stream;
                setVideo(true);
                setAudio(true);
            })
            .catch(error => {
                setVideo(false);
                setAudio(false);
            });
    }

    const getUserMedia = () => {
        if ( video || audio )
        {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(stream => {
                    try {
                        window.localStream.getTracks().forEach(track => track.stop())
                    } catch(e) { console.log(e) }

                    window.localStream = stream
                    userVideo.current.srcObject = stream;
                })
                .catch(error => {
                });
        }
        else
        {
            // ToDo: get the permission
        }
    }

    const handleVideo = () => {
        setVideo(!video)
        getUserMedia();
    }

    const handleAudio = () => {
        setAudio(!audio)
        getUserMedia();
    }

    const handleEndCall = () => {
        try {
            let tracks = userVideo.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) {}
        window.location.href = "/"
    }

    const connect = () => {
        setAskForUsername(false);
        getUserMedia();
        socket.emit('join', username);
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
                        <Button variant="contained" color="primary" onClick={connect}
                                style={{margin: "20px"}}>Connect</Button>
                    </div>

                    <div style={{justifyContent: "center", textAlign: "center", paddingTop: "40px"}}>
                        <video id="my-video" ref={userVideo} autoPlay muted style={{
                            borderStyle: "solid", borderColor: "#bdbdbd", objectFit: "fill", width: "60%", height: "30%"
                        }}></video>
                    </div>
                </div>
                :
                <div>
                    <div className="btn-down"
                         style={{backgroundColor: "whitesmoke", color: "whitesmoke", textAlign: "center"}}>
                        <IconButton style={{color: "#424242"}} onClick={handleVideo}>
                            {(video === true) ? <VideocamIcon/> : <VideocamOffIcon/>}
                        </IconButton>

                        <IconButton style={{color: "#424242"}} onClick={handleAudio}>
                            {audio === true ? <MicIcon/> : <MicOffIcon/>}
                        </IconButton>

                        <IconButton style={{color: "#f44336"}} onClick={handleEndCall}>
                            <CallEndIcon/>
                        </IconButton>
                    </div>

                    <div className="container">
                        <Row id="main" className="flex-container" style={{margin: 0, padding: 0}}>
                            <video id="my-video" ref={userVideo} autoPlay muted style={{
                                borderStyle: "solid", borderColor: "#bdbdbd", margin: "10px", objectFit: "fill",
                                width: "100%", height: "100%"
                            }}></video>
                        </Row>
                    </div>
                </div>
            }
        </div>
    )
}

export default VideoCall;
