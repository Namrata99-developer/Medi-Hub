import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, EyeOff, LogOut, User, Home } from 'lucide-react';

function App() {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("home"); // "home" or "profile"
  const [cart, setCart] = useState([]); // Stores items for the profile

  // --- Login & UI States ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  useEffect(() => {
    if (isLoggedIn) {
      fetchMedicines();
    }
  }, [isLoggedIn]);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/medicines');
      setMedicines(response.data);
    } catch (error) {
      console.error("Error fetching medicines", error);
    }
  };

  const handleAddToCart = async (med) => {
    if (med.stock <= 0) {
      alert("Out of Stock!");
      return;
    }
    try {
      await axios.put(`http://localhost:8080/api/medicines/reduce/${med.id}/1`);
      
      // Update local Cart state for the Profile Page
      setCart((prevCart) => {
        const existingItem = prevCart.find(item => item.id === med.id);
        if (existingItem) {
          return prevCart.map(item =>
            item.id === med.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prevCart, { ...med, quantity: 1 }];
      });

      alert(`Added ${med.name} to cart!`);
      fetchMedicines(); 
    } catch (error) {
      alert("Error updating stock.");
    }
  };

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- COMPONENT: PROFILE PAGE ---
  const ProfilePage = () => (
    <div style={{ padding: '40px' }}>
      <h1>👤 User Profile</h1>
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9', marginBottom: '20px' }}>
        <p><strong>Email:</strong> {loginData.email}</p>
        <p><strong>Status:</strong> Active Customer</p>
      </div>

      <h2>🛒 Your Cart Items</h2>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
        <thead>
          <tr style={{ backgroundColor: '#eee' }}>
            <th style={{ padding: '10px' }}>Medicine</th>
            <th style={{ padding: '10px' }}>Price</th>
            <th style={{ padding: '10px' }}>Quantity</th>
            <th style={{ padding: '10px' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => (
            <tr key={index}>
              <td style={{ padding: '10px' }}>{item.name}</td>
              <td style={{ padding: '10px' }}>${item.price}</td>
              <td style={{ padding: '10px' }}>{item.quantity}</td>
              <td style={{ padding: '10px' }}>${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {cart.length === 0 && <p style={{ textAlign: 'center', marginTop: '10px' }}>Your cart is empty.</p>}
      <h3 style={{ textAlign: 'right', marginTop: '20px' }}>
        Grand Total: ${cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}
      </h3>
    </div>
  );

  // --- CONDITION: SHOW LOGIN IF NOT LOGGED IN ---
  if (!isLoggedIn) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '10px', textAlign: 'center', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}>
        <h2>💊 Medi-Hub Login</h2>
        <input
          type="email"
          placeholder="Email Address"
          style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc' }}
          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
        />
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          />
          <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '10px', cursor: 'pointer', color: '#666' }}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>
        <button onClick={() => setIsLoggedIn(true)} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Login
        </button>
      </div>
    );
  }

  // --- FINAL RETURN: NAVBAR + SWITCHABLE CONTENT ---
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {/* 1. Navbar (Always Visible) */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 40px', backgroundColor: '#007bff', color: 'white' }}>
        <h2 onClick={() => setView("home")} style={{ cursor: 'pointer', margin: 0 }}>🏥 Medi-Hub</h2>
        <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
          <Home onClick={() => setView("home")} style={{ cursor: 'pointer' }} size={24} />
          <div onClick={() => setView("profile")} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <User size={24} />
            <span style={{ fontWeight: 'bold' }}>Profile</span>
          </div>
          <LogOut onClick={() => setIsLoggedIn(false)} style={{ cursor: 'pointer' }} size={24} />
        </div>
      </nav>

      {/* 2. Switch between Home (Table) and Profile */}
      {view === "home" ? (
        <div style={{ padding: '40px' }}>
          <h1>🏥 Medicine Inventory</h1>
          
          <div style={{ margin: '20px 0' }}>
            <h3>Search for Medicine</h3>
            <input
              type="text"
              placeholder="🔍 Search for medicine..."
              style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                <th style={{ padding: '10px' }}>Name</th>
                <th style={{ padding: '10px' }}>Category</th>
                <th style={{ padding: '10px' }}>Price</th>
                <th style={{ padding: '10px' }}>Stock Status</th>
                <th style={{ padding: '10px' }}>Action</th>
              </tr>
            </thead>
            <tbody style={{ textAlign: 'center' }}>
              {filteredMedicines.map((med) => (
                <tr key={med.id}>
                  <td style={{ padding: '10px' }}>{med.name}</td>
                  <td style={{ padding: '10px' }}>{med.category}</td>
                  <td style={{ padding: '10px' }}>${med.price}</td>
                  <td style={{ padding: '10px' }}>
                    {med.stock > 0 ? (
                      <span style={{ color: 'green', fontWeight: 'bold' }}>In Stock ({med.stock})</span>
                    ) : (
                      <span style={{ color: 'red', fontWeight: 'bold' }}>Not Available</span>
                    )}
                  </td>
                  <td style={{ padding: '10px' }}>
                    <button
                      onClick={() => handleAddToCart(med)}
                      disabled={med.stock <= 0}
                      style={{
                        backgroundColor: med.stock > 0 ? '#ffc107' : '#ccc',
                        cursor: med.stock > 0 ? 'pointer' : 'not-allowed',
                        border: 'none', padding: '8px 15px', borderRadius: '4px', fontWeight: 'bold'
                      }}
                    >
                      Add to Cart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredMedicines.length === 0 && (
            <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>No medicines found.</p>
          )}
        </div>
      ) : (
        /* If view is not "home", show the Profile Page */
        <ProfilePage />
      )}
    </div>
  );
}

export default App;