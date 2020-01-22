import React, { useEffect, useState } from "react";

import "rbx/index.css";
import { Card, Content, Divider, Image, Title, Button } from "rbx";

const ProductCard = ({ product, addCartItem }) => {
  const sizes = ["S", "M", "L", "XL"];
  const [sizeSelected, setSizeSelected] = useState(sizes[0]);

  const cartItem = {
    sku: product.sku,
    size: sizeSelected,
    price: `$${parseFloat(product.price).toFixed(2)}`,
    count: 1,
    product
  };

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
            <Button color="black" onClick={() => addCartItem(cartItem)}>
              Add to cart
            </Button>
          </Button.Group>
        </Content>
      </Card.Content>
    </Card>
  );
};

export default ProductCard;
