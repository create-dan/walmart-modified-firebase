import React from "react";
import Card from "./Card";

const RelatedProduct = ({ products, id }) => {
  return (
    <div>
      <div className="blog-heading text-start pt-3 py-2 mb-4">
        Related Products
      </div>
      <div className="col-md-12 text-left justify-content-center">
        <div className="row gx-5">
          {products.length === 1 && (
            <h5 className="text-center">
              Related Product not found with this current Product
            </h5>
          )}
          {products
            ?.filter((product) => product.id !== id)
            .map((item) => (
              <Card {...item} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedProduct;
