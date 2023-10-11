// SSR
"use client";

import styles from "../build.module.css";
import { useState, useEffect, useTransition } from "react";
import axios from "axios";
import React from "react";

interface MenuItem {
  id: string;
  user_id: number;
  name: string;
  price: string;
  img: string;
}

interface MenuDetailsProps {
  initialMenuItems: MenuItem[];
}

const MenuDetails: React.FC<MenuDetailsProps> = ({ initialMenuItems }) => {
  const [userId, setUserId] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);
  const [headingText, setHeadingText] = React.useState({
    name: "",
    price: "",
  });

  useEffect(() => {
    async function getData() {
      const responseMe = await axios.get("/api/me");
      const responseMenu = await axios.get("/api/menu");
      const menudata = responseMenu.data.menuItems;
      setMenuItems(menudata);
      const id = responseMe.data.data.id;
      setUserId(id); // Assuming the user ID is stored as 'id' in the response
    }

    getData();
  }, []);

  const deleteOrder = async (menuItem: MenuItem) => {
    try {
      const response = await axios.delete(`/api/menu/${menuItem.id}`);

      if (response.status === 200) {
        // Remove the deleted menu item from the state
        setMenuItems((prevItems) =>
          prevItems.filter((item) => item.id !== menuItem.id)
        );
        console.log("Post deleted successfully");
      } else {
        console.error("Failed to delete post");
        // Handle error case
      }
    } catch (error) {
      console.error("An error occurred while deleting the post:", error);
      // Handle error case
    }
  };

  const saveOrder = async (menuItem: MenuItem) => {
    setEdit(true);
    if (headingText.name === "" || headingText.price === "") {
      setEdit(false);
    } else {
      try {
        const response = await axios.put(
          `/api/menu/${menuItem.id}`,
          headingText
        );

        if (response.status === 200) {
          // Update the menu item in the state with the new values
          setMenuItems((prevItems) =>
            prevItems.map((item) => {
              if (item.id === menuItem.id) {
                return {
                  ...item,
                  name: headingText.name,
                  price: headingText.price,
                };
              }
              return item;
            })
          );
          console.log("Post edited successfully");
          setEdit(false);
          setHeadingText({ name: "", price: "" });
        } else {
          console.error("Failed to edit post");
          // Handle error case
        }
      } catch (error) {
        console.error("An error occurred while editting the post:", error);
        // Handle error case
      }
    }
  };

  return (
    <div className={styles.bodyOrders}>
      <div className={styles.containerOrders}>
        {menuItems &&
          menuItems.map((menuItem) => (
            <div key={menuItem.id}>
              {menuItem.user_id === Number(userId) && (
                <>
                  <div className={styles.flexOrders}>
                    <div className={styles.containerDEbtn}>
                      <a
                        className={styles.deleteBTN}
                        onClick={() => deleteOrder(menuItem)}
                      >
                        {" "}
                        Delete{" "}
                      </a>
                      {edit === false ||
                      !editItemId ||
                      editItemId !== menuItem.id ? (
                        <a
                          className={styles.editBTN}
                          onClick={() => {
                            setEdit(true), setEditItemId(menuItem.id);
                          }}
                        >
                          {" "}
                          Edit{" "}
                        </a>
                      ) : (
                        <a
                          className={styles.saveBTN}
                          onClick={() => saveOrder(menuItem)}
                        >
                          {" "}
                          Save{" "}
                        </a>
                      )}
                    </div>
                    <div className={styles.flexOrdersItems}>
                      <img className={styles.img} src={`../${menuItem.img}`} />
                    </div>
                    <div className={styles.flexOrdersItems}>
                      {!edit || !editItemId || editItemId !== menuItem.id ? (
                        <div className={styles.flexOrdersItems}>
                          <h2>
                            <b>{menuItem.name}</b>
                          </h2>
                          <p>Price: {parseInt(menuItem.price)}</p>
                        </div>
                      ) : (
                        <div>
                          <h2>
                            <b>
                              <input
                                type="text"
                                value={headingText.name}
                                onChange={(e) =>
                                  setHeadingText({
                                    ...headingText,
                                    name: e.target.value,
                                  })
                                }
                                placeholder={menuItem.name}
                                className={styles.editText}
                              />
                            </b>
                          </h2>
                          <p>
                            <input
                              type="text"
                              value={headingText.price}
                              onChange={(e) =>
                                setHeadingText({
                                  ...headingText,
                                  price: e.target.value,
                                })
                              }
                              placeholder={menuItem.price}
                              className={styles.editText}
                            />
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const responseMenu = await axios.get("/api/menu");
  const menuItems: MenuItem[] = responseMenu.data.menuItems;

  return {
    props: {
      initialMenuItems: menuItems,
    },
  };
}

export default MenuDetails;

// CSR
// "use client";

// import styles from "../build.module.css";
// import { useState, useEffect, useTransition } from "react";
// import axios from "axios";

// const menuDetails = () => {
//   const [userId, setUserId] = useState("");
//   const [postId, setPostId] = useState("");
//   const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

//   interface MenuItem {
//     id: string;
//     user_id: number;
//     name: string;
//     price: string;
//     img: string;
//   }

//   useEffect(() => {
//     async function getData() {
//       const responseMe = await axios.get("/api/me");
//       const responseMenu = await axios.get("/api/menu");
//       const menudata = responseMenu.data.menuItems;
//       setMenuItems(menudata);
//       const id = responseMe.data.data.id;
//       setUserId(id); // Assuming the user ID is stored as 'id' in the response
//     }

//     getData();
//   }, []);

//   const deleteOrder = async (menuItem: MenuItem) => {
//     try {
//       const response = await axios.delete(`/api/menu/${menuItem.id}`);

//       if (response.status === 200) {
//         // Remove the deleted menu item from the state
//         setMenuItems((prevItems) =>
//           prevItems.filter((item) => item.id !== menuItem.id)
//         );
//         // Perform any additional actions after successful deletion
//         console.log("Post deleted successfully");
//       } else {
//         console.error("Failed to delete post");
//         // Handle error case
//       }
//     } catch (error) {
//       console.error("An error occurred while deleting the post:", error);
//       // Handle error case
//     }
//   };

//   const editOrder = (menuItem: MenuItem) => {};

//   return (
//     <div className={styles.bodyOrders}>
//       <div className={styles.containerOrders}>
//         {menuItems.map((menuItem: MenuItem) => (
//           <div key={menuItem.id}>
//             {menuItem.user_id === Number(userId) ? (
//               <>
//                 <div className={styles.flexOrders}>
//                   <div className={styles.containerDEbtn}>
//                     <a
//                       className={styles.deleteBTN}
//                       onClick={() => deleteOrder(menuItem)}
//                     >
//                       {" "}
//                       Delete{" "}
//                     </a>
//                     <a
//                       className={styles.editBTN}
//                       onClick={() => editOrder(menuItem)}
//                     >
//                       {" "}
//                       Edit{" "}
//                     </a>
//                   </div>
//                   <div className={styles.flexOrdersItems}>
//                     <img className={styles.img} src={`../${menuItem.img}`} />
//                   </div>
//                   <div className={styles.flexOrdersItems}>
//                     <h2>
//                       <b>{menuItem.name}</b>
//                     </h2>
//                   </div>
//                   <div className={styles.flexOrdersItems}>
//                     <p>Price: {menuItem.price}</p>
//                   </div>
//                 </div>
//               </>
//             ) : null}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default menuDetails;
