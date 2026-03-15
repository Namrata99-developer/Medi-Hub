import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react'; // Import icons

function App() {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // --- NEW: Login & UI States ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const [formData, setFormData] = useState({
    name: '', category: '', price: '', stock: ''
  });

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
      // --- UNCOMMENTED: This now talks to your Java Backend ---
      await axios.put(`http://localhost:8080/api/medicines/reduce/${med.id}/1`);
      alert(`Added ${med.name} to cart!`);
      fetchMedicines(); // Refresh stock in the table
    } catch (error) {
      alert("Error updating stock. Did you add the PutMapping in Java?");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/medicines', formData);
      alert("Medicine Added Successfully!");
      setFormData({ name: '', category: '', price: '', stock: '' });
      fetchMedicines();
    } catch (error) {
      console.error("Error adding medicine:", error);
    }
  };

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- LOGIN VIEW ---
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
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: '10px', top: '10px', cursor: 'pointer', color: '#666' }}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <button
          onClick={() => setIsLoggedIn(true)}
          style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Login
        </button>
      </div>
    );
  }

  // --- MAIN DASHBOARD VIEW ---
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>🏥 Medi-Hub Pharmacy</h1>
        <button onClick={() => setIsLoggedIn(false)} style={{ padding: '5px 15px', cursor: 'pointer' }}>Logout</button>
      </div>

      {/* Admin Section */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <h3>Admin: Add New Medicine</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" style={{ marginRight: '5px' }} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <input type="text" placeholder="Category" style={{ marginRight: '5px' }} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
          <input type="number" placeholder="Price" style={{ marginRight: '5px' }} value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
          <input type="number" placeholder="Stock" style={{ marginRight: '5px' }} value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
          <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 15px', cursor: 'pointer' }}>Add Medicine</button>
        </form>
      </div>

      <hr />

      {/* Search Section */}
      <div style={{ margin: '20px 0' }}>
        <input
          type="text"
          placeholder="🔍 Search for medicine..."
          style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Inventory Table */}
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredMedicines.map((med) => (
            <tr key={med.id}>
              <td>{med.name}</td>
              <td>{med.category}</td>
              <td>${med.price}</td>
              <td>
                {med.stock > 0 ? (
                  <span style={{ color: 'green', fontWeight: 'bold' }}>In Stock ({med.stock})</span>
                ) : (
                  <span style={{ color: 'red', fontWeight: 'bold' }}>Not Available</span>
                )}
              </td>
              <td>
                <button
                  onClick={() => handleAddToCart(med)}
                  disabled={med.stock <= 0}
                  style={{
                    backgroundColor: med.stock > 0 ? '#ffc107' : '#ccc',
                    cursor: med.stock > 0 ? 'pointer' : 'not-allowed',
                    border: 'none', padding: '5px 10px', borderRadius: '4px'
                  }}
                >
                  Add to Cart
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;