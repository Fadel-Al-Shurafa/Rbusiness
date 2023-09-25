"use client";

import React from "react";
import styles from "../registration.module.css";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { promises } from "dns";
import { resolve } from "path";
import Loading from "../components/loading";

export default function SigninComponent() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const onSignin = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.post("/api/signin", user);
      console.log("Signup success", response.data);
      router.push("/");
    } catch (error: any) {
      console.log("failedsign-in:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className={styles.RegistrationComponent}>
          <form onSubmit={onSignin}>
            <br />
            <div className={styles.RegistrationComponentHeader}> Login in </div>
            <div className={styles.RegistrationComponentContainer}>
              <div className={styles.RegistrationComponentFlex}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  required
                  placeholder="Email"
                />
              </div>
              <div className={styles.RegistrationComponentFlex}>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  required
                  placeholder="Password"
                />
              </div>
            </div>
            <div className={styles.RegistrationComponentBTN}>
              {" "}
              <button type="submit">Submit</button>
            </div>
            <Link href="/signup">
              <div className={styles.RegistrationComponentToSginin}>
                {" "}
                I don't have account{" "}
              </div>
            </Link>
            <div className={styles.RegistrationComponentFooter}></div>
          </form>
        </div>
      )}
    </>
  );
}
