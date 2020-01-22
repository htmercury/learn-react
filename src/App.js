import React, { useEffect, useState } from "react";
import Sidebar from "react-sidebar";

import "rbx/index.css";
import {
  Column,
  Card,
  Content,
  Divider,
  Image,
  Title,
  Button,
  Container,
  Navbar,
  Field,
  Control,
  Icon,
  Hero,
  Media,
  Delete,
  Level
} from "rbx";

const App = () => {
  const [data, setData] = useState({});
  const [openSidebar, setOpenSidebar] = useState(false);

  const products = Object.values(data);
  const productGroups = [
    ...Array(Math.ceil(products.length / 4)).keys()
  ].map(i => products.slice(4 * i, 4 * i + 4));

  const sizes = ["S", "M", "L", "XL"];

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
                  <Button color="primary" onClick={() => setOpenSidebar(!openSidebar)}>
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
                    <div>
                      <Card paddingless>
                        <Card.Content>
                          <Media>
                            <Media.Item as="figure" align="left">
                              <Image.Container as="p" size={64}>
                                <Image
                                  alt="64x64"
                                  // src={`data/products/${item.sku}_1.jpg`}
                                  src={`data/products/12064273040195392_1.jpg`}
                                />
                              </Image.Container>
                            </Media.Item>

                            <Media.Item align="center">
                              <Title as="p" size={6}>
                                {/* {item.title} */}
                                Cat Tee Black T-Shirt
                              </Title>
                              <Title as="p" subtitle size={6}>
                                <small>
                                  {"S" + "|" + "Black with custom print"}
                                </small>
                                {/* <small>{item.size + "|" + item.style}</small> */}
                              </Title>
                            </Media.Item>

                            <Media.Item align="right">
                              <div style={{ float: "right" }}>
                                <Delete />
                              </div>
                              <br />
                              <div
                                style={{
                                  margin: "16%",
                                  color: "green"
                                }}
                              >
                                <p>{`$10.90`}</p>
                                {/* <p>{`$${parseFloat(item.price).toFixed(2)}`}</p> */}
                              </div>
                              <Level breakpoint="mobile">
                                <Level.Item align="left">
                                  <Level.Item as="a">
                                    <Button.Group hasAddons align="right">
                                      <Button>
                                        <Icon size="small">+</Icon>
                                      </Button>
                                      <Button>
                                        <Icon size="small">-</Icon>
                                      </Button>
                                    </Button.Group>
                                  </Level.Item>
                                </Level.Item>
                              </Level>
                              <Content>
                                <p>
                                  <small>Quantity: 1</small>
                                  {/* <small>Quantity: {item.numberSelected}</small> */}
                                  <br />
                                </p>
                              </Content>
                            </Media.Item>
                          </Media>
                        </Card.Content>
                      </Card>
                    </div>
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
              width: "450px",
              background: "white"
            }
          }}
          pullRight
        ></Sidebar>
        <Container style={{ marginTop: "20px" }}>
          {productGroups.map((products, idx) => (
            <Column.Group key={idx}>
              {products.map(product => (
                <Column size={3} key={product.sku}>
                  <Card>
                    <Card.Image>
                      <Image.Container>
                        <Image src={`./data/products/${product.sku}_1.jpg`} />
                      </Image.Container>
                    </Card.Image>
                    <Card.Content align="center">
                      <Content>
                        <Title as="p" size={6}>
                          {product.title}
                        </Title>
                        {`Description: ${product.description || "N/A"}`}
                        <Button.Group
                          style={{ justifyContent: "center", marginTop: "5px" }}
                        >
                          {sizes.map(size => (
                            <Button key={size}>{size}</Button>
                          ))}
                        </Button.Group>
                        <Divider />
                        {`$${parseFloat(product.price).toFixed(2)}`}
                        <Button.Group
                          style={{
                            justifyContent: "center",
                            marginTop: "10px"
                          }}
                        >
                          <Button color="black">Add to cart</Button>
                        </Button.Group>
                      </Content>
                    </Card.Content>
                  </Card>
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
