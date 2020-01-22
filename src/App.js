import React, { useEffect, useState } from "react";
import Sidebar from "react-sidebar";
import ProductCard from "./components/ProductCard";
import CartCard from "./components/CartCard";

import "rbx/index.css";
import {
  Column,
  Title,
  Button,
  Container,
  Navbar,
  Field,
  Control,
  Icon,
  Hero
} from "rbx";

const App = () => {
  const [data, setData] = useState({});
  const [openSidebar, setOpenSidebar] = useState(false);
  const [cart, setCart] = useState([]);

  const addCartItem = item => {
    const itemExists = cart.some(
      x => x.sku === item.sku && x.size === item.size
    );
    if (itemExists) {
      let newCart = [...cart];
      for (let i = 0; i < newCart.length; i++) {
        if (newCart[i].sku === item.sku && newCart[i].size === item.size) {
          newCart[i].count += 1;
        }
      }
      console.log(newCart);
      setCart(newCart);
    } else {
      console.log([...cart, item]);
      setCart([...cart, item]);
    }

    setOpenSidebar(true);
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
                    <div style={{ margin: "10px 0" }}>
                      {cart.map(cartItem => (
                        <CartCard key={`${cartItem.sku} | ${cartItem.size}`} item={cartItem} />
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
                  <ProductCard product={product} addCartItem={addCartItem} />
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
