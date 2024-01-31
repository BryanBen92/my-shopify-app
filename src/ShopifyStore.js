import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ShopifyStore.css';

const ShopifyStore = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    availability: true,
  });
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: '',
  });
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    zip: '',
    country: '',
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  useEffect(() => {
    // Fetch products from the backend
    fetchProducts();
  }, []);

  // Function to handle product click
  const handleProductClick = (productId) => {
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product);
  };

  // Function to add product to the cart
  const handleAddToCart = () => {
    if (selectedProduct) {
      const existingItem = cart.find(item => item.id === selectedProduct.id);

      if (existingItem) {
        setCart(prevCart => prevCart.map(item => 
          item.id === selectedProduct.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      } else {
        setCart(prevCart => [...prevCart, { ...selectedProduct, quantity: 1 }]);
      }

      setSelectedProduct(null);
    }
  };

  // Function to update quantity in the cart
  const handleUpdateQuantity = (productId, newQuantity) => {
    setCart(prevCart => prevCart.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Function to remove product from the cart
  const handleRemoveFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Function to handle input change for creating new products
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewProduct(prevProduct => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  // Function to create a new product
  const handleCreateProduct = () => {
    axios.post(
      'http://localhost:3001/api/products',
      {
        title: newProduct.title,
        description: newProduct.description,
        price: newProduct.price,
        availability: newProduct.availability,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then(response => {
        // Handle successful product creation
        console.log('Product created successfully:', response.data.product);
        setNewProduct({
          title: '',
          description: '',
          price: '',
          availability: true,
        });
        // Fetch updated product list after creating a new product
        fetchProducts();
      })
      .catch(error => {
        console.error('Error creating product:', error);
      });
  };

  // Function to fetch products
  const fetchProducts = () => {
    axios.get('http://localhost:3001/api/products')
      .then(response => {
        setProducts(response.data.products);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  };

  // Function to delete a product
  const handleDeleteProduct = (productId) => {
    axios.delete(`http://localhost:3001/api/products/${productId}`)
      .then(response => {
        // Handle successful product deletion
        console.log('Product deleted successfully:', productId);
      })
      .catch(error => {
        console.error('Error deleting product:', error);
      });
  };

  // Function to handle input change for customer information
  const handleInputChangeCustomerInfo = (event) => {
    const { name, value } = event.target;
    setCustomerInfo(prevInfo => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  // Function to handle input change for shipping information
  const handleInputChangeShippingInfo = (event) => {
    const { name, value } = event.target;
    setShippingInfo(prevInfo => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  // Function to place an order
  const handlePlaceOrder = async () => {
    try {
      // Simulate order processing (in a real-world scenario, this would involve more steps)
      const orderDetails = {
        customer: customerInfo,
        products: cart,
        shipping: shippingInfo,
      };

      console.log('Placing order:', orderDetails);

      // Simulate API call to place an order
      await axios.post('http://localhost:3001/api/orders', orderDetails);

      // Fetch updated product list after placing the order
      console.log('Fetching updated product list...');
      await fetchProducts();

      // Clear cart, customer info, and shipping info after placing the order
      setCart([]);
      setCustomerInfo({
        name: '',
        email: '',
        address: '',
      });
      setShippingInfo({
        address: '',
        city: '',
        zip: '',
        country: '',
      });

      // Display a message to the user (you can use a toast or any other UI component)
      alert('Order placed successfully');
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  // Function to handle payment
  const handlePayment = async () => {
    try {
      if (!selectedPaymentMethod) {
        alert('Please select a payment method.');
        return;
      }

      // In a real application, you would send payment details to your server for processing
      // and handle the actual payment processing securely on the server.

      alert('Payment successful!');
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed. Please try again.');
    }
  };

  // Function to handle proceeding to payment
  const handleProceedToPayment = () => {
    // Add any additional checks or validations before proceeding to payment
    if (cart.length === 0) {
      alert('Your cart is empty. Add items to proceed to payment.');
      return;
    }

    // Perform any necessary actions before proceeding to payment

    // For now, just proceed to payment
    handlePayment();
  };

  return (
    <div>
      <h1>Shopify Store</h1>

      <div>
        {/* Product List */}
        <div className="product-list">
          <h2>Product List</h2>
          <ul>
            {products && products.map(product => (
              <li key={product.id} onClick={() => handleProductClick(product.id)}>
                {product.title} - ${product.price}
              </li>
            ))}
          </ul>
        </div>

        {/* Product Details */}
        {selectedProduct && (
          <div className="product-details">
            <h2>Product Details</h2>
            <img src={selectedProduct.imageUrl} alt={selectedProduct.title} />
            <p>{selectedProduct.title}</p>
            <p>${selectedProduct.price}</p>
            <button onClick={handleAddToCart}>Add to Cart</button>
          </div>
        )}

        {/* Create New Product */}
        <div className="create-product">
          <h2>Create New Product</h2>
          <label>Title:
            <input type="text" name="title" value={newProduct.title} onChange={handleInputChange} />
          </label>
          <label>Description:
            <input type="text" name="description" value={newProduct.description} onChange={handleInputChange} />
          </label>
          <label>Price:
            <input type="number" name="price" value={newProduct.price} onChange={handleInputChange} />
          </label>
          <label>Availability:
            <input type="checkbox" name="availability" checked={newProduct.availability} onChange={handleInputChange} />
          </label>
          <button onClick={handleCreateProduct}>Create Product</button>
        </div>

        {/* Delete Product */}
        {selectedProduct && (
          <div className="delete-product">
            <h2>Delete Product</h2>
            <p>Are you sure you want to delete {selectedProduct.title}?</p>
            <button onClick={() => handleDeleteProduct(selectedProduct.id)}>Delete</button>
          </div>
        )}

        {/* Shopping Cart */}
        <div className="cart">
          <h2>Shopping Cart</h2>
          <ul>
            {cart.map(item => (
              <li key={item.id}>
                {item.title} - ${item.price} - Quantity: 
                <input 
                  type="number" 
                  value={item.quantity} 
                  min="1" 
                  onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value, 10))}
                />
                <button onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Add to Cart Section */}
        {selectedProduct && (
          <div className="add-to-cart-section">
            <h2>Add to Cart</h2>
            <p>{selectedProduct.title} has been added to your cart.</p>
          </div>
        )}

        {/* Order Details */}
        <div className="order-details">
          <h3>Customer Information</h3>
          <label>Name:
            <input type="text" name="name" value={customerInfo.name} onChange={handleInputChangeCustomerInfo} />
          </label>
          <label>Email:
            <input type="email" name="email" value={customerInfo.email} onChange={handleInputChangeCustomerInfo} />
          </label>
          <label>Address:
            <input type="text" name="address" value={customerInfo.address} onChange={handleInputChangeCustomerInfo} />
          </label>
        </div>

        <div className="shipping-info">
          <h3>Shipping Information</h3>
          <label>Address:
            <input type="text" name="address" value={shippingInfo.address} onChange={handleInputChangeShippingInfo} />
          </label>
          <label>City:
            <input type="text" name="city" value={shippingInfo.city} onChange={handleInputChangeShippingInfo} />
          </label>
          <label>ZIP Code:
            <input type="text" name="zip" value={shippingInfo.zip} onChange={handleInputChangeShippingInfo} />
          </label>
          <label>Country:
            <input type="text" name="country" value={shippingInfo.country} onChange={handleInputChangeShippingInfo} />
          </label>
        </div>

        {/* Payment Section */}
        <div className="payment-section">
          <h2>Payment</h2>
          <p>Choose a payment method:</p>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="creditCard"
              checked={selectedPaymentMethod === 'creditCard'}
              onChange={() => setSelectedPaymentMethod('creditCard')}
            />
            Credit Card
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={selectedPaymentMethod === 'paypal'}
              onChange={() => setSelectedPaymentMethod('paypal')}
            />
            PayPal
          </label>
          <button onClick={handleProceedToPayment}>Proceed to Payment</button>
        </div>

        {/* Place Order Button */}
        <button onClick={handlePlaceOrder}>Place Order</button>
      </div>
    </div>
  );
};

export default ShopifyStore;
