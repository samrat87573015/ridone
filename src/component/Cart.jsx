import React, { useState } from 'react';
import Banner from "./image/banner.png";
import apiClient from './config';

function Cart({ product, Setting }) {
    console.log(product);
    const [quantity, setQuantity] = useState(1);
    const [shippingCost, setShippingCost] = useState(Setting?.delivery_charge_inside);

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        payment_method: 'Cash on Delivery',
        shipping_area: 'inside',
        coupon_code: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [couponCode, setCouponCode] = useState('');

    // State for selected attributes
    const [selectedSize, setSelectedSize] = useState('S');
    const [selectedColor, setSelectedColor] = useState(null);

    const handleIncrement = () => setQuantity(prevQuantity => prevQuantity + 1);
    const handleDecrement = () => setQuantity(prevQuantity => Math.max(prevQuantity - 1, 1));

    const totalPrice = product?.price * quantity;
    const finalTotal = totalPrice + shippingCost;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCouponChange = (e) => {
        setCouponCode(e.target.value);
    };

    const handleApplyCoupon = async (e) => {
        e.preventDefault();
        alert('Coupon application functionality to be implemented');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const orderData = {
                ...formData,
                product_id: product?.id,
                quantity,
                shipping_cost: shippingCost,
                shipping_area: shippingCost === Setting?.delivery_charge_inside ? 'inside' : 'outside',
                total_price: finalTotal,
                coupon_code: couponCode,
                size: selectedSize,
                color: selectedColor
            };

            const response = await apiClient.post('/api-orders', orderData);

            if (response.status === 201) {
                alert('Order placed successfully!');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    // CSS styles for selected options
    const getOptionStyle = (selected, option) => ({
        backgroundColor: selected === option ? '#07af00' : 'unset',
        color: selected === option ? '#fff' : '#000',
        padding: '10px 20px',
        cursor: 'pointer',
        borderRadius: '5px',
        border: selected === option ? '1px solid #b6ffd5' : 'unset',
        display: 'flex',
    alignItems: 'center',
    fontWeight: 700,
    height: '28px'
    });

    return (
        <>
            <div className='cart-section'>
                <div className='cart-container'>
                    <div className='row'>
                        <div className='col-md-12'>
                            <h5 className='title'>অর্ডারটি কনফার্ম করতে আপনার নাম, ঠিকানা, মোবাইল নাম্বার লিখে অর্ডার কনফার্ম করুন বাটনে ক্লিক করুন অর্ডার কনফার্ম করুন বাটনে ক্লিক করুন
                            </h5>
                            <form onSubmit={handleSubmit} className='mt-5'>
                                <div className='col-md-12 row'>
                                    <div className='col-md-6'>

                                   
                                        <div className="mb-3">
                                            <label>আপনার নাম <span style={{ color: "red" }}>*</span></label>
                                            <input 
                                                type="text" 
                                                className="form-control custom-input mt-2" 
                                                placeholder="আপনার নাম লিখুন" 
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required 
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label> আপনার ঠিকানা। <span style={{ color: "red" }}>*</span></label>
                                            <input 
                                                type="text" 
                                                className="form-control custom-input mt-2" 
                                                placeholder="বাসা নং, রোড নং, থানা, জেলা " 
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                required 
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label> মোবাইল নাম্বার <span style={{ color: "red" }}> *</span></label>
                                            <input 
                                                type="text" 
                                                className="form-control custom-input mt-2" 
                                                placeholder="আপনার মোবাইল নং লিখুন " 
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                required 
                                            />
                                        </div>

                                        <div className='shippingoption mt-3'>
                       
                       <div className="form-check">
                           <input 
                               type="radio" 
                               className="form-check-input" 
                               name="payment_method"
                               value="Cash on Delivery"
                               checked={formData.payment_method === 'Cash on Delivery'}
                               onChange={handleInputChange}
                           />
                           <label className="form-check-label">Cash on Delivery</label>
                       </div>
                      </div>

                                        <div className='d-flex attributes mt-3'>
                                        <p>Size</p>
                                        <div className="d-flex">
                                            {['S', 'M', 'L', 'XXL'].map(size => (
                                                <div 
                                                    key={size} 
                                                    style={getOptionStyle(selectedSize, size)} 
                                                    onClick={() => setSelectedSize(size)}
                                                >
                                                    {size}
                                                </div>
                                            ))}
                                        </div>
                                        </div>

                                        {/* <p>Color</p>
                                        <div className="d-flex">
                                            {['Red', 'Blue', 'Green', 'Black'].map(color => (
                                                <div 
                                                    key={color} 
                                                    style={getOptionStyle(selectedColor, color)} 
                                                    onClick={() => setSelectedColor(color)}
                                                >
                                                    {color}
                                                </div>
                                            ))}
                                        </div> */}

                                     
                                        <div className='shippingoption mt-3'>
                                 
                                        <div className="form-check" onClick={() => setShippingCost(Setting?.delivery_charge_inside)}>
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                name="shipping"
                                                value={Setting?.delivery_charge_inside}
                                                checked={shippingCost === Setting?.delivery_charge_inside}
                                                onChange={() => setShippingCost(Setting?.delivery_charge_inside)}
                                            />
                                            <label className="form-check-label" >INSIDE DHAKA</label>
                                        </div>
                                        <div className="form-check" onClick={() => setShippingCost(Setting?.delivery_charge_outside)}>
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                name="shipping"
                                                value={Setting?.delivery_charge_outside}
                                                checked={shippingCost === Setting?.delivery_charge_outside}
                                                onChange={() => setShippingCost(Setting?.delivery_charge_outside)}
                                            />
                                            <label className="form-check-label"  >OUTSIDE DHAKA</label>
                                        </div>
                                        </div>
                                       
                                    </div>

                                    <div className='col-md-6'>
                                    <h5>Your Products</h5>
                                   
                                    <div className='product-section mt-3 p-3'>
                                        <div className="d-flex justify-content-start align-items-center">
                                            <img src={product?.featured_image || Banner} className='img-fluid' style={{ width: "50px", height: "50px" }} alt="Product" />
                                            <label className="form-check-label ms-3"> {product?.name.slice(0, 12)}... </label>
                                            <div className="quantity-controls d-flex align-items-center">
                                        <button type="button" className='btn decr' onClick={handleDecrement}>-</button>
                                        <span className='mx-3'>{quantity}</span>
                                        <button type="button" className='btn incr' onClick={handleIncrement}>+</button>
                                    </div>
                                            <span className='ms-3'>{product?.price} TK</span>
                                        </div>
                                    </div>
                                    <h5 className='mt-3'>Your Order</h5>
                                    <div className='order-section p-3'>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <label>Product</label>
                                            <span>Subtotal</span>
                                        </div>
                                        <div className='mt-3' style={{ borderBottom: "2px dashed black" }}></div>
                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <label>{product?.name}</label>
                                            <span>{product?.price} x {quantity} TK</span>
                                        </div>
                                        <div className='mt-3' style={{ borderBottom: "2px dashed black" }}></div>
                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <label style={{ color: "gray" }}>Subtotal</label>
                                            <span style={{ color: "gray" }}>{totalPrice} TK</span>
                                        </div>
                                        <div className='mt-3' style={{ borderBottom: "2px dashed black" }}></div>
                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <label>Shipping cost</label>
                                            <span>{shippingCost} TK</span>
                                        </div>
                                        <div className='mt-3' style={{ borderBottom: "2px dashed black" }}></div>
                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <label>Total</label>
                                            <span>{finalTotal} TK</span>
                                        </div>
                                        <div className='d-flex justify-content-between align-items-center mt-3' style={{ gap: "15px" }}>
                                            <input 
                                                type='text' 
                                                className='form-control custom-input' 
                                                placeholder='Coupon Code'
                                                value={couponCode}
                                                onChange={handleCouponChange}
                                            />
                                            <button 
                                                type="button"
                                                className='btn custom-btn btn-cuppon-apply'
                                                onClick={handleApplyCoupon}
                                            >
                                                Apply
                                            </button>
                                        </div>
                                        
                                    </div>
                                </div>
                                </div>

                                <button 
                                            type="submit" 
                                            className='btn custom-btn w-100 mt-3 btn-submit'
                                            disabled={loading}
                                        >
                                            <span style={{ fontSize: "25px" }}>
                                                {loading ? 'Processing...' : 'অর্ডার নিশ্চিত করুন'}
                                            </span>
                                        </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Cart;
