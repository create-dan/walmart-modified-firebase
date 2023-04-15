import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  orderBy,
  where,
  startAfter,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";

import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { toast } from "react-toastify";
import Tags from "../components/Tags";
import FeatureProducts from "../components/FeatureProducts";
import Trending from "../components/Trending";
import Search from "../components/Search";
import { isEmpty, isNull } from "lodash";
import { useLocation } from "react-router-dom";
import Category from "../components/Category";
import ProductSection from "../components/ProductSection";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = ({ setActive, user, active }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState("");
  const [lastVisible, setLastVisible] = useState(null);
  const [trendProducts, setTrendProducts] = useState([]);
  const [totalproducts, setTotalProducts] = useState(null);
  const [hide, setHide] = useState(false);
  const queryString = useQuery();
  const searchQuery = queryString.get("searchQuery");
  const location = useLocation();

  const getTrendingProducts = async () => {
    const productRef = collection(db, "products");
    const trendQuery = query(productRef, where("trending", "==", "yes"));
    const querySnapshot = await getDocs(trendQuery);
    let trendProducts = [];
    querySnapshot.forEach((doc) => {
      trendProducts.push({ id: doc.id, ...doc.data() });
    });
    setTrendProducts(trendProducts);
  };

  useEffect(() => {
    getTrendingProducts();
    setSearch("");
    const unsub = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        let list = [];
        let tags = [];
        snapshot.docs.forEach((doc) => {
          tags.push(...doc.get("tags"));
          list.push({ id: doc.id, ...doc.data() });
        });
        const uniqueTags = [...new Set(tags)];
        setTags(uniqueTags);
        setTotalProducts(list);
        setLoading(false);
        setActive("products");
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
      getTrendingProducts();
    };
  }, [setActive, active]);

  useEffect(() => {
    getProducts();
    setHide(false);
  }, [active]);

  const getProducts = async () => {
    const productRef = collection(db, "products");
    const firstFour = query(productRef, orderBy("name"), limit(4));
    const docSnapshot = await getDocs(firstFour);
    setProducts(docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
  };

  const updateState = (docSnapshot) => {
    const isCollectionEmpty = docSnapshot.size === 0;
    if (!isCollectionEmpty) {
      const productsData = docSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts((prevProducts) => [...prevProducts, ...productsData]);
      setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
    } else {
      toast.info("No more products to display");
      setHide(true);
    }
  };

  const fetchMore = async () => {
    setLoading(true);
    const productRef = collection(db, "products");
    const nextFour = query(
      productRef,
      orderBy("name"),
      limit(4),
      startAfter(lastVisible)
    );
    const docSnapshot = await getDocs(nextFour);
    updateState(docSnapshot);
    setLoading(false);
  };

  const searchProducts = async () => {
    const productRef = collection(db, "products");
    const searchTitleQuery = query(
      productRef,
      where("name", "==", searchQuery)
    );
    const searchTagQuery = query(
      productRef,
      where("tags", "array-contains", searchQuery)
    );
    const titleSnapshot = await getDocs(searchTitleQuery);
    const tagSnapshot = await getDocs(searchTagQuery);

    let searchTitleBlogs = [];
    let searchTagBlogs = [];
    titleSnapshot.forEach((doc) => {
      searchTitleBlogs.push({ id: doc.id, ...doc.data() });
    });
    tagSnapshot.forEach((doc) => {
      searchTagBlogs.push({ id: doc.id, ...doc.data() });
    });
    const combinedSearchBlogs = searchTitleBlogs.concat(searchTagBlogs);
    setProducts(combinedSearchBlogs);
    setHide(true);
    setActive("");
  };

  useEffect(() => {
    if (!isNull(searchQuery)) {
      searchProducts();
    }
  }, [searchQuery]);

  if (loading) {
    return <Spinner />;
  }

  const handleDelete = async (id) => {
    console.log(id);
    if (window.confirm("Are you sure wanted to delete that blog ?")) {
      try {
        setLoading(true);
        await deleteDoc(doc(db, "products", id));
        toast.success("Product deleted successfully");
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if (isEmpty(value)) {
      console.log("test");
      getProducts();
      setHide(false);
    }
    setSearch(value);
  };

  // category count
  const counts = totalproducts.reduce((prevValue, currentValue) => {
    let name = currentValue.category;
    if (!prevValue.hasOwnProperty(name)) {
      prevValue[name] = 0;
    }
    prevValue[name]++;
    // delete prevValue["undefined"];
    return prevValue;
  }, {});

  const categoryCount = Object.keys(counts).map((k) => {
    return {
      category: k,
      count: counts[k],
    };
  });

  console.log("categoryCount", categoryCount);

  return (
    <div className="container-fluid pb-4 pt-4 padding">
      <div className="container padding">
        <div className="row mx-0">
          <Trending blogs={trendProducts} />
          <div className="col-md-8">
            <div className="blog-heading text-start py-2 my-4 fw-bold ">
              Daily Products
            </div>
            {products.length === 0 && location.pathname !== "/" && (
              <>
                <h4>
                  No Product found with search keyword:{" "}
                  <strong>{searchQuery}</strong>
                </h4>
              </>
            )}
            {products?.map((product) => (
              <div className="m-4">
                <ProductSection
                  key={product.id}
                  user={user}
                  handleDelete={handleDelete}
                  {...product}
                />
              </div>
            ))}

            {!hide && (
              <button
                className="btn btn-info w-100 my-4 p-2 "
                onClick={fetchMore}
              >
                Load More
              </button>
            )}
          </div>
          <div className="col-md-3">
            <Search search={search} handleChange={handleChange} />
            {/* <div className="blog-heading text-start py-2 mb-4">Tags</div> */}
            {/* <Tags tags={tags} /> */}
            {/* <FeatureProducts title={"Most Popular"} products={products} /> */}
            <Category catgBlogsCount={categoryCount} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
