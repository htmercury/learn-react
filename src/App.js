import React, { useEffect, useState } from "react";

import "rbx/index.css";
import {
  Column,
  Card,
  Content,
  Divider,
  Image,
  Title,
  Button
} from "rbx";

const App = () => {
  const [data, setData] = useState({});
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
    <div>
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
                      style={{ justifyContent: "center", marginTop: "10px" }}
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
    </div>
  );
};

export default App;
