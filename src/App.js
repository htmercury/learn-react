import React, { useEffect, useState } from "react";
import Sidebar from "react-sidebar";
import ProductCard from "./components/ProductCard";
import CartCard from "./components/CartCard";

import { firebaseDb } from "./components/shared/firebaseDb";

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
  Box
} from "rbx";

const App = () => {
  const [data, setData] = useState({});
  const [inventory, setInventory] = useState({});
  const [openSidebar, setOpenSidebar] = useState(false);
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
            newCart[i].count += 1;
            if (
              newCart[i].count === inventory[newCart[i].sku][newCart[i].size]
            ) {
              resetSelect();
            }
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
    }

    setOpenSidebar(true);
  };

  const incrementCartItem = item => {
    let newCart = [...cart];
    for (let i = 0; i < newCart.length; i++) {
      if (newCart[i].sku === item.sku && newCart[i].size === item.size) {
        // check if it doesn't exceed inventory
        if (inventory[newCart[i].sku][newCart[i].size] > newCart[i].count) {
          newCart[i].count += 1;
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

  return (
    <React.Fragment>
      <Navbar color="dark" fixed="top">
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
              <Field kind="group">
                <Control>
                  <Button
                    color="primary"
                    onClick={() => setOpenSidebar(!openSidebar)}
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
      <Container fluid style={{ margin: 0, marginTop: "-20px" }}>
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
        <Container style={{ marginTop: "20px" }}>
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
