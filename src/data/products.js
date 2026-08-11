const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 2499,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 2,
    name: "Smart Watch",
    price: 3299,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 3,
    name: "Running Shoes",
    price: 2199,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 4,
    name: "Classic Backpack",
    price: 1599,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 5,
    name: "Coffee Maker",
    price: 2799,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 6,
    name: "Sunglasses",
    price: 999,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 7,
    name: "Bluetooth Speaker",
    price: 1899,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 8,
    name: "Mechanical Keyboard",
    price: 3499,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 9,
    name: "Denim Jacket",
    price: 2499,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 10,
    name: "Modern Table Lamp",
    price: 1299,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80",
  },
    {
    id: 11,
    name: "Wireless Mouse",
    price: 899,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 12,
    name: "Laptop",
    price: 54999,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 13,
    name: "Smartphone",
    price: 18999,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 14,
    name: "Wireless Earbuds",
    price: 1999,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 15,
    name: "Digital Camera",
    price: 32999,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 16,
    name: "Gaming Controller",
    price: 2999,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 17,
    name: "Portable Speaker",
    price: 1899,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 18,
    name: "Webcam",
    price: 2299,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 19,
    name: "Computer Monitor",
    price: 12999,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 20,
    name: "Power Bank",
    price: 1799,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1609592424846-3e7d1a7e5c91?auto=format&fit=crop&w=700&q=80",
  },
    {
    id: 21,
    name: "Fast Charger",
    price: 799,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 22,
    name: "Wireless Charger",
    price: 999,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1609592424846-3e7d1a7e5c91?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 23,
    name: "Tablet",
    price: 14999,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 24,
    name: "Laptop Stand",
    price: 1499,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1527443195645-1133f7f28990?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 25,
    name: "USB Microphone",
    price: 2999,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 26,
    name: "Fitness Tracker",
    price: 2499,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1557935728-e6d1eaabe558?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 27,
    name: "Smart LED Bulb",
    price: 699,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 28,
    name: "Portable Projector",
    price: 8999,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 29,
    name: "External SSD",
    price: 5999,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 30,
    name: "Gaming Headset",
    price: 3999,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=700&q=80",
  },
    {
    id: 31,
    name: "Denim Jacket",
    price: 2499,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 32,
    name: "Casual T-Shirt",
    price: 899,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 33,
    name: "Formal Shirt",
    price: 1499,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 34,
    name: "Hoodie",
    price: 1799,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 35,
    name: "Slim Fit Jeans",
    price: 1999,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 36,
    name: "Casual Sneakers",
    price: 2399,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 37,
    name: "Leather Wallet",
    price: 999,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 38,
    name: "Leather Belt",
    price: 799,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 39,
    name: "Travel Backpack",
    price: 2299,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 40,
    name: "Sports Cap",
    price: 599,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=700&q=80",
  },
    {
    id: 41,
    name: "Winter Jacket",
    price: 3499,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 42,
    name: "Handbag",
    price: 2499,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 43,
    name: "Crossbody Bag",
    price: 1799,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 44,
    name: "Floral Dress",
    price: 2199,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 45,
    name: "Casual Kurti",
    price: 1299,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 46,
    name: "Cotton Saree",
    price: 1999,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 47,
    name: "Formal Trousers",
    price: 1699,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 48,
    name: "Sports Shorts",
    price: 899,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 49,
    name: "Leather Boots",
    price: 2999,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1542840843-3349799cded6?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 50,
    name: "Canvas Shoes",
    price: 1399,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=80",
  },
    {
    id: 51,
    name: "Polo Shirt",
    price: 1199,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 52,
    name: "Oversized T-Shirt",
    price: 999,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 53,
    name: "Analog Watch",
    price: 2799,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 54,
    name: "Fashion Scarf",
    price: 699,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1601924928377-1f7c9a5c7f6f?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 55,
    name: "Winter Gloves",
    price: 599,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1458057557595-1e7f3a1e5d4e?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 56,
    name: "Baseball Cap",
    price: 499,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 57,
    name: "Travel Duffel Bag",
    price: 1899,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 58,
    name: "Running T-Shirt",
    price: 999,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 59,
    name: "Casual Sandals",
    price: 799,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 60,
    name: "Classic Polo",
    price: 1299,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1625910513413-5fc45f9c7c1f?auto=format&fit=crop&w=700&q=80",
  },
    {
    id: 61,
    name: "Casual Sneakers",
    price: 2399,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 62,
    name: "Leather Sandals",
    price: 1199,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 63,
    name: "Men's Casual Shirt",
    price: 1399,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1602810319428-019690571b5b?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 64,
    name: "Women's Casual Top",
    price: 1099,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 65,
    name: "Denim Jeans",
    price: 1899,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 66,
    name: "Women's Handbag",
    price: 2299,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 67,
    name: "Round Sunglasses",
    price: 899,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 68,
    name: "Sports Shoes",
    price: 2699,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 69,
    name: "Leather Handbag",
    price: 2999,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 70,
    name: "Hooded Sweatshirt",
    price: 1799,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=80",
  },
    {
    id: 71,
    name: "Ceramic Vase",
    price: 999,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 72,
    name: "Wall Clock",
    price: 1199,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 73,
    name: "Decorative Plant",
    price: 799,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 74,
    name: "Throw Pillow",
    price: 599,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 75,
    name: "Coffee Table",
    price: 6999,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 76,
    name: "Modern Chair",
    price: 4999,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 77,
    name: "Table Lamp",
    price: 1299,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 78,
    name: "Ceramic Coffee Mug",
    price: 499,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 79,
    name: "Dinner Plate Set",
    price: 1299,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 80,
    name: "Kitchen Utensil Set",
    price: 1499,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=700&q=80",
  },
    {
    id: 81,
    name: "Non Stick Frying Pan",
    price: 1599,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1584990347449-a2d4d4f5e0f1?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 82,
    name: "Wooden Cutting Board",
    price: 699,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 83,
    name: "Kitchen Knife Set",
    price: 1399,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 84,
    name: "Water Bottle",
    price: 499,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 85,
    name: "Insulated Flask",
    price: 999,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 86,
    name: "Laundry Basket",
    price: 899,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 87,
    name: "Storage Basket",
    price: 699,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 88,
    name: "Decorative Candle",
    price: 499,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 89,
    name: "Photo Frame",
    price: 599,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 90,
    name: "Wall Art",
    price: 1199,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=700&q=80",
  },
    {
    id: 91,
    name: "Bedsheet Set",
    price: 1599,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 92,
    name: "Soft Blanket",
    price: 1899,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1580301762395-21ce8e8f2d2c?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 93,
    name: "Decorative Cushion",
    price: 699,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 94,
    name: "Floor Mat",
    price: 599,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 95,
    name: "Curtain Set",
    price: 1799,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 96,
    name: "Modern Sofa",
    price: 24999,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 97,
    name: "Wooden Dining Table",
    price: 12999,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 98,
    name: "Bedside Table",
    price: 2999,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 99,
    name: "Storage Box",
    price: 599,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 100,
    name: "Decorative Lantern",
    price: 999,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=700&q=80",
  },
];

export default products;