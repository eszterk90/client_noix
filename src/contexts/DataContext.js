import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import baseUrl from "../config";
import {useNavigate} from 'react-router-dom'
import DesignContext from "../contexts/DesignContext";
import UserContext from "../contexts/UserContext";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { notification, addNewNotification, closeModal, setWaitingAnimation  } = useContext(DesignContext);
  const { currentUser, setCurrentUser, setProfile, profile, mySongs, setMySongs, usersForSearch, users, setUsers, getNearbyUsers} = useContext(UserContext)

  const API = axios.create({ baseUrl: baseUrl });

  let navigate = useNavigate();

  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [displaySearch, setDisplaySearch] = useState(false);
  const [idList, setIdList] = useState([]);
  
  // const [formData, setFormData] = useState({})


  const likeSongs = (index) => {
    const songToLike = profile.music[index]
    
    console.log('songtolike', songToLike)
    API.patch(`${baseUrl}/user/likesong`, songToLike, {withCredentials: true})
    .then(response => {
      setCurrentUser(response.data.data);
    })
  }

  const dislikeSongs = (index) => {
    const songToDislike = currentUser.liked_songs[index]

    API.patch(`${baseUrl}/user/dislike`, songToDislike, {withCredentials: true})
    .then(response => {
      setCurrentUser(response.data.data)
      setProfile(response.data.data)
    })
  }
 
  const submitForm = (e) => {
    e.preventDefault();
    const formData = new FormData();
    // formData.title =  fileName;
    // formData.file = selectedFile;
    if(formData !== {}){
      formData.append("title", fileName);
      formData.append("file", selectedFile);
    } else {
      // console.log('form is empty')
      addNewNotification({title: 'Please, fill out the form', type: 'error'})
    }

    // setFormData({...formData, title: fileName, file: selectedFile})
    // console.log("onsubmit", formData);
    setWaitingAnimation(true)
    API.post(`${baseUrl}/music/upload`, formData, {
      withCredentials: true,
      "Content-Type": "multipart/form-data",
      "image_metadata": true
    }).then((response) => {
      closeModal();
      setWaitingAnimation(false)
      if(response.data.result){
        setCurrentUser(response.data.result)
        setProfile(response.data.result)
        setMySongs(response.data.result.music)
      }
      addNewNotification(response.data.notification);
    }).catch(err => {
      addNewNotification({title: 'Ups, something went wrong.', type: 'error'})
    
    });
  };

  const submitPicture = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append('title', e.target.value)
    // console.log('onsubmit',formData);
    API.post(`${baseUrl}/user/profile/profilepicture`, formData, {
      withCredentials: true,
    }).then((response) => {
      addNewNotification(response.data.notification);
      setProfile(response.data.result);
      setCurrentUser(response.data.result);
    });
  };

  // console.log('new user', currentUser)

  const handleFileInput = (e) => {
    // console.log('file', e.target.name)
    const file = e.target.files[0];
    // console.log("file", file);
    setSelectedFile(file);
  };

  const deleteTrack = (index) => {
    const songToDelete = profile.music[index]
    // console.log('song to delete', songToDelete)
    const updatedTracks = profile.music.filter((song, idx) => idx !== index)
    const songObj = {newSongList: updatedTracks, deleteSong: songToDelete}
    API.patch(`${baseUrl}/music/delete`, songObj, { withCredentials: true})
    .then(response => {
      setCurrentUser(response.data.result);
      setProfile(response.data.result);
      addNewNotification( response.data.notification);
    }).catch()
  }

  const inputSearchHandler = (e) => {
    e.preventDefault();
    let query = e.target.value.toLowerCase().toString();
    // console.log('query', query)
    if (!query) {
      const filteredUsers = usersForSearch.filter(user => user._id !== currentUser._id)
      setUsers(filteredUsers);
      getNearbyUsers()
    } else {
      // let regex = `/[a-zA-Z]*${query}|${query}[a-zA-Z]*|[a-zA-Z]*${query}[a-zA-Z]*/`
      let regex = new RegExp(query, 'g')
      console.log(regex)
      const newSearchResult = 
      usersForSearch.filter(user => 
      user.instrument.some(i => i.match(regex)) || 
      user.genre.some(g => g.match(regex)) || 
      user.username.toLowerCase().match(regex))
      setUsers(newSearchResult)
      navigate('/');
      // console.log('newSearchResult', newSearchResult)
    }

  }



  const duration = (s) => {
    let min = Math.floor(s / 60);
    let sec = (s % 60).toFixed(0);
    return min + ":" + (sec < 10 ? "0" : "") + sec;
  };

  //----------------------------------------------------------------

//   function useMultiAudio(users, getNearbyUsers) {

//     const urls = users && users.map(user => user.music.length > 0 && user.music[0].path);
//   const [sources] = useState(
//     urls.map(url => {
//       return {
//         url,
//         audio: new Audio(url),
//       }
//     }),
//   )

//   // useEffect(() => {
//   //   getNearbyUsers()
//   // }, [])

//   const [players, setPlayers] = useState(
//     urls.map(url => {
//       return {
//         url,
//         playing: false,
//       }
//     }),
//   )

//   const toggle = targetIndex => () => {
//     const newPlayers = [...players]
//     const currentIndex = players.findIndex(p => p.playing === true)
//     if (currentIndex !== -1 && currentIndex !== targetIndex) {
//       newPlayers[currentIndex].playing = false
//       newPlayers[targetIndex].playing = true
//     } else if (currentIndex !== -1) {
//       newPlayers[targetIndex].playing = false
//     } else {
//       newPlayers[targetIndex].playing = true
//     }
//     setPlayers(newPlayers)
//   }

//   useEffect(() => {
//     sources.forEach((source, i) => {
//       players[i].playing ? source.audio.play() : source.audio.pause()
//     })
//   }, [sources, players])

//   useEffect(() => {
//     sources.forEach((source, i) => {
//       source.audio.addEventListener('ended', () => {
//         const newPlayers = [...players]
//         newPlayers[i].playing = false
//         setPlayers(newPlayers)
//       })
//     })
//     return () => {
//       sources.forEach((source, i) => {
//         source.audio.removeEventListener('ended', () => {
//           const newPlayers = [...players]
//           newPlayers[i].playing = false
//           setPlayers(newPlayers)
//         })
//       })
//     }
//   }, [])

//   return [players, toggle]
// }
 

  const value = {
    setFileName,
    setSelectedFile,
    submitForm,
    fileName,
    selectedFile,
    handleFileInput,
    submitPicture,
    deleteTrack,
    likeSongs,
    isLiked,
    currentSong,
    dislikeSongs,
    inputSearchHandler,
    displaySearch, 
    setDisplaySearch,
    duration,
    idList, 
    setIdList
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataContext;