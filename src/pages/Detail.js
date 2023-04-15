import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  orderBy,
  where,
} from "firebase/firestore";
import { isEmpty } from "lodash";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Tags from "../components/Tags";

import { db } from "../firebase";
import Spinner from "../components/Spinner";

const Detail = ({ setActive, user }) => {
  const userId = user?.uid;
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const getRecentProducts = async () => {
      const productRef = collection(db, "products");
      const recentProducts = query(
        productRef,
        orderBy("timestamp", "desc"),
        limit(5)
      );
      const docSnapshot = await getDocs(recentProducts);
      setProducts(
        docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    getRecentProducts();
  }, []);

  useEffect(() => {
    id && getProductDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  const getProductDetail = async () => {
    setLoading(true);
    const productRef = collection(db, "products");
    const docRef = doc(db, "products", id);
    const productDetail = await getDoc(docRef);
    const products = await getDocs(productRef);
    let tags = [];
    products.docs.map((doc) => tags.push(...doc.get("tags")));
    let uniqueTags = [...new Set(tags)];
    setTags(uniqueTags);
    setProduct(productDetail.data());

    setActive(null);
    setLoading(false);
  };

  return (
    <div className="single container-fluid my-5   ">
      <div className="row">
        <div className="col-md-5">
          <div
            className="blog-title-box"
            style={{ backgroundImage: `url('${product?.imgUrl}')` }}
          >
            <div className="overlay"></div>
            <div className="blog-title">
              <span>{product?.timestamp.toDate().toDateString()}</span>
              <h2>{product?.name}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="container ">
            <div className="row">
              <div className="col-md-12">
                <div className="blog text-start py-2 mb-4">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlIWK8zhNjcEEb135yu6L7uLhbJYC7SoWJpPRqwq0&s"
                    alt="user-avatar"
                    className="me-2"
                  />
                  {product?.author}
                </div>
              </div>
              <div className="col-md-12">
                <span className="meta-info text-start">
                  {product?.timestamp.toDate().toDateString()}
                </span>
              </div>
              <div className="col-md-12">
                <p className="text-start">{product?.description}</p>
              </div>
              <div className="col-md-12">
                <div className="text-start">
                  <Tags tags={product?.tags} />
                </div>
              </div>
              <div className="col-md-12">
                <button className="btn btn-lg btn-info me-2">
                  Buy Product
                </button>
                <button className="btn btn-lg btn-info me-2">Negotiate</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    // <div className="single">
    //   <div
    //     className="blog-title-box"
    //     style={{ backgroundImage: `url('${product?.imgUrl}')` }}
    //   >
    //     <div className="overlay"></div>
    //     <div className="blog-title">
    //       <span>{product?.timestamp.toDate().toDateString()}</span>
    //       <h2>{product?.name}</h2>
    //     </div>
    //   </div>
    //   <div className="container-fluid pb-4 pt-4 padding blog-single-content">
    //     <div className="container padding">
    //       <div className="row mx-0">
    //         <div className="col-md-8">
    //           <span className="meta-info text-start">
    //             By <p className="author">{product?.author}</p> -&nbsp;
    //             {product?.timestamp.toDate().toDateString()}
    //           </span>
    //           <p className="text-start">{product?.description}</p>
    //           <div className="text-start">
    //             <Tags tags={product?.tags} />
    //           </div>
    //           <br />
    //         </div>
    //         <div className="col-md-3">
    //           <div className="blog-heading text-start py-2 mb-4">
    //             Add user profile
    //           </div>
    //         </div>
    //       </div>

    //       <div className="">
    //         <button className="btn btn-lg btn-info">Buy Product</button>
    //         <button className="btn btn-lg btn-info">Buy Product</button>
    //         <button className="btn btn-lg btn-info">Buy Product</button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Detail;
