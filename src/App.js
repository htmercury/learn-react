import React, { useEffect, useState } from "react";
import Sidebar from "react-sidebar";
import ProductCard from "./components/ProductCard";
import CartCard from "./components/CartCard";

import firebase from "firebase/app";
import "firebase/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { firebaseDb } from "./components/shared/firebaseDb";

import {
  getUserCartItems,
  setUserCartItem,
  firebaseDeleteCartItem,
  buyCartItem
} from "./components/shared/firebaseInventoryUtils";

import "rbx/index.css";
import "./App.css";
import {
  Column,
  Title,
  Button,
  Container,
  Navbar,
  Field,
  Control,
  Icon,
  Hero,
  Box,
  Message,
  Delete
} from "rbx";

const uiConfig = {
  signInFlow: "popup",
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};

const App = () => {
  const [user, setUser] = useState(undefined);
  const [data, setData] = useState({});
  const [inventory, setInventory] = useState({});
  const [openSidebar, setOpenSidebar] = useState(false);
  const [displayCartChange, setDisplayCartChange] = useState(false);
  const [cart, setCart] = useState([]);

  const { totalCost, totalCount } = cart.reduce(
    (acc, curr) => {
      return {
        totalCost: curr.count * curr.product.price + acc.totalCost,
        totalCount: curr.count + acc.totalCount
      };
    },
    { totalCost: 0, totalCount: 0 }
  );

  const addCartItem = (item, resetSelect) => {
    if (item.size === undefined) {
      return;
    }

    const itemExists = cart.some(
      x => x.sku === item.sku && x.size === item.size
    );
    if (itemExists) {
      let newCart = [...cart];
      for (let i = 0; i < newCart.length; i++) {
        if (newCart[i].sku === item.sku && newCart[i].size === item.size) {
          // check if it doesn't exceed inventory
          if (inventory[newCart[i].sku][newCart[i].size] > newCart[i].count) {
            newCart[i].count += item.count;
            if (
              newCart[i].count === inventory[newCart[i].sku][newCart[i].size]
            ) {
              resetSelect();
            }
            if (user) setUserCartItem(user, item.sku, item.size, newCart[i].count);
          } else {
            return;
          }
        }
      }
      setCart(newCart);
    } else {
      if (inventory[item.sku][item.size] === 1) {
        resetSelect();
      }
      setCart([...cart, item]);
      if (user) setUserCartItem(user, item.sku, item.size, item.count);
    }

    setOpenSidebar(true);
  };

  const verifyCartSelection = async () => {
    let mismatch = false;
    
    for (let item of cart) {
      if (inventory[item.sku][item.size] < item.count) {
        mismatch = true;
        await decrementCartItem(item);
      }
    }

    if (mismatch) {
      await firebaseDb
      .child("carts")
      .child(user.uid)
      .remove();
  
      cart.map(async item => await setUserCartItem(user, item.sku, item.size, item.count));
  
      setDisplayCartChange(true);
    }
  };

  const incrementCartItem = item => {
    let newCart = [...cart];
    for (let i = 0; i < newCart.length; i++) {
      if (newCart[i].sku === item.sku && newCart[i].size === item.size) {
        // check if it doesn't exceed inventory
        if (inventory[newCart[i].sku][newCart[i].size] > newCart[i].count) {
          newCart[i].count += 1;
          if (user) setUserCartItem(user, item.sku, item.size, newCart[i].count);
        } else {
          return;
        }
      }
    }
    setCart(newCart);
  };

  const decrementCartItem = item => {
    let newCart = [...cart];
    for (let i = 0; i < newCart.length; i++) {
      if (newCart[i].sku === item.sku && newCart[i].size === item.size) {
        if (newCart[i].count > 1) {
          newCart[i].count -= 1;
          if (user) setUserCartItem(user, item.sku, item.size, newCart[i].count);
        } else {
          newCart.splice(i, 1);
        }
      }
    }
    setCart(newCart);
  };

  const removeCartItem = item => {
    let newCart = [...cart];
    for (let i = 0; i < newCart.length; i++) {
      if (newCart[i].sku === item.sku && newCart[i].size === item.size) {
        newCart.splice(i, 1);
        if (user) firebaseDeleteCartItem(user, item.sku, item.size);
      }
    }
    setCart(newCart);
  };

  const products = Object.values(data);
  const productGroups = [
    ...Array(Math.ceil(products.length / 4)).keys()
  ].map(i => products.slice(4 * i, 4 * i + 4));

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("./data/products.json");
      const json = await response.json();
      setData(json);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleData = snap => {
      if (snap.val()) {
        setInventory(snap.val());
      }
    };
    firebaseDb.on("value", handleData, error => alert(error));
    return () => {
      firebaseDb.off("value", handleData);
    };
  }, []);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        return;
      }

      getUserCartItems(user).then(cartItems => {
        if (cartItems !== null) {
          const userItems = Object.values(cartItems).map(item => {
            const product = data ? data[item.sku] : null;
            const price = product
              ? `$${parseFloat(product.price).toFixed(2)}`
              : null;

            return {
              sku: item.sku,
              size: item.size,
              price,
              count: item.count,
              product
            };
          });

          setCart(userItems.filter(item => item.price !== null));
        }
      });
    });
  }, [data]);

  return (
    <React.Fragment>
      <Navbar color="dark" fixed="top" style={{ height: "88px" }}>
        <Navbar.Brand>
          <Navbar.Item>
            <img src="./logo192.png" alt="New Shopping Cart Logo" />
          </Navbar.Item>
          <Navbar.Burger />
        </Navbar.Brand>
        <Navbar.Menu>
          <Navbar.Segment align="start">
            <Navbar.Item>New Shopping Cart</Navbar.Item>
          </Navbar.Segment>
          <Navbar.Segment align="end">
            <Navbar.Item as="div">
              {user ? (
                <React.Fragment>
                  <div style={{ paddingRight: "15px" }}>
                    Welcome, {user.displayName}
                  </div>
                  <Button
                    primary="true"
                    onClick={() => {
                      setCart([]);
                      firebase.auth().signOut();
                      setOpenSidebar(false);
                    }}
                  >
                    Log out
                  </Button>
                </React.Fragment>
              ) : (
                <StyledFirebaseAuth
                  uiConfig={uiConfig}
                  firebaseAuth={firebase.auth()}
                />
              )}
            </Navbar.Item>

            <Navbar.Item as="div">
              <Field kind="group">
                <Control>
                  <Button
                    color="primary"
                    onClick={() => {
                      setOpenSidebar(!openSidebar);

                      verifyCartSelection();
                    }}
                  >
                    <Icon>ƒ</Icon>
                    <span>Cart</span>
                  </Button>
                </Control>
              </Field>
            </Navbar.Item>
          </Navbar.Segment>
        </Navbar.Menu>
      </Navbar>
      <Container fluid style={{ margin: 0, marginTop: "-45px" }}>
        <Sidebar
          sidebar={
            <Container>
              <Hero>
                <Hero.Body>
                  <Container>
                    <Title>Shopping Cart</Title>
                    <Title as="h2" subtitle>
                      Your items:
                    </Title>
                    {displayCartChange && (
                      <Message color="warning">
                        <Message.Header>
                          <p>Your cart has been adjusted.</p>
                          <Delete
                            as="button"
                            onClick={() => setDisplayCartChange(false)}
                          />
                        </Message.Header>
                        <Message.Body>
                          The inventory have changed since the last time you
                          have visited.
                        </Message.Body>
                      </Message>
                    )}
                    <Box color="primary" textAlign="centered">
                      <small>Cost: ${totalCost.toFixed(2)}</small>
                      <br />
                      <small>Items : {totalCount}</small>
                    </Box>
                    <div style={{ margin: "10px 0" }}>
                      {cart.map(cartItem => (
                        <CartCard
                          state={{
                            incrementCartItem,
                            decrementCartItem,
                            removeCartItem
                          }}
                          key={`${cartItem.sku} | ${cartItem.size}`}
                          item={cartItem}
                        />
                      ))}
                    </div>
                    <Button
                      backgroundColor={"black"}
                      textColor={"white"}
                      fullwidth
                      size={"medium"}
                      disabled={!user}
                      onClick={() => {
                        if (cart.length > 0) {
                          for (let item of cart) {
                            buyCartItem(item.sku, item.size, item.count);
                          }

                          setCart([]);
                        }
                      }}
                    >
                      Checkout
                    </Button>
                  </Container>
                </Hero.Body>
              </Hero>
              <br />
            </Container>
          }
          open={openSidebar}
          onSetOpen={setOpenSidebar}
          styles={{
            sidebar: {
              transition: "left .1s, right .1s",
              WebkitTransition: "-webkit-transform .1s ease-out",
              paddingTop: "53px",
              width: "425px",
              background: "white"
            }
          }}
          pullRight
        >
          <p></p>
        </Sidebar>
        <Container style={{ marginTop: "80px" }}>
          {productGroups.map((products, idx) => (
            <Column.Group key={idx}>
              {products.map(product => (
                <Column size={3} key={product.sku}>
                  <ProductCard
                    product={product}
                    availability={inventory[product.sku]}
                    addCartItem={addCartItem}
                    cart={cart}
                  />
                </Column>
              ))}
            </Column.Group>
          ))}
        </Container>
      </Container>
    </React.Fragment>
  );
};

export default App;
