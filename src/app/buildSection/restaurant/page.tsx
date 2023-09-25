"use client";

import styles from "../../build.module.css";
import Link from "next/link";
import { useState, useEffect, useTransition } from "react";
import Header from "../../components/header";
import jwt from "jsonwebtoken";
import axios from "axios";
import Loading from "../../components/loading";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { set } from "mongoose";
export default function Restaurant() {
  const router = useRouter();

  const [isNewOrder, setIsNewOrder] = useState(false);
  const [file, setFile] = useState<File>();
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [userId, setUserId] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTransitionStarted, startTransition] = useTransition();

  const handleNewOrder = () => {
    setIsNewOrder(!isNewOrder);
  };

  const handleImageUpload = (e: any) => {};

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFile(file);

    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = function (e: any) {
        console.log(e.target.result);
        setImage(e.target.result);
      };
      fileReader.readAsDataURL(file);
    }

    if (!file) return;

    try {
      //debugger;

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
    const getUserDetails = async () => {
      try {
        const res = await axios.get("/api/me");

        const id = res.data.data.id;
        setUserId(id); // Assuming the user ID is stored as 'id' in the response
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getUserDetails();
  }, []);

  interface MenuItem {
    id: number;
    user_id: number;
    name: string;
    price: string;
    img: string;
  }

  const isMutating = isTransitionStarted;

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        startTransition(router.refresh);
        const response = await axios.get("/api/menu"); // Adjust the API endpoint URL as needed
        setMenuItems(response.data.menuItems);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMenuItems();
  }, []);

  return (
    <div className={styles.mainRestaurant}>
      <Header />

      <div className={styles.userProfile}>
        <div className={styles.userProfileflex}>logo</div>
        <div className={styles.userProfileflex}>BurgerKing</div>
      </div>

      <div className={styles.bodyRestaurant}>
        <div className={styles.containerOrders}>
          {isNewOrder == false && (
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
                        <h3>Navbar Title</h3>
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
            {isMutating ? (
              <Loading />
            ) : (
              <div className={styles.bodyOrders}>
                <div className={styles.containerOrders}>
                  {menuItems.map((menuItem: MenuItem) => (
                    <div key={menuItem.id}>
                      {menuItem.user_id === Number(userId) ? (
                        <div className={styles.flexOrders}>
                          {" "}
                          <div className={styles.flexOrdersItems}>
                            <img
                              className={styles.img}
                              src={`../${menuItem.img}`}
                            />
                          </div>
                          <div className={styles.flexOrdersItems}>
                            <h3>{menuItem.name}</h3>
                          </div>
                          <div className={styles.flexOrdersItems}>
                            <p>Price: {menuItem.price}</p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
