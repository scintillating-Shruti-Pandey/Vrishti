import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiUpload } from 'react-icons/fi';
import api from '../../utils/api';
import '../../pages/Pages.css';

const CATEGORY_GROUPS = {
  "Women - Western": ['Tops', 'Dresses', 'Tshirts', 'Jeans', 'Shirts', 'Skirts'],
  "Women - Ethnic": ['Sarees', 'Kurtas', 'Lehanga Choli', 'Gopi Dresses', 'Ethnic Dresses'],
  "Women - Girls": ['Dresses', 'Tshirts', 'Kurta Sets', 'Tops', 'Lehanga Choli', 'Gopi Dresses', 'Jeans', 'Co-Ords'],
  "Men - Casual": ['Tshirts', 'Shirts', 'Trousers', 'Jeans', 'Sweatshirts', 'Shorts', 'Jackets'],
  "Men - Ethnic": ['Dhoti Kurta Sets', 'Blazers', 'Suits', 'Sherwani'],
  "Men - Boys": ['Tshirts', 'Shirts', 'Jeans', 'Sweatshirts', 'Shorts', 'Jackets', 'Dhoti Kurta Sets']
};
const GENDERS = ['Men', 'Women', 'Boys', 'Girls', 'Unisex'];
const AGE_GROUPS = ['Kids (2-12)', 'Teens (13-19)', 'Adults (20+)'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'FS'];

export default function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', description: '', price: '', category: 'Tops', gender: 'Women',
    material: 'Cotton', brand: 'Vrishti', featured: false,
  });
  const [selectedAgeGroups, setSelectedAgeGroups] = useState(['Adults (20+)']);
  const [selectedSizes, setSelectedSizes] = useState(['M', 'L']);
  const [colors, setColors] = useState([{ name: 'Black', hex: '#1a1a1a', stock: '50', images: [] }]);
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleAgeGroup = (age) => {
    setSelectedAgeGroups((prev) =>
      prev.includes(age) ? prev.filter((a) => a !== age) : [...prev, age]
    );
  };

  const addColor = () => setColors([...colors, { name: '', hex: '#000000', stock: '50', images: [] }]);
  const updateColor = (i, field, value) => {
    const updated = [...colors];
    updated[i][field] = value;
    setColors(updated);
  };
  const updateColorImage = (i, files) => {
    const updated = [...colors];
    updated[i].images = Array.from(files);
    setColors(updated);
  };
  const removeColor = (i) => setColors(colors.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) { toast.warning('Name and price are required'); return; }
    if (selectedSizes.length === 0) { toast.warning('Select at least one size'); return; }

    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      formData.append('ageGroup', JSON.stringify(selectedAgeGroups));
      formData.append('sizes', JSON.stringify(selectedSizes));
      
      const colorsJson = colors.filter((c) => c.name).map(({ name, hex, stock }) => ({ name, hex, stock: Number(stock) || 0 }));
      formData.append('colors', JSON.stringify(colorsJson));
      
      colors.forEach((c, index) => {
        if (c.images && c.images.length > 0) {
          c.images.forEach((img) => formData.append(`color_images_${index}`, img));
        }
      });

      images.forEach((img) => formData.append('images', img));

      await api.post('/admin/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Product added! 🎉');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: 'var(--space-8)' }}>Add New Product</h1>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="input-group input-group--full">
            <label>Product Name *</label>
            <input className="input-field" name="name" value={form.name} onChange={handleChange} placeholder="Monsoon Breeze Cotton Tee" required />
          </div>

          <div className="input-group input-group--full">
            <label>Description *</label>
            <textarea className="input-field" name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe the product..." required />
          </div>

          <div className="input-group">
            <label>Price (₹) *</label>
            <input className="input-field" name="price" type="number" value={form.price} onChange={handleChange} placeholder="999" required />
          </div>



          <div className="input-group">
            <label>Category</label>
            <select className="input-field" name="category" value={form.category} onChange={handleChange}>
              {Object.entries(CATEGORY_GROUPS).map(([group, cats]) => (
                <optgroup key={group} label={group}>
                  {cats.map((c) => <option key={`${group}-${c}`} value={c}>{c}</option>)}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Gender</label>
            <select className="input-field" name="gender" value={form.gender} onChange={handleChange}>
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div className="input-group input-group--full">
            <label>Age Groups</label>
            <div className="filter-sizes">
              {AGE_GROUPS.map((a) => (
                <button
                  key={a} type="button"
                  className={`filter-size-btn ${selectedAgeGroups.includes(a) ? 'filter-size-btn--active' : ''}`}
                  onClick={() => toggleAgeGroup(a)}
                >{a}</button>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label>Material</label>
            <input className="input-field" name="material" value={form.material} onChange={handleChange} />
          </div>

          <div className="input-group input-group--full">
            <label>Sizes</label>
            <div className="filter-sizes">
              {SIZES.map((s) => (
                <button
                  key={s} type="button"
                  className={`filter-size-btn ${selectedSizes.includes(s) ? 'filter-size-btn--active' : ''}`}
                  onClick={() => toggleSize(s)}
                >{s}</button>
              ))}
            </div>
          </div>

          <div className="input-group input-group--full">
            <label>Colors</label>
            {colors.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
                <input className="input-field" placeholder="Color name" value={c.name} onChange={(e) => updateColor(i, 'name', e.target.value)} style={{ flex: 1, minWidth: 150 }} />
                <input type="color" value={c.hex} onChange={(e) => updateColor(i, 'hex', e.target.value)} style={{ width: 50, height: 42, border: 'none', cursor: 'pointer' }} />
                <input type="number" placeholder="Stock" className="input-field" value={c.stock} onChange={(e) => updateColor(i, 'stock', e.target.value)} style={{ width: 80 }} />
                <input type="file" multiple accept="image/*" onChange={(e) => updateColorImage(i, e.target.files)} className="input-field" style={{ flex: 2, minWidth: 200 }} />
                {c.images?.length > 0 && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{c.images.length} file(s)</span>}
                {colors.length > 1 && <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeColor(i)}>✕</button>}
              </div>
            ))}
            <button type="button" className="btn btn-ghost btn-sm" onClick={addColor} style={{ alignSelf: 'flex-start' }}>+ Add Color</button>
          </div>

          <div className="input-group input-group--full">
            <label>Product Images</label>
            <input type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files))} className="input-field" />
            {images.length > 0 && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{images.length} file(s) selected</p>}
          </div>

          <div className="input-group input-group--full">
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
              Featured Product (shown on homepage)
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            <FiUpload size={18} /> {saving ? 'Adding Product...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
