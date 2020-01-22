import { firebaseDb } from "./firebaseDb";

const generateId = (sku, size) => `${sku}-${size}`;

export const buyCartItem = async (sku, size, count) => {
  let stock = await firebaseDb
    .child(sku)
    .once("value")
    .then(snap => snap.val());

  const result = Math.max(stock[size] - count, 0);

  stock[size] = result;

  return await firebaseDb.child(sku).update(stock);
};

export const setUserCartItem = async (user, sku, size, count) => {
  return await firebaseDb
    .child("carts")
    .child(user.uid)
    .child(generateId(sku, size))
    .child(sku)
    .update({ count, sku, size });
};

export const getUserCartItems = async user => {
  return await firebaseDb
    .child("carts")
    .child(user.uid)
    .once("value")
    .then(snap => snap.val());
};

export const firebaseDeleteCartItem = async (user, sku, size) => {
  firebaseDb
    .child("carts")
    .child(user.uid)
    .child(generateId(sku, size))
    .remove();
};
