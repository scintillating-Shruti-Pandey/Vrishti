import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiSave } from 'react-icons/fi';
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

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', description: '', price: '', category: 'Tops', gender: 'Women',
    material: 'Cotton', brand: 'Vrishti', featured: false,
  });
  const [selectedAgeGroups, setSelectedAgeGroups] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        const p = data.product;
        setForm({
          name: p.name, description: p.description, price: p.price, category: p.category,
          gender: p.gender, material: p.material || 'Cotton', brand: p.brand || 'Vrishti', featured: p.featured || false,
        });
        setSelectedAgeGroups(p.ageGroup || []);
        setSelectedSizes(p.sizes || []);
        setColors(p.colors?.length > 0 ? p.colors.map(c => ({...c, newImages: [], images: c.images || [], stock: c.stock || 0})) : [{ name: 'Black', hex: '#1a1a1a', stock: '50', newImages: [], images: [] }]);
        setExistingImages(p.images || []);
      } catch (err) {
        toast.error('Failed to load product');
        navigate('/admin');
      }
    };
    fetchProduct();
  }, [id, navigate]);

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

  const addColor = () => setColors([...colors, { name: '', hex: '#000000', stock: '50', newImages: [], images: [] }]);
  const updateColor = (i, field, value) => {
    const updated = [...colors];
    updated[i][field] = value;
    setColors(updated);
  };
  const updateColorImage = (i, files) => {
    const updated = [...colors];
    updated[i].newImages = Array.from(files);
    setColors(updated);
  };
  const removeColorImage = (colorIdx, imgIdx) => {
    const updated = [...colors];
    updated[colorIdx].images.splice(imgIdx, 1);
    setColors(updated);
  };
  const removeColor = (i) => setColors(colors.filter((_, idx) => idx !== i));
  const removeMainImage = (i) => setExistingImages(existingImages.filter((_, idx) => idx !== i));

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
      
      const colorsJson = colors.filter((c) => c.name).map(({ name, hex, stock, images }) => ({ name, hex, stock: Number(stock) || 0, images }));
      formData.append('colors', JSON.stringify(colorsJson));
      
      colors.forEach((c, index) => {
        if (c.newImages && c.newImages.length > 0) {
          c.newImages.forEach((img) => formData.append(`color_images_${index}`, img));
        }
      });

      images.forEach((img) => formData.append('images', img));
      existingImages.forEach((img) => formData.append('images', img));
      
      await api.put(`/admin/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Product updated! 🎉');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: 'var(--space-8)' }}>Edit Product</h1>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="input-group input-group--full">
            <label>Product Name *</label>
            <input className="input-field" name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div className="input-group input-group--full">
            <label>Description *</label>
            <textarea className="input-field" name="description" value={form.description} onChange={handleChange} rows={4} required />
          </div>

          <div className="input-group">
            <label>Price (₹) *</label>
            <input className="input-field" name="price" type="number" value={form.price} onChange={handleChange} required />
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
              <div key={i} style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
                <input className="input-field" placeholder="Color name" value={c.name} onChange={(e) => updateColor(i, 'name', e.target.value)} style={{ flex: 1, minWidth: 150 }} />
                <input type="color" value={c.hex} onChange={(e) => updateColor(i, 'hex', e.target.value)} style={{ width: 50, height: 42, border: 'none', cursor: 'pointer' }} />
                <input type="number" placeholder="Stock" className="input-field" value={c.stock} onChange={(e) => updateColor(i, 'stock', e.target.value)} style={{ width: 80 }} />
                <input type="file" multiple accept="image/*" onChange={(e) => updateColorImage(i, e.target.files)} className="input-field" style={{ flex: 2, minWidth: 200 }} />
                {colors.length > 1 && <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeColor(i)}>✕</button>}
                
                <div style={{ width: '100%', display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                  {c.images?.map((imgUrl, imgIdx) => (
                    <div key={imgIdx} style={{ position: 'relative' }}>
                      <img src={api.defaults.baseURL.replace('/api', '') + imgUrl} alt="" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                      <button type="button" onClick={() => removeColorImage(i, imgIdx)} style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', borderRadius: '50%', width: 20, height: 20, fontSize: 12, border: 'none', cursor: 'pointer' }}>✕</button>
                    </div>
                  ))}
                  {c.newImages?.length > 0 && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', alignSelf: 'center' }}>+ {c.newImages.length} new file(s)</span>}
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-ghost btn-sm" onClick={addColor} style={{ alignSelf: 'flex-start' }}>+ Add Color</button>
          </div>

          <div className="input-group input-group--full">
            <label>Product Images (Main Gallery)</label>
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              {existingImages.map((imgUrl, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={api.defaults.baseURL.replace('/api', '') + imgUrl} alt="" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  <button type="button" onClick={() => removeMainImage(i)} style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', borderRadius: '50%', width: 20, height: 20, fontSize: 12, border: 'none', cursor: 'pointer' }}>✕</button>
                </div>
              ))}
            </div>
            <input type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files))} className="input-field" />
            {images.length > 0 && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{images.length} new file(s) selected</p>}
          </div>

          <div className="input-group input-group--full">
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
              Featured Product (shown on homepage)
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            <FiSave size={18} /> {saving ? 'Saving...' : 'Save Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
