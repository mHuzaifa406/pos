//// filepath: /C:/Users/Huzaifa/OneDrive/Desktop/Project POS/client/src/components/newOrder.jsx
import React, { useState, useEffect } from 'react';
import './newOrder.css';
import Header from './header';
import axios from 'axios';
import apis from '../utils/api';
import toast from 'react-hot-toast';

const NewOrder = () => {
  const [colorSearchTerm, setColorSearchTerm] = useState("");

  const [activeDesignId, setActiveDesignId] = useState(null);
  const [designItemName, setDesignItemName] = useState("");
  const [currentDateTime] = useState(new Date().toLocaleString());
  const [selectedPayment, setSelectedPayment] = useState('');
  const [took, settook] = useState('');
  const [selectedDueTime, setSelectedDueTime] = useState('');
  const [customDueTime, setCustomDueTime] = useState('');
  const [designImages, setDesignImages] = useState([]);
  const [itemImages, setItemImages] = useState([]);

  // New Design Section State
  const [designColors, setDesignColors] = useState([]);
  const [designPlacements, setDesignPlacements] = useState([]);
  const [designSize, setDesignSize] = useState('Fill');
  
  // New Text Section State
  const [textFont, setTextFont] = useState('Arial');
  const [textColors, setTextColors] = useState([]);
  const [textPlacements, setTextPlacements] = useState([]);
  const [textSize, setTextSize] = useState('FILL');

  // Modals for design and text color selection
  const [showDesignColorModal, setShowDesignColorModal] = useState(false);
  const [showTextColorModal, setShowTextColorModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Handle item images
  const handleItemImagesChange = (itemId, e) => {
    const files = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, images: [...item.images, ...files] }
          : item
      )
    );
  };
  const removeItemImage = (itemId, index) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, images: item.images.filter((_, i) => i !== index) }
          : item
      )
    );
  };

  // Customer Info
  const [customer, setCustomer] = useState({
    name: '',
    number: '',
    email: '',
    company: '',
  });
  const addDesign = () => {
    const newId = (designs.length + 1).toString();
    setDesigns((prev) => [
      ...prev,
      {
        id: newId,
        designItemName: '',
        designImages: [],
        designColors: [],
        designPlacements: [],
        designSize: 'Fill',
        textFont: 'Arial',
        textColors: [],
        textPlacements: [],
        textSize: 'FILL',
      },
    ]);
  };
  // Helper to combine placements
  const combinePlacements = (placements) => {
    const aPositions = placements.filter((p) => p.startsWith("A")).sort();
    const hPositions = placements.filter((p) => p.startsWith("H")).sort();
    const length = Math.max(aPositions.length, hPositions.length);
    const combined = [];
    for (let i = 0; i < length; i++) {
      combined.push({
        position1: aPositions[i] || '',
        position2: hPositions[i] || ''
      });
    }
    return combined;
  };

  // Items
  const [items, setItems] = useState([
    {
      id: '1',
      barcode: '',
      itemNumber: '',
      color: '',
      price: '',
      cost: '',
      quantity: '',
      images: [], // separate images for each item
      selectedColors: [],
      selectedPlacements: [],
    },
  ]);
  const [designs, setDesigns] = useState([
    {
      id: '1',
      designItemName: '',
      designImages: [],
      designColors: [],
      designPlacements: [],
      designSize: 'Fill',
      textFont: 'Arial',
      textColors: [],
      textPlacements: [],
      textSize: 'FILL',
    },
  ]);

  // --- Backend helper functions (modified to handle arrays) ---
  const createItems = async (itemsData) => {
    // Adjust your backend to accept an array of items
    const res = await axios.post(apis().newItem, { items: itemsData });
    return res.data.itemIds; // Return array of item IDs
  };

  const createDesigns = async (designsData) => {
    // Adjust your backend to accept an array of designs
    const res = await axios.post(apis().newDesign, { designs: designsData });
    return res.data.designIds; // Return array of design IDs
  };

  const createCustomer = async (customerData) => {
    const res = await axios.post(apis().newCustomer, customerData);
    return res.data.customer._id;
  };

  const createPayment = async (paymentData) => {
    const res = await axios.post(apis().newOrderPayment, paymentData);
    return res.data.payment._id;
  };

  const uploadImages = async (formData) => {
    try {
      const res = await axios.post(apis().images, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data.images || [];
    } catch (error) {
      console.error('Upload failed:', error);
      return [];
    }
  };

  const createFinalOrder = async (orderData) => {
    const res = await axios.post(apis().newOrder, orderData);
    return res.data.order._id;
  };

  // Color modal for items
  const [showColorModal, setShowColorModal] = useState(false);
  const [itemForColorModal, setItemForColorModal] = useState(null);
  const openColorModal = (itemId) => {
    setItemForColorModal(itemId);
    setShowColorModal(true);
  };
  const closeColorModal = () => {
    setShowColorModal(false);
    setItemForColorModal(null);
  };

  const colorChart = [
    { hex: '#000000', name: 'Black' },
    { hex: '#0B0B0B', name: 'Very Dark Gray' },
  ];

  // Placement & color selection for items
  const handlePlacementClick = (itemId, placement) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          const newPlacements = item.selectedPlacements.includes(placement)
            ? item.selectedPlacements.filter((p) => p !== placement)
            : [...item.selectedPlacements, placement];
          return { ...item, selectedPlacements: newPlacements };
        }
        return item;
      })
    );
  };
  const handleColorSelect = (itemId, hex) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          const newColors = item.selectedColors.includes(hex)
            ? item.selectedColors.filter((c) => c !== hex)
            : [...item.selectedColors, hex];
          return { ...item, selectedColors: newColors };
        }
        return item;
      })
    );
  };

  // Item fields
  const handleItemChange = (itemId, field, value) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
  };
  const addItem = () => {
    const newId = (parseInt(items[items.length - 1].id) + 1).toString();
    setItems((prev) => [
      ...prev,
      {
        id: newId,
        barcode: '',
        itemNumber: '',
        color: '',
        price: '',
        cost: '',
        quantity: '',
        images: [], // Added images property so it is iterable
        selectedColors: [],
        selectedPlacements: [],
      },
    ]);
  };
  const removeItem = (itemId) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    }
  };

  // Design images
  const handleDesignImagesChange = (designId, e) => {
    const files = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setDesigns((prev) =>
      prev.map((ds) =>
        ds.id === designId
          ? { ...ds, designImages: [...ds.designImages, ...files] }
          : ds
      )
    );
  };
  const removeDesignImage = (designId, index) => {
    setDesigns((prev) =>
      prev.map((ds) =>
        ds.id === designId
          ? {
              ...ds,
              designImages: ds.designImages.filter((_, i) => i !== index),
            }
          : ds
      )
    );
  };
  const removeDesign = (designId) => {
    if (designs.length > 1) {
      setDesigns((prev) => prev.filter((ds) => ds.id !== designId));
    }
  };
  const renderAllDesigns = () =>
    designs.map((ds, idx) => (
      <div className="section" key={ds.id}>
        <h2 className="section-title">
          Design #{idx + 1}
          {designs.length > 1 && (
            <button
              type="button"
              className="remove-button"
              onClick={() => removeDesign(ds.id)}
            >
              Remove Design
            </button>
          )}
        </h2>
        {/* Upload Design Images */}
        <div className="upload-area">
          <p>Upload Design Image(s)</p>
          <input
            type="file"
            accept="image/*"
            multiple
            capture="environment"
            onChange={(e) => handleDesignImagesChange(ds.id, e)}
          />
        </div>
        <div className="design-images-preview">
          {ds.designImages.map((img, i) => (
            <div key={i} className="preview-item">
              <img src={img.preview} alt={`Design Preview ${i}`} />
              <button type="button" onClick={() => removeDesignImage(ds.id, i)}>
                Remove
              </button>
            </div>
          ))}
        </div>
        {/* Design Item Name and Color Selection */}
        <div className="form-group">
          <label className="form-label">Design Item Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter item name"
            value={ds.designItemName}
            onChange={(e) =>
              setDesigns((prev) =>
                prev.map((d) =>
                  d.id === ds.id ? { ...d, designItemName: e.target.value } : d
                )
              )
            }
          />
          <label className="form-label">Design Color Selection</label>
          <button
  type="button"
  className="open-color-modal-button"
  onClick={() => { 
    setActiveDesignId(ds.id); 
    setShowDesignColorModal(true); 
  }}
>
  Select Colors
</button>
          <div className="selected-
          colors">
            {ds.designColors &&
              ds.designColors.map((color) => (
                <div key={color} className="selected-color-pill">
                  <div
                    className="color-swatch"
                    style={{ backgroundColor: color }}
                  />
                  {colorChart.find((c) => c.hex === color)?.name}
                </div>
              ))}
          </div>
        </div>
        {/* Design Placements */}
        <div className="form-group">
          <label className="form-label">Design Placement</label>
          <div className="placement-grid">
            {[...Array(9)].map((_, i) => (
              <div
                key={`A${i + 1}`}
                className={`placement-cell ${
                  ds.designPlacements.includes(`A${i + 1}`) ? 'selected' : ''
                }`}
                onClick={() =>
                  setDesigns((prev) =>
                    prev.map((d) =>
                      d.id === ds.id
                        ? {
                            ...d,
                            designPlacements: d.designPlacements.includes(
                              `A${i + 1}`
                            )
                              ? d.designPlacements.filter((p) => p !== `A${i + 1}`)
                              : [...d.designPlacements, `A${i + 1}`],
                          }
                        : d
                    )
                  )
                }
              >
                A{i + 1}
              </div>
            ))}
          </div>
          <div className="placement-grid">
            {[...Array(9)].map((_, i) => (
              <div
                key={`H${i + 1}`}
                className={`placement-cell ${
                  ds.designPlacements.includes(`H${i + 1}`) ? 'selected' : ''
                }`}
                onClick={() =>
                  setDesigns((prev) =>
                    prev.map((d) =>
                      d.id === ds.id
                        ? {
                            ...d,
                            designPlacements: d.designPlacements.includes(
                              `H${i + 1}`
                            )
                              ? d.designPlacements.filter((p) => p !== `H${i + 1}`)
                              : [...d.designPlacements, `H${i + 1}`],
                          }
                        : d
                    )
                  )
                }
              >
                H{i + 1}
              </div>
            ))}
          </div>
        </div>
        {/* Design Size */}
        <div className="form-group">
          <label className="form-label">Design Size</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter size"
            value={ds.designSize}
            onChange={(e) =>
              setDesigns((prev) =>
                prev.map((d) =>
                  d.id === ds.id ? { ...d, designSize: e.target.value } : d
                )
              )
            }
          />
        </div>
        {/* Text Properties */}
        <div className="text-section">
          <h3 className="section-title">Text Properties</h3>
          <div className="form-group">
            <label className="form-label">Font</label>
            <select
              className="form-select"
              value={ds.textFont}
              onChange={(e) =>
                setDesigns((prev) =>
                  prev.map((d) =>
                    d.id === ds.id ? { ...d, textFont: e.target.value } : d
                  )
                )
              }
            >
              <option>Arial</option>
              <option>Times New Roman</option>
              <option>Helvetica</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Text Color</label>
            <button
              type="button"
              className="open-color-modal-button"
              onClick={() => setShowTextColorModal(true)}
            >
              Select Colors
            </button>
            <div className="selected-colors">
              {ds.textColors &&
                ds.textColors.map((color) => (
                  <div key={color} className="selected-color-pill">
                    <div
                      className="color-swatch"
                      style={{ backgroundColor: color }}
                    />
                    {colorChart.find((c) => c.hex === color)?.name}
                  </div>
                ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Text Placement</label>
            <div className="placement-grid">
              {[...Array(9)].map((_, i) => (
                <div
                  key={`A${i + 1}`}
                  className={`placement-cell ${
                    ds.textPlacements.includes(`A${i + 1}`) ? 'selected' : ''
                  }`}
                  onClick={() =>
                    setDesigns((prev) =>
                      prev.map((d) =>
                        d.id === ds.id
                          ? {
                              ...d,
                              textPlacements: d.textPlacements.includes(
                                `A${i + 1}`
                              )
                                ? d.textPlacements.filter((p) => p !== `A${i + 1}`)
                                : [...d.textPlacements, `A${i + 1}`],
                            }
                          : d
                      )
                    )
                  }
                >
                  A{i + 1}
                </div>
              ))}
            </div>
            <div className="placement-grid">
              {[...Array(9)].map((_, i) => (
                <div
                  key={`H${i + 1}`}
                  className={`placement-cell ${
                    ds.textPlacements.includes(`H${i + 1}`) ? 'selected' : ''
                  }`}
                  onClick={() =>
                    setDesigns((prev) =>
                      prev.map((d) =>
                        d.id === ds.id
                          ? {
                              ...d,
                              textPlacements: d.textPlacements.includes(
                                `H${i + 1}`
                              )
                                ? d.textPlacements.filter((p) => p !== `H${i + 1}`)
                                : [...d.textPlacements, `H${i + 1}`],
                            }
                          : d
                      )
                    )
                  }
                >
                  H{i + 1}
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Text Size</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter size"
              value={ds.textSize}
              onChange={(e) =>
                setDesigns((prev) =>
                  prev.map((d) =>
                    d.id === ds.id ? { ...d, textSize: e.target.value } : d
                  )
                )
              }
            />
          </div>
        </div>
      </div>
    ));


  // Set due time
  const handleDueTimeSelect = (time) => {
    setSelectedDueTime(time);
    const now = new Date();
    let dueDate = new Date(now);
    switch (time) {
      case '15min':
        dueDate.setMinutes(now.getMinutes() + 15);
        break;
      case '20min':
        dueDate.setMinutes(now.getMinutes() + 20);
        break;
      case '30min':
        dueDate.setMinutes(now.getMinutes() + 30);
        break;
      case '1hour':
        dueDate.setHours(now.getHours() + 1);
        break;
      default:
        break;
    }
    setCustomDueTime(dueDate.toISOString().slice(0, 16));
  };
  const handleCustomDueTimeChange = (e) => {
    setCustomDueTime(e.target.value);
    setSelectedDueTime('custom');
  };

  // Barcode scanning setup
  useEffect(() => {
    let buffer = '';
    let lastKeyTime = Date.now();
    const handleKeyPress = (e) => {
      const currentTime = Date.now();
      if (currentTime - lastKeyTime > 100) {
        buffer = '';
      }
      if (e.key === 'Enter') {
        if (buffer) {
          handleItemChange(items[0].id, 'barcode', buffer);
          buffer = '';
        }
      } else {
        buffer += e.key;
      }
      lastKeyTime = currentTime;
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [items]);

  // Simulate fetching customer
  const fetchCustomerByPhone = async (number) => {
    const mockDB = {
      '1234567890': {
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Acme Inc.',
      },
      '9876543210': {
        name: 'Jane Smith',
        email: 'jane@example.com',
        company: 'Globex Corp.',
      },
    };
    return mockDB[number] || null;
  };

  // Prefill customer on phone blur
  const handlePhoneBlur = async (e) => {
    const number = e.target.value;
    if (number) {
      const result = await fetchCustomerByPhone(number);
      if (result) {
        setCustomer((prev) => ({ ...prev, number, ...result }));
      }
    }
  };
  const handleCustomerChange = (field, value) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  // Calculations
  const calculateTotalPrice = () => {
    return items.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseFloat(item.quantity) || 1;
      return sum + price * quantity;
    }, 0);
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowCheckoutModal(true);
  };

  // --- Modified Order Submission with multiple items & multiple designs ---
  const handlePlaceOrder = async () => {
    try {
      // 1 - Upload all item images if any
      let itemImageUrls = [];
      if (itemImages.length > 0) {
        const formData = new FormData();
        itemImages.forEach((fileObj) => formData.append('images', fileObj.file));
        itemImageUrls = await uploadImages(formData);
      }

      // 2 - Prepare multiple item payloads
      const itemPayloads = items.map((item) => ({
        name: item.itemNumber,
        color: item.color,
        price: item.price,
        cost: item.cost,
        quantity: item.quantity,
        picture: itemImageUrls[0] || ''
      }));
      const itemIds = await createItems(itemPayloads);

      // 3 - Upload all design images if any
      let designImageUrls = [];
      if (designImages.length > 0) {
        const formDataDesign = new FormData();
        designImages.forEach((fileObj) => formDataDesign.append('images', fileObj.file));
        designImageUrls = await uploadImages(formDataDesign);
      }

      // 4 - Prepare multiple design payloads (here just one, but can be extended)
      const designsPayload = [
        {
          pictures: [
            {
              pictureFiles: designImageUrls,
              colorChart: designColors.map((hex) => ({
                item: designItemName,
                color: colorChart.find((c) => c.hex === hex)?.name || hex
              })),
              placement: combinePlacements(designPlacements),
              size: designSize
            }
          ],
          text: [
            {
              font: textFont,
              color: textColors.map((hex) => ({
                item: 'Banner', // or update as needed
                color: colorChart.find((c) => c.hex === hex)?.name || hex
              })),
              placement: combinePlacements(textPlacements),
              size: textSize
            }
          ]
        }
      ];
      const designIds = await createDesigns(designsPayload);

      // 5 - Create or fetch customer
      const customerId = await createCustomer({
        name: customer.name,
        number: customer.number,
        email: customer.email,
        company: customer.company,
      });

      // 6 - Create payment
      const paymentId = await createPayment({
        method: selectedPayment.toUpperCase(),
        amount: calculateTotalPrice(),
        layaway: took === 'layaway',
        quote: took === 'quote',
      });

      // 7 - Create final order
      const authData = JSON.parse(localStorage.getItem('authData')) || {};
      const orderPayload = {
        items: itemIds,
        design: designIds, // now an array of design IDs
        duedate: customDueTime,
        customer: customerId,
        payments: [paymentId],
        createdBy: authData?.username || authData?._id || '000000000000000000000000'
      };
      await createFinalOrder(orderPayload);

      setShowCheckoutModal(false);
      toast.success('Order placed successfully');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order');
    }
  };

  // Render the new Design & Text Section
  const renderDesignSection = () => (
    <div className="section">
      <h2 className="section-title">Design</h2>
      <div className="upload-area">
        <p>Upload Design Image(s)</p>
        <input
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          onChange={handleDesignImagesChange}
        />
      </div>
      <div className="design-images-preview">
        {designImages.map((img, index) => (
          <div key={index} className="preview-item">
            <img src={img.preview} alt={`Design Preview ${index}`} />
            <button type="button" onClick={() => removeDesignImage(index)}>
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="form-group">
        <div className="form-group">
          <label className="form-label">Design Item Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter item name"
            value={designItemName}
            onChange={(e) => setDesignItemName(e.target.value)}
          />
        </div>
        <label className="form-label">Design Color Selection</label>
        <button
          type="button"
          className="open-color-modal-button"
          onClick={() => setShowDesignColorModal(true)}
        >
          Select Colors
        </button>
        <div className="selected-colors">
          {designColors.map((color) => (
            <div key={color} className="selected-color-pill">
              <div
                className="color-swatch"
                style={{ backgroundColor: color }}
              />
              {colorChart.find((c) => c.hex === color)?.name}
            </div>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Design Placement</label>
        <div className="placement-grid">
          {[...Array(9)].map((_, i) => (
            <div
              key={`A${i + 1}`}
              className={`placement-cell ${
                designPlacements.includes(`A${i + 1}`) ? 'selected' : ''
              }`}
              onClick={() =>
                setDesignPlacements((prev) =>
                  prev.includes(`A${i + 1}`)
                    ? prev.filter((p) => p !== `A${i + 1}`)
                    : [...prev, `A${i + 1}`]
                )
              }
            >
              A{i + 1}
            </div>
          ))}
        </div>
        <div className="placement-grid">
          {[...Array(9)].map((_, i) => (
            <div
              key={`H${i + 1}`}
              className={`placement-cell ${
                designPlacements.includes(`H${i + 1}`) ? 'selected' : ''
              }`}
              onClick={() =>
                setDesignPlacements((prev) =>
                  prev.includes(`H${i + 1}`)
                    ? prev.filter((p) => p !== `H${i + 1}`)
                    : [...prev, `H${i + 1}`]
                )
              }
            >
              H{i + 1}
            </div>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Design Size</label>
        <input
          type="text"
          className="form-input"
          value={designSize}
          onChange={(e) => setDesignSize(e.target.value)}
          placeholder="Enter size"
        />
      </div>
      <div className="text-section">
        <h3 className="section-title">Text Properties</h3>
        <div className="form-group">
          <label className="form-label">Font</label>
          <select
            className="form-select"
            value={textFont}
            onChange={(e) => setTextFont(e.target.value)}
          >
            <option>Arial</option>
            <option>Times New Roman</option>
            <option>Helvetica</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Text Color</label>
          <button
            type="button"
            className="open-color-modal-button"
            onClick={() => setShowTextColorModal(true)}
          >
            Select Colors
          </button>
          <div className="selected-colors">
            {textColors.map((color) => (
              <div key={color} className="selected-color-pill">
                <div
                  className="color-swatch"
                  style={{ backgroundColor: color }}
                />
                {colorChart.find((c) => c.hex === color)?.name}
              </div>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Text Placement</label>
          <div className="placement-grid">
            {[...Array(9)].map((_, i) => (
              <div
                key={`A${i + 1}`}
                className={`placement-cell ${
                  textPlacements.includes(`A${i + 1}`) ? 'selected' : ''
                }`}
                onClick={() =>
                  setTextPlacements((prev) =>
                    prev.includes(`A${i + 1}`)
                      ? prev.filter((p) => p !== `A${i + 1}`)
                      : [...prev, `A${i + 1}`]
                  )
                }
              >
                A{i + 1}
              </div>
            ))}
          </div>
          <div className="placement-grid">
            {[...Array(9)].map((_, i) => (
              <div
                key={`H${i + 1}`}
                className={`placement-cell ${
                  textPlacements.includes(`H${i + 1}`) ? 'selected' : ''
                }`}
                onClick={() =>
                  setTextPlacements((prev) =>
                    prev.includes(`H${i + 1}`)
                      ? prev.filter((p) => p !== `H${i + 1}`)
                      : [...prev, `H${i + 1}`]
                  )
                }
              >
                H{i + 1}
              </div>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Text Size</label>
          <input
            type="text"
            className="form-input"
            value={textSize}
            onChange={(e) => setTextSize(e.target.value)}
            placeholder="Enter size"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <div className="new-order-container">
        <form onSubmit={handleSubmit}>
          <div className="global-controls">
            <button type="button" className="add-item-button" onClick={addItem}>
              Add New Item
            </button>
          </div>
          <div className="section">
            <h2 className="section-title">Date/Time</h2>
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                value={currentDateTime}
                readOnly
              />
            </div>
          </div>
          {items.map((item, index) => (
            <div key={item.id}>
              <div className="section">
                <div className="item-number">Item #{index + 1}</div>
                {items.length > 1 && (
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                )}
                <h2 className="section-title">Item</h2>
                <div className="form-group">
                  <label className="form-label">POS Scan</label>
                  <div className="scanner-container">
                    <input
                      type="text"
                      className="form-input scanner-input"
                      value={item.barcode}
                      onChange={(e) =>
                        handleItemChange(item.id, 'barcode', e.target.value)
                      }
                      placeholder="Scan barcode or enter manually"
                    />
                    <svg
                      className="scanner-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="form-group">
                  <h3 className="section-title">New Item</h3>
                  <div className="grid-container">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Item Number"
                      value={item.itemNumber}
                      onChange={(e) =>
                        handleItemChange(item.id, 'itemNumber', e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Color"
                      value={item.color}
                      onChange={(e) =>
                        handleItemChange(item.id, 'color', e.target.value)
                      }
                    />
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(item.id, 'price', e.target.value)
                      }
                    />
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Cost"
                      value={item.cost}
                      onChange={(e) =>
                        handleItemChange(item.id, 'cost', e.target.value)
                      }
                    />
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(item.id, 'quantity', e.target.value)
                      }
                    />
                  </div>
                  <div className="upload-area">
                    <p>Upload Item Image(s)</p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      capture="environment"
                      onChange={(e) => handleItemImagesChange(item.id, e)}
                    />
                  </div>
                  <div className="design-images-preview">
                    {item.images?.map((img, idx) => (
                      <div key={idx} className="preview-item">
                        <img src={img.preview} alt={`Item Image Preview ${idx}`} />
                        <button
                          type="button"
                          onClick={() => removeItemImage(item.id, idx)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <hr />
            </div>
          ))}
           <button type="button" className="add-item-button" onClick={addDesign}>
            Add New Design
          </button>
          {renderAllDesigns()}
         
          <div className="section">
            <h2 className="section-title">Due</h2>
            <div className="time-buttons">
              <button
                type="button"
                className={`time-button ${
                  selectedDueTime === '15min' ? 'selected' : ''
                }`}
                onClick={() => handleDueTimeSelect('15min')}
              >
                15 min
              </button>
              <button
                type="button"
                className={`time-button ${
                  selectedDueTime === '20min' ? 'selected' : ''
                }`}
                onClick={() => handleDueTimeSelect('20min')}
              >
                20 min
              </button>
              <button
                type="button"
                className={`time-button ${
                  selectedDueTime === '30min' ? 'selected' : ''
                }`}
                onClick={() => handleDueTimeSelect('30min')}
              >
                30 min
              </button>
              <button
                type="button"
                className={`time-button ${
                  selectedDueTime === 'custom' ? 'selected' : ''
                }`}
                onClick={() => setSelectedDueTime('custom')}
              >
                Custom
              </button>
              <input
                type="datetime-local"
                className="form-input"
                value={customDueTime}
                onChange={handleCustomDueTimeChange}
              />
            </div>
          </div>
          <div className="section">
            <h2 className="section-title">Customer Information</h2>
            <div className="grid-container">
              <input
                type="text"
                className="form-input"
                placeholder="Name"
                value={customer.name}
                onChange={(e) => handleCustomerChange('name', e.target.value)}
              />
              <input
                type="tel"
                className="form-input"
                placeholder="Phone Number"
                value={customer.number}
                onChange={(e) => handleCustomerChange('number', e.target.value)}
                onBlur={handlePhoneBlur}
              />
              <input
                type="email"
                className="form-input"
                placeholder="Email Address"
                value={customer.email}
                onChange={(e) => handleCustomerChange('email', e.target.value)}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Company"
                value={customer.company}
                onChange={(e) => handleCustomerChange('company', e.target.value)}
              />
            </div>
          </div>
          <div className="section">
            <h2 className="section-title">Payment</h2>
            <div className="payment-options">
              <div
                className={`payment-option ${
                  selectedPayment === 'cash' ? 'selected' : ''
                }`}
                onClick={() => setSelectedPayment('cash')}
              >
                Cash
              </div>
              <div
                className={`payment-option ${
                  selectedPayment === 'card' ? 'selected' : ''
                }`}
                onClick={() => setSelectedPayment('card')}
              >
                Card
              </div>
              <div
                className={`payment-option ${
                  selectedPayment === 'check' ? 'selected' : ''
                }`}
                onClick={() => setSelectedPayment('check')}
              >
                Check
              </div>
              <div
                className={`payment-option ${
                  took === 'layaway' ? 'selected' : ''
                }`}
                onClick={() => settook('layaway')}
              >
                Layaway (50%)
              </div>
              <div
                className={`payment-option ${
                  took === 'quote' ? 'selected' : ''
                }`}
                onClick={() => settook('quote')}
              >
                Quote
              </div>
            </div>
          </div>
          <button type="submit" className="submit-button">
            Review Order
          </button>
        </form>
      </div>
  
      {showColorModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Select Item Colors</h2>
            <div className="color-grid">
              {colorChart.map(({ hex, name }) => (
                <div
                  key={hex}
                  className="color-swatch"
                  style={{ backgroundColor: hex }}
                  onClick={() => handleColorSelect(itemForColorModal, hex)}
                >
                  {name}
                </div>
              ))}
            </div>
            <button className="close-button" onClick={closeColorModal}>
              X
            </button>
          </div>
        </div>
      )}
  
  {showDesignColorModal && (
        <div className="color-modal">
          <div className="color-modal-content">
            <input 
              type="text" 
              placeholder="Search colors by hex" 
              value={colorSearchTerm}
              onChange={(e) => setColorSearchTerm(e.target.value)}
              className="color-search-input"
            />
            <div className="color-grid">
              {colorChart
                .filter(({ hex }) =>
                  hex.toLowerCase().includes(colorSearchTerm.trim().toLowerCase())
                )
                .map(({ hex }) => (
                  <div
                    key={hex}
                    className="color-swatch"
                    style={{ backgroundColor: hex }}
                    onClick={() => setDesigns(prev =>
                        prev.map(design =>
                          design.id === activeDesignId
                            ? design.designColors.includes(hex)
                              ? { ...design, designColors: design.designColors.filter(c => c !== hex) }
                              : { ...design, designColors: [...design.designColors, hex] }
                            : design
                        )
                      )
                    }
                  />
              ))}</div>
            <button className="close-button" onClick={() => setShowDesignColorModal(false)}>
              X
            </button>
          </div>
        </div>
      )}
      // Replace the text color modal JSX with this:
{showTextColorModal && (
    <div className="color-modal">
        <div className="color-modal-content">
            <input 
                type="text" 
                placeholder="Search colors by hex" 
                value={colorSearchTerm}
                onChange={(e) => setColorSearchTerm(e.target.value)}
                className="color-search-input"
            />
            <div className="color-grid">
                {colorChart
                    .filter(({ hex }) =>
                        hex.toLowerCase().includes(colorSearchTerm.trim().toLowerCase())
                    )
                    .map(({ hex, name }) => (
                        <div
                            key={hex}
                            className="color-swatch"
                            style={{ backgroundColor: hex }}
                            onClick={() =>
                                setTextColors((prev) =>
                                    prev.includes(hex)
                                        ? prev.filter((c) => c !== hex)
                                        : [...prev, hex]
                                )
                            }
                        >
                        </div>
                    ))
                }
            </div>
            <button className="close-button" onClick={() => setShowTextColorModal(false)}>
                X
            </button>
        </div>
    </div>
)}
  
      {showCheckoutModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Review Order</h2>
            <p>Total Price: ${calculateTotalPrice().toFixed(2)}</p>
            <div className="checkout-actions">
              <button onClick={handlePlaceOrder}>Place Order</button>
              <button onClick={() => setShowCheckoutModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewOrder;