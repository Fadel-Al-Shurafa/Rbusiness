"use client";

import styles from "../../build.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import Header from "../../components/header";
import jwt from "jsonwebtoken";
import axios from "axios";
import Loading from "../../components/loading";
import MenuDetails from "../../components/menuDetails";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { set } from "mongoose";

interface ProfileInfo {
  user_id: number;
  titleProfile: string;
  profileFile: string;
  BGprofileFile: string;
}

export default function Restaurant() {
  const router = useRouter();

  const [isNewOrder, setIsNewOrder] = useState(false);
  const [file, setFile] = useState<File>();
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [userId, setUserId] = useState("");
  const [checkId, setCheckId] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialMenuItems, setInitialMenuItems] = useState([]);
  const [edit, setEdit] = useState(false);
  const [profileEdit, setProfileEdit] = useState("");
  const [titleProfile, setTitleProfile] = useState("");
  const [profileFile, setProfileFile] = useState<File>();
  const [backGroundProfileFile, setBackGroundProfileFile] = useState<File>();
  const [profileInfo, setProfileInfo] = useState<ProfileInfo[]>();
  const [addProfileBtn, setAddprofileBtn] = useState(true);
  const [isAddProfile, setIsAddprofile] = useState(false);
  const handleNewOrder = () => {
    setIsNewOrder(!isNewOrder);
  };

  useEffect(() => {
    async function getProfileInfo() {
      const responseProfile = await axios.get(
        "/api/editProfile/getProfileInfo"
      );
      const profileInfo = responseProfile.data.profileInfo;
      setProfileInfo(profileInfo);
      console.log(profileInfo);

      if (Array.isArray(profileInfo) && profileInfo.length > 0) {
        setAddprofileBtn(false);
        setIsAddprofile(true);
        if (profileInfo[0].titleProfile) {
          setTitleProfile(profileInfo[0].titleProfile);
        }
      }
    }

    // Pass the userprofileInfo argument here
    getProfileInfo();
  }, []);

  const addProfile = async (e: any) => {
    e.preventDefault();
    setEdit(true);
    setProfileFile(profileFile);
    setBackGroundProfileFile(backGroundProfileFile);

    if (profileFile) {
      const fileReader = new FileReader();
      fileReader.onload = function (e: any) {
        setImage(e.target.result);
      };
      fileReader.readAsDataURL(profileFile);
    }
    if (!profileFile) return;

    if (backGroundProfileFile) {
      const fileReader = new FileReader();
      fileReader.onload = function (e: any) {
        setImage(e.target.result);
      };
      fileReader.readAsDataURL(backGroundProfileFile);
    }
    if (!backGroundProfileFile) return;

    try {
      const profileDetails = new FormData();
      profileDetails.set("titleProfile", titleProfile);
      profileDetails.set("profileFile", profileFile);
      profileDetails.set("backGroundProfileFile", backGroundProfileFile);
      profileDetails.set("userId", userId);

      const res = await fetch("/api/editProfile", {
        method: "POST",
        body: profileDetails,
      });

      if (!res.ok) throw new Error(await res.text());

      setEdit(false);
      setAddprofileBtn(false);
      setIsAddprofile(true);
    } catch (e: any) {
      console.log(e);
    }
  };

  const saveProfile = async (profileInfo: ProfileInfo) => {
    if (profileFile) {
      const fileReader = new FileReader();
      fileReader.onload = function (e: any) {
        setImage(e.target.result);
      };
      fileReader.readAsDataURL(profileFile);
    }
    if (!profileFile) return;

    if (backGroundProfileFile) {
      const fileReader = new FileReader();
      fileReader.onload = function (e: any) {
        setImage(e.target.result);
      };
      fileReader.readAsDataURL(backGroundProfileFile);
    }
    if (!backGroundProfileFile) return;

    try {
      const profileDetails = new FormData();
      profileDetails.set("titleProfile", titleProfile);
      profileDetails.set("profileFile", profileFile);
      profileDetails.set("backGroundProfileFile", backGroundProfileFile);
      profileDetails.set("userId", userId);

      const response = await axios.put("/api/editProfile/", profileDetails);
      if (response.status === 200) {
        // Update the menu item in the state with the new values
        setProfileInfo(
          (prevItems) =>
            prevItems &&
            prevItems.map((item) => {
              if (item.user_id === profileInfo.user_id) {
                return {
                  ...item,
                  titleProfile: profileInfo.titleProfile,
                  profileFile: profileInfo.profileFile,
                  BGprofileFile: profileInfo.BGprofileFile,
                };
              }
              return item;
            })
        );
        setEdit(false);
        console.log("Updated profileInfo:", profileInfo);

        console.log("Profile updated successfully");
      } else {
        console.error("Failed to update profile");
        // Handle error case
      }
    } catch (error) {
      console.error("An error occurred while update profile:", error);
      // Handle error case
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFile(file);

    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = function (e: any) {
        setImage(e.target.result);
      };
      fileReader.readAsDataURL(file);
    }

    if (!file) return;

    try {
      const menuDetails = new FormData();
      menuDetails.set("file", file);
      menuDetails.set("name", name);
      menuDetails.set("price", price);
      menuDetails.set("userId", userId);

      const res = await fetch("/api/uploadMenu", {
        method: "POST",
        body: menuDetails,
      });

      if (!res.ok) throw new Error(await res.text());
      setIsNewOrder(false);
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    async function getUserId() {
      const responseMe = await axios.get("/api/me");
      const id = responseMe.data.data.id;
      console.log(id);
      setUserId(id);
      setCheckId(id);
    }

    getUserId();
  }, []);

  return (
    <div className={styles.mainRestaurant}>
      <Header />
      {userId === checkId && (
        <div>
          <div className={styles.displayblock}>
            {addProfileBtn && (
              <a className={styles.editBTNp} onClick={addProfile}>
                {" "}
                Add Profile
              </a>
            )}
          </div>
          <div>
            {!edit ? (
              <>
                <div>
                  {isAddProfile && (
                    <a
                      className={styles.editBTNp}
                      onClick={() => {
                        setEdit(true);
                      }}
                    >
                      {" "}
                      Edit Profile{" "}
                    </a>
                  )}
                </div>
                <></>{" "}
                {profileInfo &&
                  profileInfo.map((profileInfo) => (
                    <div key={profileInfo.user_id}>
                      {userId === checkId && (
                        <>
                          <div
                            style={{
                              backgroundImage: `url(../${profileInfo.BGprofileFile})`,
                              width: "100%",
                              height: "400px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              textAlign: "center",
                            }}
                          >
                            <div className={styles.userProfileflex}>
                              <div className={styles.profileLogo}>
                                <div>
                                  <img
                                    className={styles.profileLogo}
                                    src={`../${profileInfo.profileFile}`}
                                  ></img>
                                  <div className={styles.userProfileflex}>
                                    <h3>{profileInfo.titleProfile}</h3>
                                  </div>{" "}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
              </>
            ) : (
              <>
                <div>
                  {isAddProfile && (
                    <>
                      {profileInfo &&
                        profileInfo.map((profileInfo) => (
                          <div key={profileInfo.user_id}>
                            <a
                              className={styles.saveBTNp}
                              onClick={() => saveProfile(profileInfo)}
                            >
                              save
                            </a>
                          </div>
                        ))}
                    </>
                  )}
                </div>
                <div className={styles.userProfile}>
                  <div className={styles.userProfileflex}>
                    <div className={styles.profileLogoBackGround}>
                      <div className={styles.profileLogoUpload}>
                        <input
                          type="file"
                          name="file"
                          placeholder="Enter image"
                          onChange={(e) =>
                            setBackGroundProfileFile(e.target.files?.[0])
                          }
                        />
                      </div>
                    </div>
                    <div className={styles.profileLogo}>
                      <div className={styles.profileLogoUpload}>
                        <input
                          type="file"
                          name="file"
                          placeholder="Enter image"
                          onChange={(e) => setProfileFile(e.target.files?.[0])}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={titleProfile}
                    onChange={(e) => setTitleProfile(e.target.value)}
                    placeholder="Title"
                    className={styles.editProfileText}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className={styles.bodyRestaurant}>
        <div className={styles.containerOrders}>
          {isNewOrder === false && (
            <>
              <div className={styles.newOrderBTN} onClick={handleNewOrder}>
                <h2>New Order</h2>
              </div>
            </>
          )}
        </div>
        <div>
          {loading ? (
            <Loading />
          ) : (
            <>
              {isNewOrder && (
                <nav className={styles.navbarBody}>
                  <div className={styles.navbarcontainer}>
                    <div className="navbar-toggle" onClick={handleNewOrder}>
                      {isNewOrder && (
                        <span className={styles.close}>&times;</span>
                      )}
                    </div>
                    <div className="navbar-content">
                      <div className="navbar-section">
                        <h3>Enter your order info</h3>
                      </div>
                      <form onSubmit={onSubmit}>
                        <div className={styles.navbarflexitems}>
                          <input
                            type="file"
                            name="file"
                            placeholder="Enter image"
                            onChange={(e) => setFile(e.target.files?.[0])}
                          />
                          <input
                            type="text"
                            placeholder="Enter Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.textInput}
                          />
                          <input
                            type="text"
                            placeholder="Enter Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className={styles.textInput}
                          />
                          <button className={styles.submit} type="submit">
                            Submit
                          </button>
                          {file && (
                            <img
                              src={URL.createObjectURL(file)}
                              style={{ width: "100px", height: "100px" }}
                            />
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </nav>
              )}
            </>
          )}
        </div>

        {isNewOrder === false && (
          <>
            {loading ? (
              <Loading />
            ) : (
              <MenuDetails initialMenuItems={initialMenuItems} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
