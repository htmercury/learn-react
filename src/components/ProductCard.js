import React, { useEffect, useState } from "react";

import "rbx/index.css";
import { Card, Content, Divider, Image, Title, Button } from "rbx";

const ProductCard = ({ product, cart, availability, addCartItem }) => {
  let sizes = ["S", "M", "L", "XL"];
  if (availability === undefined) {
    availability = {
      S: 0,
      M: 0,
      L: 0,
      XL: 0
    };
  }

  const [sizeSelected, setSizeSelected] = useState();

  const cartItem = {
    sku: product.sku,
    size: sizeSelected,
    price: `$${parseFloat(product.price).toFixed(2)}`,
    count: 1,
    product
  };

  const sizeAvailable = size => {
    const matchedItems = cart.filter(
      cartItem => cartItem.sku === product.sku && cartItem.size === size
    );
    if (matchedItems.length === 0) {
      return true;
    } else {
      return matchedItems[0].count < availability[size];
    }
  };

  const resetSelect = () => setSizeSelected(undefined);

  return (
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
          <Button.Group style={{ justifyContent: "center", marginTop: "5px" }}>
            {sizes.map(size => (
              <Button
                color={size === sizeSelected ? "black" : null}
                onClick={() => setSizeSelected(size)}
                disabled={availability[size] === 0 || !sizeAvailable(size)}
                key={size}
              >
                {size}
              </Button>
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
            <Button
              color="black"
              onClick={() => addCartItem(cartItem, resetSelect)}
              disabled={!sizes.some(s => availability[s] > 0)}
            >
              Add to cart
            </Button>
          </Button.Group>
        </Content>
      </Card.Content>
    </Card>
  );
};

export default ProductCard;
