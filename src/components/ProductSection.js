import React, { useEffect } from "react";
import FontAwesome from "react-fontawesome";
import { Link } from "react-router-dom";
import { excerpt } from "../utility";

const ProductSection = ({
  id,
  name,
  description,
  category,
  imgUrl,
  userId,
  author,
  timestamp,
  user,
  handleDelete,
}) => {
  return (
    <div>
      <div
        className="row pb-4 p-4"
        key={id}
        style={{ border: "4px solid grey" }}
      >
        <div className="col-md-5">
          <div className="hover-blogs-img">
            <div className="blogs-img">
              <img src={imgUrl} alt={name} />
              <div></div>
            </div>
          </div>
        </div>
        <div className="col-md-7">
          <div className="text-start">
            <h6 className="category catg-color">{category}</h6>
            <span className="title py-2">{name}</span>
            <span className="meta-info">
              <p className="author">{author}</p> -&nbsp;
              {timestamp.toDate().toDateString()}
            </span>
          </div>
          <div className="short-description text-start">
            {excerpt(description, 120)}
          </div>

          {/* <Link to={`/detail/${id}`} className="mx-2">
            <button className="btn  btn-primary">See Detail</button>
          </Link> */}
          <div className="d-flex justify-content-between my-3">
            <Link to={`/detail/${id}`}>
              <button className="btn btn-primary mr-2">See Detail</button>
            </Link>
            <button className="btn btn-info mr-2">Negotiate</button>
            <button className="btn btn-success">Buy Product</button>
          </div>

          {user && user.uid === userId && (
            <div style={{ float: "right" }}>
              <FontAwesome
                name="trash"
                style={{ margin: "15px", cursor: "pointer" }}
                size="2x"
                onClick={() => handleDelete(id)}
              />
              <Link to={`/update/${id}`}>
                <FontAwesome
                  name="edit"
                  style={{ cursor: "pointer" }}
                  size="2x"
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSection;
