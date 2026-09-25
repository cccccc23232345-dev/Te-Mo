import React from 'react';
import './ProductDetail.css';

const reviewTemplates = [
  ['Maya R.', 'The quality is better than I expected for the price. It arrived quickly and works exactly as described.'],
  ['Jordan T.', 'A genuinely useful little upgrade. The design feels thoughtful and it is easy to use right away.'],
  ['Casey L.', 'I bought this on a whim and ended up using it every day. Great value and a clean, practical design.'],
];

const detailCopy = {
  Tech: 'Designed for modern routines, this compact tech essential keeps the useful features close at hand without taking over your desk or bag.',
  Home: 'A small home upgrade with a surprisingly big effect on your daily routine. It is easy to place, simple to use, and made for repeat use.',
  Beauty: 'A practical addition to your routine, chosen for an easy application and a polished result without unnecessary fuss.',
  Gaming: 'Made for quick sessions and easy fun, this pick brings a playful touch to your setup while staying simple to enjoy.',
  Lifestyle: 'Thoughtful, portable, and ready for everyday use, this is the kind of small find that earns its place quickly.',
  Trending: 'A customer-favorite find selected for everyday usefulness, approachable design, and a little extra delight.',
};

export default function ProductDetail({ product, onBack, onAddToCart }) {
  const description = detailCopy[product.category] ?? detailCopy.Trending;
  const reviewCount = product.sold + 37;

  return (
    <main className="product-detail-page">
      <button className="detail-back-button" type="button" onClick={onBack}>
        <span aria-hidden="true">&lt;-</span> Back to all deals
      </button>

      <section className="product-detail-hero" aria-labelledby="product-detail-title">
        <div className="product-detail-image-wrap">
          <img src={product.image} alt={product.name} />
          <span className="product-detail-category">{product.category}</span>
        </div>
        <div className="product-detail-summary">
          <span className="sale-badge">DEAL PRICE</span>
          <p className="product-detail-eyebrow">TeMo customer favorite</p>
          <h1 id="product-detail-title">{product.name}</h1>
          <div className="detail-rating" aria-label={`${product.rating} out of 5 stars from ${reviewCount} reviews`}>
            <strong>★ {product.rating}</strong>
            <span>{reviewCount} reviews</span>
            <span>{product.sold}+ sold</span>
          </div>
          <p className="product-detail-price"><s>{product.originalUsd}</s> {product.usd}</p>
          <p className="product-detail-description">{product.description} {description}</p>
          <ul className="detail-benefits">
            <li>Free shipping on this deal</li>
            <li>Secure crypto checkout</li>
            <li>Easy to gift, keep, or upgrade</li>
          </ul>
          <button className="add-cart-btn detail-add-button" type="button" onClick={() => onAddToCart(product)}>
            Add to cart <span aria-hidden="true">+</span>
          </button>
        </div>
      </section>

      <section className="product-detail-info" aria-labelledby="product-details-heading">
        <div className="detail-description">
          <p className="detail-section-kicker">The details</p>
          <h2 id="product-details-heading">Small find, well considered.</h2>
          <p>{description} The clean format makes it easy to fit into your existing setup, while the approachable price makes trying something new feel effortless.</p>
          <p>Whether it is for your own routine or a useful gift, this is a dependable everyday pick with the kind of finish that feels good to reach for.</p>
        </div>
        <div className="detail-specs">
          <p className="detail-section-kicker">At a glance</p>
          <dl>
            <div><dt>Category</dt><dd>{product.category}</dd></div>
            <div><dt>Delivery</dt><dd>Free shipping</dd></div>
            <div><dt>Payment</dt><dd>Crypto checkout</dd></div>
            <div><dt>Popularity</dt><dd>{product.sold}+ sold</dd></div>
          </dl>
        </div>
      </section>

      <section className="product-reviews" aria-labelledby="reviews-heading">
        <div className="reviews-heading">
          <div>
            <p className="detail-section-kicker">From the community</p>
            <h2 id="reviews-heading">A few words from shoppers</h2>
          </div>
          <div className="reviews-score"><strong>★ {product.rating}</strong><span>{reviewCount} reviews</span></div>
        </div>
        <div className="review-grid">
          {reviewTemplates.map(([name, text]) => (
            <article className="review-card" key={name}>
              <div className="review-stars" aria-label="5 out of 5 stars">★★★★★</div>
              <p>“{text}”</p>
              <strong>{name}</strong>
              <span>Verified shopper</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
