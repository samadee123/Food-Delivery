import React, { useContext, useState } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Cart() {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);
  const navigate = useNavigate();

  // State to store coupon code and discount value
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  // Function to apply coupon
  const applyCoupon = async () => {
    try {
      const response = await axios.post(`${url}/api/coupons/validate`, { code: couponCode });
      if (response.data.success) {
        setDiscount(response.data.discount); // Ensure this stores the percentage
        setCouponError('');
      } else {
        setDiscount(0);
        setCouponError('Invalid Coupon Code');
      }
    } catch (error) {
      console.error(error);
      setCouponError('Error validating coupon');
    }
  };


  const discountAmount = (getTotalCartAmount() * discount) / 100;
  const discountedTotal = Math.max(getTotalCartAmount() - discountAmount, 0);
  const finalTotal = discountedTotal + (discountedTotal > 0 ? 2 : 0);


  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className='cart-items-title cart-items-item'>
                  <img src={url + "/images/" + item.image} alt="" />
                  <p>{item.name}</p>
                  <p>Rs. {item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>Rs. {item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>Rs. {getTotalCartAmount()}</p>
            </div>
            <hr />
            {discount > 0 && (
              <>
                <div className="cart-total-details">
                  <p>Discount ({discount}%)</p>
                  <p>- Rs. {(getTotalCartAmount() * discount) / 100}</p>
                </div>
                <hr />
              </>
            )}
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>Rs. {getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>Rs. {finalTotal}</b>
            </div>
          </div>
          <button
            onClick={() => {
              console.log("Navigating with Discount:", discount, "Discount Amount:", discountAmount);
              navigate('/order', {
                state: {
                  discount,  // <-- This should be the percentage (e.g., 20)
                  discountAmount,  // <-- This should be the calculated discount (e.g., 4)
                  discountedTotal // <-- This should be subtotal - discountAmount
                }
              });
            }}
          >
            PROCEED TO CHECKOUT
          </button>

        </div>

        {/* Coupon Code Section */}
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className="cart-promocode-input">
              <input
                type="text"
                placeholder="Enter promo code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button onClick={applyCoupon}>Submit</button>
            </div>
            {couponError && <p className="coupon-error">{couponError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;