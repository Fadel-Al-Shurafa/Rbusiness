"use client";

import styles from "../profile.module.css";
import Link from "next/link";
import Loading from "../components/loading";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const [data, setData] = useState("empty");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const res = await axios.get("/api/me");
        console.log(res.data);
        setData(res.data.data.id); // Assuming the user ID is stored as 'id' in the response
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getUserDetails();
  }, []);

  useEffect(() => {
    if (data !== "empty") {
      router.push(`../profile/${data}`);
    }
  }, [data]);



  // const getUserDetails = async () => {
  //   const res = await axios.get('/api/me')
  //   console.log(res.data)
  //   setData(res.data.data._id)
  // }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className={styles.UserProfile}>

        </div>
      )}
    </>
  );
}
