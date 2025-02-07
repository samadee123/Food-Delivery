import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name, price, description, image }) => {
    const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

    // Ensure all required props are available
    if (!id || !name || !price || !image) {
        return <p>Loading item...</p>; // Avoid breaking the app if data is missing
    }

    return (
        <div className='food-item'>
            <div className="food-item-img-container">
                <img className='food-item-image' src={url ? `${url}/images/${image}` : assets.placeholder} alt={name} />

                {!cartItems[id] ? (
                    <img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt="Add to cart" />
                ) : (
                    <div className='food-item-counter'>
                        <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="Remove from cart" />
                        <p>{cartItems[id]}</p>
                        <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="Add more" />
                    </div>
                )}
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="Rating" />
                </div>
                <p className="food-item-desc">{description || "No description available."}</p>
                <p className="food-item-price">Rs. {price.toFixed(2)}</p> {/* Ensures two decimal places */}
            </div>
        </div>
    );
}

export default FoodItem;
