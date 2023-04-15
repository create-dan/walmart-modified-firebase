import {
  collection,
  endAt,
  endBefore,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

import Spinner from "../components/Spinner";
import { db } from "../firebase";
import ProductSection from "../components/ProductSection";

const MyProducts = ({ setActive, user }) => {
  const [loading, setLoading] = useState(false);
  const [myproducts, setmyProducts] = useState([]);

  const [count, setCount] = useState(null);

  useEffect(() => {
    getProductsData();

    setActive("products");
  }, []);

  if (loading) {
    return <Spinner />;
  }

  const getProductsData = async () => {
    setLoading(true);
    const productsRef = query(
      collection(db, "products"),
      where("userId", "==", user?.uid)
    );
    const productsSnapshot = await getDocs(productsRef);
    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setmyProducts(products);
    setCount(products.length);
    console.log(products);
    setLoading(false);
  };

  return (
    <div>
      <div className="container ">
        <div className="row">
          <div className="blog-heading text-center py-2 my-4">My Products</div>
          {!count && (
            <>
              <h1 className="text-center">You have 0 Products</h1>
            </>
          )}

          {myproducts?.map((product) => (
            <div className="col-md-8" key={product.id}>
              <div className="m-4">
                <ProductSection {...product} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyProducts;
