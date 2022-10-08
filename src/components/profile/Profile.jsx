import { useContext, useState } from "react";
import UserContext from "../../contexts/UserContext";
import React from "react";
// import { NavLink } from "react-router-dom";
import ProfileUpdate from './ProfileUpdate'
import ProfilePic from "./ProfilePic";
import './profile.styles.scss'
import Modal from "../UI/modal/Modal";
import DesignContext from "../../contexts/DesignContext";
import Upload from "../upload/Upload";

function Profile() {
  const [toggleBtn, setToggleBtn] = useState(false)
  const [togglePicBtn, setTogglePicBtn] = useState(false)
  const {toggleModalUpdate, displayModalUpdate, toggleModalAdd, displayModalAdd} = useContext(DesignContext)
  const {profile, currentUser} = useContext(UserContext)


  function togglePic() {
    setTogglePicBtn(!togglePicBtn)
  }
  console.log('profile', profile)

  return (
    <div className="profile-container">
      Profile
      { Object.keys(currentUser).length !== 0 && (
        <div>
          <img src={ profile?.image } alt="img" className="profile-img"/>
          <button onClick={ togglePic }>update pic</button>
          { togglePicBtn && <>
            <ProfilePic />

          </> }
          <h3>{ profile.username }</h3>
          <button onClick={ toggleModalUpdate }>update profile</button>
          { displayModalUpdate &&
            <Modal>
              <ProfileUpdate />
            </Modal>
          }

          <button onClick={ toggleModalAdd }>add track</button>
          {displayModalAdd &&
            <Modal>
              <Upload/>
            </Modal>
          }
        </div>



      )}

      
    </div>
  );
}

export default Profile;
