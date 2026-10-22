import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import "./AddProduct.css";

function AddProduct({
  merchant,
  onBack,
  onProductAdded,
}) {

  /* =========================================
     CATEGORY → PRODUCT TYPE
  ========================================= */

  const productTypes = {
    Electronics: [
      "Smartphone",
      "Laptop",
      "Tablet",
      "Smart Watch",
      "Headphones",
      "Bluetooth Speaker",
      "Camera",
      "Keyboard",
      "Mouse",
    ],

    Fashion: [
      "Bangles",
      "Saree",
      "Kurti",
      "T-Shirt",
      "Jeans",
      "Dress",
      "Shoes",
      "Handbag",
    ],

    Home: [
      "Sofa",
      "Bed",
      "Dining Table",
      "Chair",
      "Table Lamp",
      "Wall Clock",
      "Curtains",
      "Carpet",
    ],

    Beauty: [
      "Face Wash",
      "Moisturizer",
      "Sunscreen",
      "Lipstick",
      "Foundation",
      "Perfume",
      "Shampoo",
      "Hair Oil",
    ],

    Sports: [
      "Cricket Bat",
      "Cricket Ball",
      "Football",
      "Basketball",
      "Tennis Racket",
      "Badminton Racket",
      "Sports Shoes",
      "Gym Equipment",
    ],

    Accessories: [
      "Watch",
      "Sunglasses",
      "Wallet",
      "Belt",
      "Backpack",
      "Jewellery",
      "Mobile Cover",
      "Keychain",
    ],
  };

  /* =========================================
     PRODUCT TYPE → SPECIFIC FIELDS
  ========================================= */

  const productFields = {

    /* ================= ELECTRONICS ================= */


    
    Smartphone: [
      {
        name: "model",
        label: "Model",
        placeholder: "Enter model name",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "ram",
        label: "RAM",
        placeholder: "e.g. 8 GB",
      },
      {
        name: "storage",
        label: "Storage",
        placeholder: "e.g. 128 GB",
      },
      {
        name: "displaySize",
        label: "Display Size",
        placeholder: "e.g. 6.5 inches",
      },
      {
        name: "battery",
        label: "Battery Capacity",
        placeholder: "e.g. 5000 mAh",
      },
      {
        name: "operatingSystem",
        label: "Operating System",
        placeholder: "e.g. Android 15",
      },
      {
        name: "warranty",
        label: "Warranty",
        placeholder: "e.g. 1 Year",
      },
    ],

    Laptop: [
      {
        name: "model",
        label: "Model",
        placeholder: "Enter model name",
      },
      {
        name: "processor",
        label: "Processor",
        placeholder: "e.g. Intel Core i5",
      },
      {
        name: "ram",
        label: "RAM",
        placeholder: "e.g. 16 GB",
      },
      {
        name: "storage",
        label: "Storage",
        placeholder: "e.g. 512 GB SSD",
      },
      {
        name: "graphics",
        label: "Graphics",
        placeholder: "e.g. NVIDIA RTX 4050",
      },
      {
        name: "screenSize",
        label: "Screen Size",
        placeholder: "e.g. 15.6 inches",
      },
      {
        name: "operatingSystem",
        label: "Operating System",
        placeholder: "e.g. Windows 11",
      },
      {
        name: "battery",
        label: "Battery",
        placeholder: "Enter battery details",
      },
      {
        name: "warranty",
        label: "Warranty",
        placeholder: "e.g. 1 Year",
      },
    ],

    Tablet: [
      {
        name: "model",
        label: "Model",
        placeholder: "Enter model name",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "ram",
        label: "RAM",
        placeholder: "e.g. 8 GB",
      },
      {
        name: "storage",
        label: "Storage",
        placeholder: "e.g. 256 GB",
      },
      {
        name: "displaySize",
        label: "Display Size",
        placeholder: "e.g. 11 inches",
      },
      {
        name: "battery",
        label: "Battery Capacity",
        placeholder: "e.g. 8000 mAh",
      },
      {
        name: "operatingSystem",
        label: "Operating System",
        placeholder: "e.g. Android",
      },
      {
        name: "warranty",
        label: "Warranty",
        placeholder: "e.g. 1 Year",
      },
    ],

    "Smart Watch": [
      {
        name: "model",
        label: "Model",
        placeholder: "Enter model name",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "displayType",
        label: "Display Type",
        placeholder: "e.g. AMOLED",
      },
      {
        name: "displaySize",
        label: "Display Size",
        placeholder: "e.g. 1.9 inches",
      },
      {
        name: "batteryLife",
        label: "Battery Life",
        placeholder: "e.g. 7 Days",
      },
      {
        name: "waterResistance",
        label: "Water Resistance",
        placeholder: "e.g. IP68",
      },
      {
        name: "connectivity",
        label: "Connectivity",
        placeholder: "e.g. Bluetooth, Wi-Fi",
      },
      {
        name: "warranty",
        label: "Warranty",
        placeholder: "e.g. 1 Year",
      },
    ],

    Headphones: [
      {
        name: "model",
        label: "Model",
        placeholder: "Enter model name",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "type",
        label: "Headphone Type",
        placeholder: "e.g. Over Ear",
      },
      {
        name: "connectivity",
        label: "Connectivity",
        placeholder: "e.g. Bluetooth 5.3",
      },
      {
        name: "batteryLife",
        label: "Battery Life",
        placeholder: "e.g. 40 Hours",
      },
      {
        name: "noiseCancellation",
        label: "Noise Cancellation",
        placeholder: "e.g. Active Noise Cancellation",
      },
      {
        name: "warranty",
        label: "Warranty",
        placeholder: "e.g. 1 Year",
      },
    ],

    "Bluetooth Speaker": [
      {
        name: "model",
        label: "Model",
        placeholder: "Enter model name",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "powerOutput",
        label: "Power Output",
        placeholder: "e.g. 20 W",
      },
      {
        name: "connectivity",
        label: "Connectivity",
        placeholder: "e.g. Bluetooth 5.3",
      },
      {
        name: "batteryLife",
        label: "Battery Life",
        placeholder: "e.g. 12 Hours",
      },
      {
        name: "waterResistance",
        label: "Water Resistance",
        placeholder: "e.g. IP67",
      },
      {
        name: "warranty",
        label: "Warranty",
        placeholder: "e.g. 1 Year",
      },
    ],

    Camera: [
      {
        name: "model",
        label: "Model",
        placeholder: "Enter camera model",
      },
      {
        name: "cameraType",
        label: "Camera Type",
        placeholder: "e.g. DSLR / Mirrorless",
      },
      {
        name: "resolution",
        label: "Resolution",
        placeholder: "e.g. 24 MP",
      },
      {
        name: "sensorType",
        label: "Sensor Type",
        placeholder: "e.g. CMOS",
      },
      {
        name: "lensMount",
        label: "Lens Mount",
        placeholder: "Enter lens mount",
      },
      {
        name: "videoResolution",
        label: "Video Resolution",
        placeholder: "e.g. 4K",
      },
      {
        name: "warranty",
        label: "Warranty",
        placeholder: "e.g. 1 Year",
      },
    ],

    Keyboard: [
      {
        name: "model",
        label: "Model",
        placeholder: "Enter keyboard model",
      },
      {
        name: "keyboardType",
        label: "Keyboard Type",
        placeholder: "e.g. Mechanical",
      },
      {
        name: "switchType",
        label: "Switch Type",
        placeholder: "e.g. Blue Switch",
      },
      {
        name: "connectivity",
        label: "Connectivity",
        placeholder: "e.g. USB / Wireless",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "backlight",
        label: "Backlight",
        placeholder: "e.g. RGB",
      },
      {
        name: "warranty",
        label: "Warranty",
        placeholder: "e.g. 1 Year",
      },
    ],

    Mouse: [
      {
        name: "model",
        label: "Model",
        placeholder: "Enter mouse model",
      },
      {
        name: "mouseType",
        label: "Mouse Type",
        placeholder: "e.g. Gaming / Wireless",
      },
      {
        name: "connectivity",
        label: "Connectivity",
        placeholder: "e.g. Bluetooth / USB",
      },
      {
        name: "dpi",
        label: "DPI",
        placeholder: "e.g. 1600 DPI",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "warranty",
        label: "Warranty",
        placeholder: "e.g. 1 Year",
      },
    ],

    /* ================= FASHION ================= */

    Bangles: [
      {
        name: "material",
        label: "Material",
        placeholder: "e.g. Gold / Silver / Glass",
      },
      {
        name: "bangleType",
        label: "Bangle Type",
        placeholder: "e.g. Kada / Bracelet",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "design",
        label: "Design",
        placeholder: "Describe the design",
      },
      {
        name: "occasion",
        label: "Occasion",
        placeholder: "e.g. Wedding / Party",
      },
      {
        name: "packOf",
        label: "Pack of",
        placeholder: "e.g. 2",
      },
    ],

    Saree: [
      {
        name: "fabric",
        label: "Fabric",
        placeholder: "e.g. Silk / Cotton",
      },
      {
        name: "sareeLength",
        label: "Saree Length",
        placeholder: "e.g. 5.5 meters",
      },
      {
        name: "blouseIncluded",
        label: "Blouse Included",
        placeholder: "Yes / No",
      },
      {
        name: "pattern",
        label: "Pattern",
        placeholder: "e.g. Printed / Embroidered",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "occasion",
        label: "Occasion",
        placeholder: "e.g. Wedding / Festival",
      },
    ],

    Kurti: [
      {
        name: "fabric",
        label: "Fabric",
        placeholder: "e.g. Cotton",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "pattern",
        label: "Pattern",
        placeholder: "e.g. Printed",
      },
      {
        name: "sleeveType",
        label: "Sleeve Type",
        placeholder: "e.g. Full Sleeve",
      },
      {
        name: "occasion",
        label: "Occasion",
        placeholder: "e.g. Casual",
      },
    ],

    "T-Shirt": [
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "fabric",
        label: "Fabric",
        placeholder: "e.g. Cotton",
      },
      {
        name: "pattern",
        label: "Pattern",
        placeholder: "e.g. Printed / Solid",
      },
      {
        name: "fit",
        label: "Fit",
        placeholder: "e.g. Regular / Slim",
      },
      {
        name: "gender",
        label: "Gender",
        placeholder: "Men / Women / Unisex",
      },
    ],

    Jeans: [
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "fabric",
        label: "Fabric",
        placeholder: "e.g. Denim",
      },
      {
        name: "fit",
        label: "Fit",
        placeholder: "e.g. Slim / Regular",
      },
      {
        name: "pattern",
        label: "Pattern",
        placeholder: "e.g. Solid",
      },
      {
        name: "gender",
        label: "Gender",
        placeholder: "Men / Women / Unisex",
      },
    ],

    Dress: [
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "fabric",
        label: "Fabric",
        placeholder: "e.g. Cotton",
      },
      {
        name: "pattern",
        label: "Pattern",
        placeholder: "e.g. Printed",
      },
      {
        name: "dressLength",
        label: "Dress Length",
        placeholder: "e.g. Knee Length",
      },
      {
        name: "occasion",
        label: "Occasion",
        placeholder: "e.g. Party",
      },
    ],

    Shoes: [
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "material",
        label: "Material",
        placeholder: "e.g. Leather / Synthetic",
      },
      {
        name: "pattern",
        label: "Pattern",
        placeholder: "e.g. Solid",
      },
      {
        name: "closure",
        label: "Closure Type",
        placeholder: "e.g. Lace-Up / Slip-On",
      },
      {
        name: "occasion",
        label: "Occasion",
        placeholder: "e.g. Casual / Sports",
      },
      {
        name: "gender",
        label: "Gender",
        placeholder: "Men / Women / Unisex",
      },
    ],

    Handbag: [
      {
        name: "material",
        label: "Material",
        placeholder: "e.g. Leather",
      },
      {
        name: "bagType",
        label: "Bag Type",
        placeholder: "e.g. Shoulder Bag",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "closure",
        label: "Closure Type",
        placeholder: "e.g. Zip",
      },
      {
        name: "compartments",
        label: "Compartments",
        placeholder: "e.g. 3",
      },
      {
        name: "occasion",
        label: "Occasion",
        placeholder: "e.g. Casual",
      },
    ],

    /* ================= HOME ================= */

    Sofa: [
      {
        name: "material",
        label: "Material",
        placeholder: "e.g. Fabric / Leather",
      },
      {
        name: "seatingCapacity",
        label: "Seating Capacity",
        placeholder: "e.g. 3 Seater",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "shape",
        label: "Shape",
        placeholder: "e.g. L-Shape",
      },
      {
        name: "dimensions",
        label: "Dimensions",
        placeholder: "Enter dimensions",
      },
    ],

    Bed: [
      {
        name: "material",
        label: "Material",
        placeholder: "e.g. Wood",
      },
      {
        name: "bedSize",
        label: "Bed Size",
        placeholder: "e.g. Queen / King",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "dimensions",
        label: "Dimensions",
        placeholder: "Enter dimensions",
      },
    ],

    "Dining Table": [
      {
        name: "material",
        label: "Material",
        placeholder: "e.g. Wood",
      },
      {
        name: "seatingCapacity",
        label: "Seating Capacity",
        placeholder: "e.g. 6 Seater",
      },
      {
        name: "shape",
        label: "Shape",
        placeholder: "e.g. Rectangular",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "dimensions",
        label: "Dimensions",
        placeholder: "Enter dimensions",
      },
    ],

    Chair: [
      {
        name: "material",
        label: "Material",
        placeholder: "e.g. Wood / Plastic",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "chairType",
        label: "Chair Type",
        placeholder: "e.g. Office / Dining",
      },
      {
        name: "dimensions",
        label: "Dimensions",
        placeholder: "Enter dimensions",
      },
    ],

    "Table Lamp": [
      {
        name: "material",
        label: "Material",
        placeholder: "e.g. Metal",
      },
      {
        name: "bulbType",
        label: "Bulb Type",
        placeholder: "e.g. LED",
      },
      {
        name: "wattage",
        label: "Wattage",
        placeholder: "e.g. 10W",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
    ],

    "Wall Clock": [
      {
        name: "material",
        label: "Material",
        placeholder: "e.g. Plastic / Wood",
      },
      {
        name: "clockType",
        label: "Clock Type",
        placeholder: "e.g. Analog / Digital",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "dimensions",
        label: "Dimensions",
        placeholder: "Enter dimensions",
      },
    ],

    Curtains: [
      {
        name: "fabric",
        label: "Fabric",
        placeholder: "e.g. Cotton",
      },
      {
        name: "curtainLength",
        label: "Curtain Length",
        placeholder: "Enter length",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "pattern",
        label: "Pattern",
        placeholder: "e.g. Printed",
      },
    ],

    Carpet: [
      {
        name: "material",
        label: "Material",
        placeholder: "e.g. Wool",
      },
      {
        name: "size",
        label: "Size",
        placeholder: "e.g. 5 x 7 ft",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "pattern",
        label: "Pattern",
        placeholder: "e.g. Traditional",
      },
    ],

    /* ================= BEAUTY ================= */

    "Face Wash": [
      {
        name: "skinType",
        label: "Skin Type",
        placeholder: "e.g. Oily / Dry / Normal",
      },
      {
        name: "volume",
        label: "Volume",
        placeholder: "e.g. 100 ml",
      },
      {
        name: "ingredients",
        label: "Key Ingredients",
        placeholder: "Enter key ingredients",
      },
      {
        name: "fragrance",
        label: "Fragrance",
        placeholder: "e.g. Rose / Fragrance Free",
      },
      {
        name: "concern",
        label: "Skin Concern",
        placeholder: "e.g. Acne / Oil Control",
      },
    ],

    Moisturizer: [
      {
        name: "skinType",
        label: "Skin Type",
        placeholder: "e.g. Dry / Oily",
      },
      {
        name: "volume",
        label: "Volume",
        placeholder: "e.g. 50 g",
      },
      {
        name: "ingredients",
        label: "Key Ingredients",
        placeholder: "Enter ingredients",
      },
      {
        name: "spf",
        label: "SPF",
        placeholder: "e.g. SPF 30",
      },
    ],

    Sunscreen: [
      {
        name: "spf",
        label: "SPF",
        placeholder: "e.g. SPF 50",
      },
      {
        name: "skinType",
        label: "Skin Type",
        placeholder: "e.g. All Skin Types",
      },
      {
        name: "volume",
        label: "Volume",
        placeholder: "e.g. 50 ml",
      },
      {
        name: "waterResistant",
        label: "Water Resistant",
        placeholder: "Yes / No",
      },
    ],

    Lipstick: [
      {
        name: "shade",
        label: "Shade",
        placeholder: "Enter shade name",
      },
      {
        name: "finish",
        label: "Finish",
        placeholder: "e.g. Matte / Glossy",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "volume",
        label: "Net Quantity",
        placeholder: "e.g. 4 g",
      },
    ],

    Foundation: [
      {
        name: "shade",
        label: "Shade",
        placeholder: "Enter shade",
      },
      {
        name: "skinType",
        label: "Skin Type",
        placeholder: "e.g. Dry / Oily",
      },
      {
        name: "finish",
        label: "Finish",
        placeholder: "e.g. Matte / Natural",
      },
      {
        name: "volume",
        label: "Net Quantity",
        placeholder: "e.g. 30 ml",
      },
    ],

    Perfume: [
      {
        name: "fragranceType",
        label: "Fragrance Type",
        placeholder: "e.g. Eau de Parfum",
      },
      {
        name: "volume",
        label: "Volume",
        placeholder: "e.g. 100 ml",
      },
      {
        name: "gender",
        label: "Gender",
        placeholder: "Men / Women / Unisex",
      },
      {
        name: "fragranceNotes",
        label: "Fragrance Notes",
        placeholder: "Enter fragrance notes",
      },
    ],

    Shampoo: [
      {
        name: "hairType",
        label: "Hair Type",
        placeholder: "e.g. Dry / Oily",
      },
      {
        name: "volume",
        label: "Volume",
        placeholder: "e.g. 200 ml",
      },
      {
        name: "ingredients",
        label: "Key Ingredients",
        placeholder: "Enter ingredients",
      },
      {
        name: "concern",
        label: "Hair Concern",
        placeholder: "e.g. Dandruff / Hair Fall",
      },
    ],

    "Hair Oil": [
      {
        name: "hairType",
        label: "Hair Type",
        placeholder: "e.g. All Hair Types",
      },
      {
        name: "volume",
        label: "Volume",
        placeholder: "e.g. 200 ml",
      },
      {
        name: "ingredients",
        label: "Key Ingredients",
        placeholder: "Enter ingredients",
      },
      {
        name: "concern",
        label: "Hair Concern",
        placeholder: "e.g. Hair Fall",
      },
    ],

    /* ================= SPORTS ================= */

    "Cricket Bat": [
      {
        name: "material",
        label: "Material",
        placeholder: "e.g. English Willow",
      },
      {
        name: "batSize",
        label: "Bat Size",
        placeholder: "e.g. Full Size",
      },
      {
        name: "weight",
        label: "Weight",
        placeholder: "e.g. 1.2 kg",
      },
      {
        name: "gripType",
        label: "Grip Type",
        placeholder: "Enter grip type",
      },
      {
        name: "playerLevel",
        label: "Player Level",
        placeholder: "e.g. Professional",
      },
    ],

    "Cricket Ball": [
      {
        name: "material",
        label: "Material",
        placeholder: "e.g. Leather",
      },
      {
        name: "ballType",
        label: "Ball Type",
        placeholder: "e.g. Red / White",
      },
      {
        name: "weight",
        label: "Weight",
        placeholder: "e.g. 156 g",
      },
      {
        name: "packOf",
        label: "Pack of",
        placeholder: "e.g. 1",
      },
    ],

    Football: [
      {
        name: "material",
        label: "Material",
        placeholder: "e.g. PU Leather",
      },
      {
        name: "footballSize",
        label: "Football Size",
        placeholder: "e.g. Size 5",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "playingSurface",
        label: "Playing Surface",
        placeholder: "e.g. Grass / Turf",
      },
    ],

    Basketball: [
      {
        name: "material",
        label: "Material",
        placeholder: "e.g. Rubber",
      },
      {
        name: "basketballSize",
        label: "Basketball Size",
        placeholder: "e.g. Size 7",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "playingSurface",
        label: "Playing Surface",
        placeholder: "e.g. Indoor / Outdoor",
      },
    ],

    "Tennis Racket": [
      {
        name: "material",
        label: "Material",
        placeholder: "e.g. Graphite",
      },
      {
        name: "weight",
        label: "Weight",
        placeholder: "e.g. 300 g",
      },
      {
        name: "headSize",
        label: "Head Size",
        placeholder: "e.g. 100 sq in",
      },
      {
        name: "gripSize",
        label: "Grip Size",
        placeholder: "e.g. 4 3/8",
      },
    ],

    "Badminton Racket": [
      {
        name: "material",
        label: "Material",
        placeholder: "e.g. Carbon Fiber",
      },
      {
        name: "weight",
        label: "Weight",
        placeholder: "e.g. 85 g",
      },
      {
        name: "flexibility",
        label: "Flexibility",
        placeholder: "e.g. Medium",
      },
      {
        name: "gripSize",
        label: "Grip Size",
        placeholder: "Enter grip size",
      },
    ],

    "Sports Shoes": [
      {
        name: "shoeSize",
        label: "Shoe Size",
        placeholder: "e.g. 6 / 7 / 8 / 9",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "material",
        label: "Material",
        placeholder: "Enter material",
      },
      {
        name: "shoeType",
        label: "Shoe Type",
        placeholder: "e.g. Running",
      },
      {
        name: "gender",
        label: "Gender",
        placeholder: "Men / Women / Unisex",
      },
    ],

    "Gym Equipment": [
      {
        name: "equipmentType",
        label: "Equipment Type",
        placeholder: "e.g. Dumbbell / Treadmill",
      },
      {
        name: "material",
        label: "Material",
        placeholder: "Enter material",
      },
      {
        name: "weightCapacity",
        label: "Weight Capacity",
        placeholder: "Enter capacity",
      },
      {
        name: "dimensions",
        label: "Dimensions",
        placeholder: "Enter dimensions",
      },
    ],

    /* ================= ACCESSORIES ================= */

    Watch: [
      {
        name: "model",
        label: "Model",
        placeholder: "Enter model",
      },
      {
        name: "dialColor",
        label: "Dial Color",
        placeholder: "Enter dial color",
      },
      {
        name: "strapMaterial",
        label: "Strap Material",
        placeholder: "e.g. Leather",
      },
      {
        name: "watchType",
        label: "Watch Type",
        placeholder: "e.g. Analog / Digital",
      },
      {
        name: "waterResistance",
        label: "Water Resistance",
        placeholder: "e.g. 50 m",
      },
    ],

    Sunglasses: [
      {
        name: "frameMaterial",
        label: "Frame Material",
        placeholder: "e.g. Metal",
      },
      {
        name: "frameColor",
        label: "Frame Color",
        placeholder: "Enter frame color",
      },
      {
        name: "lensColor",
        label: "Lens Color",
        placeholder: "Enter lens color",
      },
      {
        name: "lensType",
        label: "Lens Type",
        placeholder: "e.g. UV Protected",
      },
      {
        name: "gender",
        label: "Gender",
        placeholder: "Men / Women / Unisex",
      },
    ],

    Wallet: [
      {
        name: "material",
        label: "Material",
        placeholder: "e.g. Leather",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "walletType",
        label: "Wallet Type",
        placeholder: "e.g. Bi-fold",
      },
      {
        name: "cardSlots",
        label: "Card Slots",
        placeholder: "e.g. 6",
      },
      {
        name: "compartments",
        label: "Compartments",
        placeholder: "e.g. 2",
      },
    ],

    Belt: [
      {
        name: "material",
        label: "Material",
        placeholder: "e.g. Leather",
      },
      {
        name: "beltSize",
        label: "Belt Size",
        placeholder: "e.g. 32 / 34 / 36",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "buckleType",
        label: "Buckle Type",
        placeholder: "e.g. Pin Buckle",
      },
    ],

    Backpack: [
      {
        name: "material",
        label: "Material",
        placeholder: "e.g. Polyester",
      },
      {
        name: "capacity",
        label: "Capacity",
        placeholder: "e.g. 25 L",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "compartments",
        label: "Compartments",
        placeholder: "e.g. 3",
      },
      {
        name: "laptopCompartment",
        label: "Laptop Compartment",
        placeholder: "Yes / No",
      },
    ],

    Jewellery: [
      {
        name: "material",
        label: "Material",
        placeholder: "e.g. Gold / Silver",
      },
      {
        name: "jewelleryType",
        label: "Jewellery Type",
        placeholder: "e.g. Necklace",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "occasion",
        label: "Occasion",
        placeholder: "e.g. Wedding",
      },
    ],

    "Mobile Cover": [
      {
        name: "compatibleModel",
        label: "Compatible Model",
        placeholder: "e.g. iPhone 15",
      },
      {
        name: "material",
        label: "Material",
        placeholder: "e.g. Silicone",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "coverType",
        label: "Cover Type",
        placeholder: "e.g. Shockproof",
      },
    ],

    Keychain: [
      {
        name: "material",
        label: "Material",
        placeholder: "e.g. Metal",
      },
      {
        name: "design",
        label: "Design",
        placeholder: "Enter design",
      },
      {
        name: "color",
        label: "Color",
        placeholder: "Enter color",
      },
      {
        name: "packOf",
        label: "Pack of",
        placeholder: "e.g. 1",
      },
    ],
  };
    /* =========================================
     PRODUCT VARIANT CONFIGURATION
     
     Each product type can have different
     variant attributes.
     
     Example:
     Smartphone → Color, RAM, Storage
     Laptop → Color, RAM, Storage, Processor
     Bangles → Bangle Size, Color
     Kurti → Size, Color
     Shoes → Shoe Size, Color
  ========================================= */

  const variantConfig = {

    /* ================= ELECTRONICS ================= */

    Smartphone: [
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Black",
      },
      {
        key: "ram",
        label: "RAM",
        placeholder: "e.g. 8GB",
      },
      {
        key: "storage",
        label: "Storage",
        placeholder: "e.g. 128GB",
      },
    ],

    Laptop: [
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Silver",
      },
      {
        key: "ram",
        label: "RAM",
        placeholder: "e.g. 16GB",
      },
      {
        key: "storage",
        label: "Storage",
        placeholder: "e.g. 512GB SSD",
      },
      {
        key: "processor",
        label: "Processor",
        placeholder: "e.g. Intel Core i5",
      },
    ],

    Tablet: [
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Grey",
      },
      {
        key: "ram",
        label: "RAM",
        placeholder: "e.g. 8GB",
      },
      {
        key: "storage",
        label: "Storage",
        placeholder: "e.g. 128GB",
      },
    ],

    "Smart Watch": [
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Black",
      },
      {
        key: "strap",
        label: "Strap",
        placeholder: "e.g. Silicone",
      },
      {
        key: "size",
        label: "Size",
        placeholder: "e.g. 44mm",
      },
    ],

    Headphones: [
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Black",
      },
      {
        key: "type",
        label: "Type",
        placeholder: "e.g. Wireless",
      },
    ],

    "Bluetooth Speaker": [
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Black",
      },
      {
        key: "power",
        label: "Power",
        placeholder: "e.g. 20W",
      },
    ],

    Camera: [
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Black",
      },
      {
        key: "lens",
        label: "Lens",
        placeholder: "e.g. 18-55mm",
      },
      {
        key: "storage",
        label: "Storage",
        placeholder: "e.g. 128GB",
      },
    ],

    Keyboard: [
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Black",
      },
      {
        key: "type",
        label: "Type",
        placeholder: "e.g. Mechanical",
      },
    ],

    Mouse: [
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Black",
      },
      {
        key: "type",
        label: "Type",
        placeholder: "e.g. Wireless",
      },
    ],

    /* ================= FASHION ================= */

    Bangles: [
      {
        key: "size",
        label: "Bangle Size",
        placeholder: "e.g. 2.4",
      },
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Gold",
      },
    ],

    Saree: [
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Red",
      },
      {
        key: "fabric",
        label: "Fabric",
        placeholder: "e.g. Silk",
      },
    ],

    Kurti: [
      {
        key: "size",
        label: "Size",
        placeholder: "e.g. M",
      },
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Blue",
      },
    ],

    "T-Shirt": [
      {
        key: "size",
        label: "Size",
        placeholder: "e.g. M",
      },
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Black",
      },
    ],

    Jeans: [
      {
        key: "size",
        label: "Waist Size",
        placeholder: "e.g. 32",
      },
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Blue",
      },
    ],

    Dress: [
      {
        key: "size",
        label: "Size",
        placeholder: "e.g. M",
      },
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Red",
      },
    ],

    Shoes: [
      {
        key: "size",
        label: "Shoe Size",
        placeholder: "e.g. 8",
      },
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. White",
      },
    ],

    "Sports Shoes": [
      {
        key: "size",
        label: "Shoe Size",
        placeholder: "e.g. 9",
      },
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Black",
      },
    ],

    Handbag: [
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Brown",
      },
      {
        key: "material",
        label: "Material",
        placeholder: "e.g. Leather",
      },
    ],

    Belt: [
      {
        key: "size",
        label: "Size",
        placeholder: "e.g. 32",
      },
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Black",
      },
    ],

    /* ================= HOME ================= */

    Sofa: [
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Grey",
      },
      {
        key: "seatingCapacity",
        label: "Seating Capacity",
        placeholder: "e.g. 3 Seater",
      },
    ],

    Bed: [
      {
        key: "size",
        label: "Bed Size",
        placeholder: "e.g. Queen",
      },
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Brown",
      },
    ],

    "Dining Table": [
      {
        key: "seatingCapacity",
        label: "Seating Capacity",
        placeholder: "e.g. 6 Seater",
      },
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Brown",
      },
    ],

    Chair: [
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Black",
      },
    ],

    "Table Lamp": [
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. White",
      },
    ],

    "Wall Clock": [
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Brown",
      },
    ],

    Curtains: [
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Blue",
      },
      {
        key: "length",
        label: "Length",
        placeholder: "e.g. 7 ft",
      },
    ],

    Carpet: [
      {
        key: "size",
        label: "Carpet Size",
        placeholder: "e.g. 5 x 7 ft",
      },
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Beige",
      },
    ],

    /* ================= BEAUTY ================= */

    "Face Wash": [
      {
        key: "volume",
        label: "Volume",
        placeholder: "e.g. 100 ml",
      },
    ],

    Moisturizer: [
      {
        key: "volume",
        label: "Volume",
        placeholder: "e.g. 50 ml",
      },
    ],

    Sunscreen: [
      {
        key: "volume",
        label: "Volume",
        placeholder: "e.g. 50 ml",
      },
    ],

    Lipstick: [
      {
        key: "shade",
        label: "Shade",
        placeholder: "e.g. Rose Pink",
      },
    ],

    Foundation: [
      {
        key: "shade",
        label: "Shade",
        placeholder: "e.g. Natural Beige",
      },
    ],

    Perfume: [
      {
        key: "volume",
        label: "Volume",
        placeholder: "e.g. 100 ml",
      },
    ],

    Shampoo: [
      {
        key: "volume",
        label: "Volume",
        placeholder: "e.g. 200 ml",
      },
    ],

    "Hair Oil": [
      {
        key: "volume",
        label: "Volume",
        placeholder: "e.g. 200 ml",
      },
    ],

    /* ================= SPORTS ================= */

    "Cricket Bat": [
      {
        key: "batSize",
        label: "Bat Size",
        placeholder: "e.g. Full Size",
      },
      {
        key: "weight",
        label: "Weight",
        placeholder: "e.g. 1.2 kg",
      },
    ],

    "Cricket Ball": [
      {
        key: "ballType",
        label: "Ball Type",
        placeholder: "e.g. Leather",
      },
    ],

    Football: [
      {
        key: "size",
        label: "Football Size",
        placeholder: "e.g. Size 5",
      },
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. White",
      },
    ],

    Basketball: [
      {
        key: "size",
        label: "Basketball Size",
        placeholder: "e.g. Size 7",
      },
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Orange",
      },
    ],

    "Tennis Racket": [
      {
        key: "gripSize",
        label: "Grip Size",
        placeholder: "e.g. G3",
      },
      {
        key: "weight",
        label: "Weight",
        placeholder: "e.g. 300 g",
      },
    ],

    "Badminton Racket": [
      {
        key: "gripSize",
        label: "Grip Size",
        placeholder: "e.g. G5",
      },
      {
        key: "weight",
        label: "Weight",
        placeholder: "e.g. 85 g",
      },
    ],

    "Gym Equipment": [
      {
        key: "weightCapacity",
        label: "Weight Capacity",
        placeholder: "e.g. 100 kg",
      },
    ],

    /* ================= ACCESSORIES ================= */

    Watch: [
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Black",
      },
    ],

    Sunglasses: [
      {
        key: "frameColor",
        label: "Frame Color",
        placeholder: "e.g. Black",
      },
      {
        key: "lensColor",
        label: "Lens Color",
        placeholder: "e.g. Grey",
      },
    ],

    Wallet: [
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Brown",
      },
    ],

    Backpack: [
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Black",
      },
      {
        key: "capacity",
        label: "Capacity",
        placeholder: "e.g. 30 L",
      },
    ],

    Jewellery: [
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Gold",
      },
    ],

    "Mobile Cover": [
      {
        key: "compatibleModel",
        label: "Compatible Model",
        placeholder: "e.g. iPhone 17",
      },
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Black",
      },
    ],

    Keychain: [
      {
        key: "color",
        label: "Color",
        placeholder: "e.g. Silver",
      },
    ],
    };

  const GST_RATES = {
    Smartphone: 18,
    Laptop: 18,
    Tablet: 18,
    TV: 18,

    "T-Shirt": 5,
    Jeans: 5,
    Kurti: 5,
    Dress: 5,

    Shoes: 18,
    Bangles: 5,
    Jewellery: 3,

    "Tennis Racket": 12,
    "Badminton Racket": 12,
    "Gym Equipment": 18,

    Watch: 18,
    Sunglasses: 18,
    Wallet: 18,
    Backpack: 18,
    "Mobile Cover": 18,
    Keychain: 18,
  };

  /* =========================================
     PRODUCTS THAT SUPPORT VARIANTS
  ========================================= */

  const productsWithVariants = [

  /* ================= ELECTRONICS ================= */

  "Smartphone",
  "Laptop",

  /* ================= FASHION ================= */

  "Bangles",
  "Kurti",
  "T-Shirt",
  "Jeans",
  "Dress",
  "Shoes",
];

  /* =========================================
     FORM DATA
  ========================================= */

  const [formData, setFormData] = useState({
    name: "",
    category: "Electronics",
    productType: "Smartphone",
    description: "",
    sizeFit: "",
    materialCare: "",
    price: "",
    originalPrice: "",
    discount: "",
    gstRate: GST_RATES["Smartphone"] || "",
    stock: "",
    brand: "",
  });

  /* =========================================
     DYNAMIC PRODUCT DETAILS
  ========================================= */

  const [productDetails, setProductDetails] =
    useState({});

  /* =========================================
     PRODUCT VARIANTS
  ========================================= */

  const [variantSizes, setVariantSizes] = useState([
  {
    attributes: {},
    price: "",
    discountPrice: "",
    stock: "",
    sku: "",
    available: true,
    images: [],
  },
]);

  /* =========================================
     MULTIPLE IMAGES
  ========================================= */

  const [images, setImages] = useState([]);

  const MAX_IMAGES = 6;

  /* =========================================
     LOADING / ERROR
  ========================================= */

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

const hasVariants = productsWithVariants.includes(formData.productType);




 /* =========================================
   CLEAN IMAGE PREVIEWS
========================================= */

useEffect(() => {
  return () => {
    images.forEach((image) => {
      if (image.preview) {
        URL.revokeObjectURL(image.preview);
      }
    });
  };
}, [images]);

  /* =========================================
     RESET VARIANTS
  ========================================= */

const createEmptyVariant = () => ({
  attributes: {},
  price: "",
  discountPrice: "",
  stock: "",
  sku: "",
  available: true,
  images: [],
});
/* =========================================
   INPUT CHANGE
========================================= */

const handleChange = (e) => {
  const {
    name,
    value,
  } = e.target;

  if (name === "category") {

    const types =
      productTypes[value] || [];

    const newProductType =
      types.length > 0
        ? types[0]
        : "";

    setFormData((current) => ({
      ...current,
      category: value,
      productType: newProductType,
      gstRate: GST_RATES[newProductType] || "",
    }));

    setProductDetails({});

    setVariantSizes([
      createEmptyVariant(),
    ]);

  } else if (name === "productType") {

    setFormData((current) => ({
      ...current,
      productType: value,
      gstRate: GST_RATES[value] || "",
    }));

    setProductDetails({});

    setVariantSizes([
      createEmptyVariant(),
    ]);

  } else {

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

  }

  setError("");
};
  /* =========================================
     PRODUCT DETAIL CHANGE
  ========================================= */

  const handleProductDetailChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setProductDetails(
      (current) => ({
        ...current,
        [name]: value,
      })
    );

    setError("");
  };

  /* =========================================
     ADD VARIANT
  ========================================= */

  const addVariantSize = () => {

    setVariantSizes(
      (current) => [
        ...current,
        createEmptyVariant(),
      ]
    );
  };

  /* =========================================
     UPDATE VARIANT ATTRIBUTE
  ========================================= */

  const updateVariantAttribute = (
    index,
    key,
    value
  ) => {

    setVariantSizes(
      (current) =>
        current.map(
          (variant, i) =>
            i === index
              ? {
                  ...variant,

                  attributes: {
                    ...variant.attributes,
                    [key]: value,
                  },
                }
              : variant
        )
    );

    setError("");
  };

  /* =========================================
     UPDATE VARIANT FIELD
  ========================================= */

  const updateVariantField = (
    index,
    field,
    value
  ) => {

    setVariantSizes(
      (current) =>
        current.map(
          (variant, i) =>
            i === index
              ? {
                  ...variant,
                  [field]: value,
                }
              : variant
        )
    );

    setError("");
  };

  /* =========================================
     REMOVE VARIANT
  ========================================= */

  const removeVariantSize = (index) => {

    setVariantSizes(
      (current) => {

        /*
          Always keep at least one variant
        */

        if (current.length === 1) {

          return [
            createEmptyVariant(),
          ];

        }

        return current.filter(
          (_, i) => i !== index
        );

      }
    );

    setError("");
  };

/* =========================================
   ADD VARIANT IMAGE
   Only Smartphone + Laptop
========================================= */

const handleAddVariantImage = (
  variantIndex,
  e
) => {

  const files = Array.from(
    e.target.files || []
  );

  e.target.value = "";

  if (files.length === 0) {
    return;
  }

  const productType =
    formData.productType;

  if (
    productType !== "Smartphone" &&
    productType !== "Laptop"
  ) {
    return;
  }

  setError("");

  setVariantSizes((current) => {

    return current.map(
      (variant, index) => {

        if (index !== variantIndex) {
          return variant;
        }

        const existingImages =
          variant.images || [];

        if (
          existingImages.length >= 4
        ) {

          setError(
            "Maximum 4 images are allowed for each variant."
          );

          return variant;
        }

        const remainingSlots =
          4 - existingImages.length;

        const selectedFiles =
          files.slice(
            0,
            remainingSlots
          );

        const validImages = [];

        for (
          const file of selectedFiles
        ) {

          if (!validateImage(file)) {
            continue;
          }

          validImages.push({
            file,
            preview:
              URL.createObjectURL(file),
          });
        }

        return {
          ...variant,

          images: [
            ...existingImages,
            ...validImages,
          ],
        };
      }
    );
  });
};


/* =========================================
   REMOVE VARIANT IMAGE
========================================= */

const handleRemoveVariantImage = (
  variantIndex,
  imageIndex
) => {

  setVariantSizes((current) => {

    return current.map(
      (variant, index) => {

        if (index !== variantIndex) {
          return variant;
        }

        const imageToRemove =
          variant.images?.[imageIndex];

        if (
          imageToRemove?.preview
        ) {

          URL.revokeObjectURL(
            imageToRemove.preview
          );

        }

        return {
          ...variant,

          images:
            (variant.images || [])
              .filter(
                (_, i) =>
                  i !== imageIndex
              ),
        };
      }
    );
  });

  setError("");
};

    /* =========================================
     VALIDATE IMAGE
  ========================================= */

  const validateImage = (file) => {

    if (!file) {
      return false;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {

      setError(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );

      return false;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {

      setError(
        "Image size must be less than 5 MB."
      );

      return false;
    }

    return true;
  };

  /* =========================================
     ADD IMAGE
  ========================================= */
const handleAddImage = (e) => {
  const file = e.target.files?.[0];

  e.target.value = "";

  if (!file) {
    return;
  }

  if (!validateImage(file)) {
    return;
  }

  if (images.length >= MAX_IMAGES) {
    setError("Maximum 6 product images are allowed.");
    return;
  }

  const preview = URL.createObjectURL(file);

  setImages((current) => [
    ...current,
    {
      file,
      preview,
    },
  ]);

  setError("");
};


  /* =========================================
     REMOVE IMAGE
  ========================================= */

  const handleRemoveImage = (index) => {

    setImages((current) => {

      const imageToRemove =
        current[index];

      if (
        imageToRemove?.preview
      ) {

        URL.revokeObjectURL(
          imageToRemove.preview
        );

      }

      return current.filter(
        (_, imageIndex) =>
          imageIndex !== index
      );

    });

    setError("");
  };

  /* =========================================
     VALIDATE VARIANTS
  ========================================= */

  const validateVariants = () => {

    /*
      If current product type does not support
      variants, no validation is required.
    */

    if (
      !productsWithVariants.includes(
        formData.productType
      )
    ) {
      return true;
    }

    /*
      Make sure at least one variant exists.
    */

    if (
      !variantSizes ||
      variantSizes.length === 0
    ) {

      setError(
        "Please add at least one product variant."
      );

      return false;
    }

    /*
      Validate every variant.
    */

    for (
      let index = 0;
      index < variantSizes.length;
      index++
    ) {

      const variant =
        variantSizes[index];

      const fields =
        variantConfig[
          formData.productType
        ] || [];

      /*
        Validate product-specific
        variant attributes.
      */

      for (
        const field of fields
      ) {

        const value =
          variant.attributes?.[
            field.key
          ];

        if (
          !value ||
          !String(value).trim()
        ) {

          setError(
            `Please enter ${field.label} for Variant ${index + 1}.`
          );

          return false;
        }

      }

      /*
        Validate price.
      */

      if (
        variant.price === "" ||
        variant.price === null ||
        Number(variant.price) < 0
      ) {

        setError(
          `Please enter a valid price for Variant ${index + 1}.`
        );

        return false;
      }

      /*
        Validate discount price if entered.
      */

      if (
        variant.discountPrice !== "" &&
        Number(variant.discountPrice) < 0
      ) {

        setError(
          `Please enter a valid discount price for Variant ${index + 1}.`
        );

        return false;
      }

      /*
        Discount price should not be greater
        than original variant price.
      */

      if (
        variant.discountPrice !== "" &&
        Number(variant.discountPrice) >
          Number(variant.price)
      ) {

        setError(
          `Discount Price cannot be greater than Price for Variant ${index + 1}.`
        );

        return false;
      }

      /*
        Validate stock.
      */

      if (
        variant.stock === "" ||
        variant.stock === null ||
        Number(variant.stock) < 0
      ) {

        setError(
          `Please enter a valid stock quantity for Variant ${index + 1}.`
        );

        return false;
      }

      /*
        SKU is optional.
        If entered, remove unnecessary spaces.
      */

      if (
        variant.sku &&
        !String(variant.sku).trim()
      ) {

        setError(
          `Please enter a valid SKU for Variant ${index + 1}.`
        );

        return false;
      }
    }

    return true;
  };

  /* =========================================
     SUBMIT PRODUCT
  ========================================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    /* ================================
       BASIC VALIDATION
    ================================= */

    if (
      !formData.name.trim()
    ) {

      setError(
        "Product name is required."
      );

      return;
    }

    if (
      !formData.description.trim()
    ) {

      setError(
        "Product description is required."
      );

      return;
    }

    if (
      !formData.sizeFit.trim()
    ) {

      setError(
        "Size & Fit information is required."
      );

      return;
    }

    if (
      !formData.materialCare.trim()
    ) {

      setError(
        "Material & Care information is required."
      );

      return;
    }

   /*
  Parent price is required only
  for products without variants.
*/

if (!hasVariants) {

  if (
    !formData.price
  ) {

    setError(
      "Selling price is required."
    );

    return;
  }

  if (
    Number(formData.price) < 0
  ) {

    setError(
      "Selling price cannot be negative."
    );

    return;
  }
}

/* =====================================
   ORIGINAL PRICE VALIDATION
===================================== */

if (
  formData.originalPrice &&
  Number(formData.originalPrice) < Number(formData.price)
) {

  setError(
    "Original price cannot be lower than selling price."
  );

  return;
}




    /*
      Parent stock.
    */
if (!hasVariants) {
  if (!formData.stock) {
    setError("Stock quantity is required.");
    return;
  }

  if (Number(formData.stock) < 0) {
    setError("Stock quantity cannot be negative.");
    return;
  }
}
    /* =====================================
       IMAGE VALIDATION
    ====================================== */
const isVariantImageType = ["Smartphone", "Laptop"].includes(
  formData.productType
);

const totalImages = isVariantImageType
  ? variantSizes.reduce(
      (sum, variant) => sum + (variant.images?.length || 0),
      0
    )
  : images.length;

if (totalImages === 0) {
  setError("Please select at least one product image.");
  return;
}

if (!isVariantImageType && images.length > MAX_IMAGES) {
  setError("Maximum 6 product images are allowed.");
  return;
}

    /* =====================================
       VARIANT VALIDATION
    ====================================== */

    if (
      !validateVariants()
    ) {

      return;
    }

    /* ================================
       MERCHANT CHECK
    ================================= */

    if (
      !merchant?.id
    ) {

      setError(
        "Merchant information not found. Please login again."
      );

      return;
    }

    /* ================================
       TOKEN CHECK
    ================================= */

    const token =
      localStorage.getItem(
        "merchant_token"
      );

    if (!token) {

      setError(
        "Authentication token is missing. Please login again."
      );

      return;
    }

    try {

      setLoading(true);
      setError("");

      /* =====================================
         STEP 1:
         UPLOAD ALL IMAGES
      ====================================== */

      const uploadSingleImage = async (file, label) => {
  const imageFormData = new FormData();
  imageFormData.append("image", file);

  const uploadResponse = await fetch(
    `${API_BASE_URL}/api/products/upload-image`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-user-id": String(merchant.id),
      },
      body: imageFormData,
    }
  );

  const uploadText = await uploadResponse.text();
  let uploadData = {};

  try {
    uploadData = JSON.parse(uploadText);
  } catch {
    console.error("Upload returned non-JSON:", uploadText);
  }

  if (!uploadResponse.ok || !uploadData.success) {
    throw new Error(
      uploadData.message ||
        `${label} upload failed (${uploadResponse.status})`
    );
  }

  const url =
    uploadData.image || uploadData.imageUrl || uploadData.url;

  if (!url) {
    throw new Error(`${label} uploaded but no image URL returned.`);
  }

  return url;
};

const uploadedImageUrls = [];
const variantImageUrls = [];

if (isVariantImageType) {
  for (let v = 0; v < variantSizes.length; v++) {
    const urls = [];

    for (let i = 0; i < (variantSizes[v].images || []).length; i++) {
      const url = await uploadSingleImage(
        variantSizes[v].images[i].file,
        `Variant ${v + 1} image ${i + 1}`
      );
      urls.push(url);
    }

    variantImageUrls.push(urls);
    uploadedImageUrls.push(...urls);
  }
} else {
  for (let i = 0; i < images.length; i++) {
    const url = await uploadSingleImage(
      images[i].file,
      `Image ${i + 1}`
    );
    uploadedImageUrls.push(url);
  }
}

      /* =====================================
         MAKE SURE AT LEAST ONE IMAGE EXISTS
      ====================================== */

      if (
        uploadedImageUrls.length === 0
      ) {

        throw new Error(
          "No product image was uploaded."
        );

      }

      /* =====================================
         FIRST IMAGE = PRIMARY IMAGE
      ====================================== */

      const primaryImage =
        uploadedImageUrls[0];

      /* =====================================
         PREPARE VARIANTS
      ====================================== */

     const productVariants =
  productsWithVariants.includes(formData.productType)
    ? variantSizes.map((variant, vIndex) => ({
        attributes: variant.attributes || {},
        price: Number(variant.price),
        discount_price:
          variant.discountPrice !== ""
            ? Number(variant.discountPrice)
            : null,
        stock: Number(variant.stock),
        sku: variant.sku ? String(variant.sku).trim() : null,
        available: Boolean(variant.available),
        images: variantImageUrls[vIndex] || [],
      }))
    : [];

      /* =====================================
         STEP 2:
         ADD PRODUCT
      ====================================== */

      const response =
        await fetch(
          `${API_BASE_URL}/api/products`,
          {
            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,

              "x-user-id":
                String(
                  merchant.id
                ),
            },

            body:
              JSON.stringify({

                merchant_id:
                  Number(
                    merchant.id
                  ),

                name:
                  formData.name.trim(),

                category:
                  formData.category,

                product_type:
                  formData.productType,

                description:
                  formData.description.trim(),

                size_fit:
                  formData.sizeFit.trim(),

                material_care:
                  formData.materialCare.trim(),

              price: hasVariants
  ? Math.min(
      ...variantSizes.map((v) =>
        Number(v.discountPrice || v.price)
      )
    )
  : Number(formData.price),

original_price: hasVariants
  ? Math.min(...variantSizes.map((v) => Number(v.price)))
  : formData.originalPrice
  ? Number(formData.originalPrice)
  : Number(formData.price),

stock: hasVariants
  ? variantSizes.reduce((sum, v) => sum + Number(v.stock || 0), 0)
  : Number(formData.stock),

              discount: (() => {
  const sell = hasVariants
    ? Math.min(...variantSizes.map((v) => Number(v.discountPrice || v.price)))
    : Number(formData.price);

  const orig = hasVariants
    ? Math.min(...variantSizes.map((v) => Number(v.price)))
    : Number(formData.originalPrice);

  return orig > 0 ? Math.max(0, Math.round(((orig - sell) / orig) * 100)) : 0;
})(),

                gst_rate:
                  Number(
                    formData.gstRate
                  ),

               
                brand:
                  formData.brand.trim(),

                /*
                  First image = primary image
                */

                image:
                  primaryImage,

                /*
                  All product images
                */

                product_images:
                  uploadedImageUrls,

                /*
                  Product-specific details
                */

                product_details:
                  productDetails,

              
                product_variants:
                  productVariants,
              }),
          }
        );

      /* =====================================
         READ PRODUCT RESPONSE
      ====================================== */

      const responseText =
        await response.text();

      let data = {};

      try {

        data =
          JSON.parse(
            responseText
          );

      } catch {

        console.error(
          "Product API returned non-JSON:",
          responseText
        );

      }

      if (
        !response.ok
      ) {

        throw new Error(
          data.message ||
          `Failed to add product (${response.status})`
        );

      }

      if (
        !data.success
      ) {

        throw new Error(
          data.message ||
          "Failed to add product"
        );

      }

      /* =====================================
         SUCCESS
      ====================================== */

      alert(
        `Product added successfully with ${uploadedImageUrls.length} image${
          uploadedImageUrls.length > 1
            ? "s"
            : ""
        }!`
      );

      /* =====================================
         RESET FORM
      ====================================== */

      setFormData({

        name: "",

        category:
          "Electronics",

        productType:
          "Smartphone",

        description: "",

        sizeFit: "",

        materialCare: "",

        price: "",

        originalPrice: "",

        discount: "",

        gstRate: GST_RATES["Smartphone"] || "", 

        stock: "",

        brand: "",
      });

      /* =====================================
         RESET PRODUCT DETAILS
      ====================================== */

      setProductDetails({});

      /* =====================================
         RESET VARIANTS
      ====================================== */

      setVariantSizes([
        createEmptyVariant(),
      ]);

      /* =====================================
         CLEAN IMAGE PREVIEWS
      ====================================== */

      images.forEach((image) => {

        if (
          image.preview
        ) {

          URL.revokeObjectURL(
            image.preview
          );

        }

      });

      setImages([]);

      /* =====================================
         REFRESH PRODUCTS
      ====================================== */

      if (
        onProductAdded
      ) {

        onProductAdded(
          data.product ||
          data
        );

      }

    } catch (error) {

      console.error(
        "Add product error:",
        error
      );

      setError(
        error.message ||
        "Unable to add product."
      );

    } finally {

      setLoading(false);

    }

  };
    return (
    <div className="merchant-add-product-page">

      {/* =========================================
          PAGE HEADER
      ========================================== */}

      <div className="merchant-add-product-header">

        <div>
          <h1>Add Product</h1>

          <p>
            Add product information, pricing,
            inventory and specifications.
          </p>
        </div>

    

      </div>


      {/* =========================================
          ERROR MESSAGE
      ========================================== */}

      {error && (
        <div className="merchant-product-error">
          {error}
        </div>
      )}


      {/* =========================================
          MAIN FORM
      ========================================== */}

      <form
        className="merchant-add-product-form"
        onSubmit={handleSubmit}
      >

        {/* =====================================
            PRODUCT INFORMATION
        ====================================== */}

        <div className="merchant-product-section">

          <div className="merchant-section-heading">

            <h2>Product Information</h2>

            <p>
              Enter the basic information
              about your product.
            </p>

          </div>


          {/* PRODUCT NAME */}

          <div className="merchant-form-group full">

            <label>
              Product Name
              <span>*</span>
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              disabled={loading}
            />

          </div>


          {/* PRODUCT DESCRIPTION */}

          <div className="merchant-form-group full">

            <label>
              Product Description
              <span>*</span>
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter detailed product description..."
              rows="5"
              disabled={loading}
            />

          </div>


          {/* CATEGORY */}

          <div className="merchant-form-group">

            <label>
              Category
              <span>*</span>
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={loading}
            >

              {Object.keys(productTypes).map(
                (category) => (

                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>

                )
              )}

            </select>

          </div>


          {/* PRODUCT TYPE */}

          <div className="merchant-form-group">

            <label>
              Product Type
              <span>*</span>
            </label>

            <select
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              disabled={loading}
            >

              {(
                productTypes[
                  formData.category
                ] || []
              ).map(
                (type) => (

                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>

                )
              )}

            </select>

          </div>


          {/* BRAND */}

          <div className="merchant-form-group">

            <label>
              Brand
            </label>

            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Enter brand name"
              disabled={loading}
            />

          </div>
                        {/* GST RATE */}

          <div className="merchant-form-group">

            <label>
              GST Rate (%)
              <span>*</span>
            </label>

           <input
  type="number"
  name="gstRate"
  value={formData.gstRate}
  readOnly
  disabled={loading}
/>
           <small>
  GST is automatically applied based on the selected product type.
</small>

          </div>




          {/* SIZE & FIT */}

          <div className="merchant-form-group">

            <label>
              Size & Fit
              <span>*</span>
            </label>

            <input
              type="text"
              name="sizeFit"
              value={formData.sizeFit}
              onChange={handleChange}
              placeholder="e.g. Regular fit, M/L/XL"
              disabled={loading}
            />

          </div>


          {/* MATERIAL & CARE */}

          <div className="merchant-form-group full">

            <label>
              Material & Care
              <span>*</span>
            </label>

            <textarea
              name="materialCare"
              value={formData.materialCare}
              onChange={handleChange}
              placeholder="Enter material and care instructions..."
              rows="4"
              disabled={loading}
            />

          </div>

        </div>


        {/* =====================================
            PRODUCT SPECIFIC DETAILS
        ====================================== */}

        {productFields[
          formData.productType
        ] && (

          <div className="merchant-product-section">

            <div className="merchant-section-heading">

              <h2>
                {formData.productType} Details
              </h2>

              <p>
                Enter specifications specific
                to this product type.
              </p>

            </div>


            <div className="merchant-product-specific-grid">

              {productFields[
                formData.productType
              ].map(
                (field) => (

                  <div
                    className="merchant-form-group"
                    key={field.name}
                  >

                    <label>
                      {field.label}

                      {field.required && (
                        <span>*</span>
                      )}
                    </label>


                    {field.type ===
                      "textarea" ? (

                      <textarea
                        name={field.name}
                        value={
                          productDetails[
                            field.name
                          ] || ""
                        }
                        onChange={
                          handleProductDetailChange
                        }
                        placeholder={
                          field.placeholder
                        }
                        rows="4"
                        disabled={loading}
                      />

                    ) : field.type ===
                      "select" ? (

                      <select
                        name={field.name}
                        value={
                          productDetails[
                            field.name
                          ] || ""
                        }
                        onChange={
                          handleProductDetailChange
                        }
                        disabled={loading}
                      >

                        <option value="">
                          Select
                        </option>

                        {(
                          field.options || []
                        ).map(
                          (option) => (

                            <option
                              key={option}
                              value={option}
                            >
                              {option}
                            </option>

                          )
                        )}

                      </select>

                    ) : (

                      <input
                        type={
                          field.type ||
                          "text"
                        }
                        name={field.name}
                        value={
                          productDetails[
                            field.name
                          ] || ""
                        }
                        onChange={
                          handleProductDetailChange
                        }
                        placeholder={
                          field.placeholder
                        }
                        disabled={loading}
                      />

                    )}

                  </div>

                )
              )}

            </div>

          </div>

        )}


        {/* =====================================
            PRODUCT VARIANTS
        ====================================== */}

        {productsWithVariants.includes(
          formData.productType
        ) && (

          <div className="merchant-product-section">

            <div className="merchant-section-heading">

              <h2>
                {formData.productType} Variants
              </h2>

              <p>
                Add different combinations
                of product specifications,
                price and stock.
              </p>

            </div>


            <div className="variant-size-section">

              <div className="variant-size-header">

                <div>

                  <label>
                    Product Variants
                    <span>*</span>
                  </label>

                  <p>
                    Add as many variants as
                    required.
                  </p>

                </div>


                <button
                  type="button"
                  className="add-size-button"
                  onClick={addVariantSize}
                  disabled={loading}
                >
                  + Add Variant
                </button>

              </div>


              <div className="variant-size-list">

                {variantSizes.map(
                  (variant, index) => (

                    <div
                      className="product-variant-card"
                      key={index}
                    >

                      {/* VARIANT HEADER */}

                      <div className="product-variant-card-header">

                        <h4>
                          Variant {index + 1}
                        </h4>

                        <button
                          type="button"
                          className="remove-size-button"
                          onClick={() =>
                            removeVariantSize(
                              index
                            )
                          }
                          disabled={
                            loading ||
                            variantSizes.length === 1
                          }
                          title="Remove variant"
                        >
                          ×
                        </button>

                      </div>


                      {/* VARIANT FIELDS */}

                      <div className="variant-fields-grid">

                        {(
                          variantConfig[
                            formData.productType
                          ] || []
                        ).map(
                          (field) => (

                            <div
                              className="variant-input-group"
                              key={field.key}
                            >

                              <label>
                                {field.label}
                              </label>

                              <input
                                type="text"
                                value={
                                  variant
                                    .attributes?.[
                                      field.key
                                    ] || ""
                                }
                                onChange={(e) =>
                                  updateVariantAttribute(
                                    index,
                                    field.key,
                                    e.target.value
                                  )
                                }
                                placeholder={
                                  field.placeholder
                                }
                                disabled={loading}
                              />

                            </div>

                          )
                        )}


                        {/* PRICE */}

                        <div className="variant-input-group">

                          <label>
                            Price
                          </label>

                          <div className="variant-price-input">

                            <span>₹</span>

                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={
                                variant.price
                              }
                              onChange={(e) =>
                                updateVariantField(
                                  index,
                                  "price",
                                  e.target.value
                                )
                              }
                              placeholder="0"
                              disabled={loading}
                            />

                          </div>

                        </div>


                        {/* DISCOUNT PRICE */}

                        <div className="variant-input-group">

                          <label>
                            Discount Price
                          </label>

                          <div className="variant-price-input">

                            <span>₹</span>

                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={
                                variant.discountPrice
                              }
                              onChange={(e) =>
                                updateVariantField(
                                  index,
                                  "discountPrice",
                                  e.target.value
                                )
                              }
                              placeholder="0"
                              disabled={loading}
                            />

                          </div>

                        </div>


                        {/* STOCK */}

                        <div className="variant-input-group">

                          <label>
                            Stock
                          </label>

                          <input
                            type="number"
                            min="0"
                            value={
                              variant.stock
                            }
                            onChange={(e) =>
                              updateVariantField(
                                index,
                                "stock",
                                e.target.value
                              )
                            }
                            placeholder="Quantity"
                            disabled={loading}
                          />

                        </div>

{/* SKU - SMARTPHONE ONLY */}

{formData.productType ===
  "Smartphone" && (

  <div className="variant-input-group">

    <label>
      SKU
    </label>

    <input
      type="text"
      value={
        variant.sku
      }
      onChange={(e) =>
        updateVariantField(
          index,
          "sku",
          e.target.value
        )
      }
      placeholder="e.g. PROD-BLK-128"
      disabled={loading}
    />

  </div>

)}


                        {/* AVAILABLE */}

                        <div className="variant-availability-group">

                          <label>

                            <input
                              type="checkbox"
                              checked={
                                variant.available
                              }
                              onChange={(e) =>
                                updateVariantField(
                                  index,
                                  "available",
                                  e.target.checked
                                )
                              }
                              disabled={loading}
                            />

                            Available for sale

                          </label>

                        </div>
{/* VARIANT IMAGES - SMARTPHONE + LAPTOP ONLY */}

{(
  formData.productType === "Smartphone" ||
  formData.productType === "Laptop"
) && (

  <div className="variant-images-section">

    <div className="variant-images-header">

      <div>

        <h5>
          Images for this variant
        </h5>

        <p>
          Maximum 4 images, 5MB each.
        </p>

      </div>

      <label className="variant-upload-button">

        <input
          type="file"
          accept="
            image/jpeg,
            image/jpg,
            image/png,
            image/webp
          "
          multiple
          onChange={(e) =>
            handleAddVariantImage(
              index,
              e
            )
          }
          disabled={
            loading ||
            (variant.images || []).length >= 4
          }
          hidden
        />

        ⬆ Upload Images

      </label>

    </div>

    {variant.images &&
      variant.images.length > 0 && (

      <div className="variant-image-preview-grid">

        {variant.images.map(
          (image, imageIndex) => (

            <div
              className="variant-image-preview-card"
              key={imageIndex}
            >

              <img
                src={image.preview}
                alt={`Variant ${
                  index + 1
                } Image ${
                  imageIndex + 1
                }`}
              />

              <button
                type="button"
                onClick={() =>
                  handleRemoveVariantImage(
                    index,
                    imageIndex
                  )
                }
                disabled={loading}
              >
                ×
              </button>

            </div>

          )
        )}

      </div>

    )}

  </div>

)}
                      </div>

                    </div>

                  )
                )}

              </div>


              <p className="variant-size-help">

                Add as many variants as required.
                Each variant can have its own
                specifications, price and stock.

              </p>

            </div>

          </div>

        )}


        {/* =====================================
            PRICE & INVENTORY
        ====================================== */}

        {!productsWithVariants.includes(
  formData.productType
) && (

  <div className="merchant-product-section">

          <div className="merchant-section-heading">

            <h2>
              Pricing & Inventory
            </h2>

            <p>
              Enter product pricing and
              available stock.
            </p>

          </div>


          <div className="merchant-product-specific-grid">


            {/* SELLING PRICE */}

            <div className="merchant-form-group">

              <label>
                Selling Price
                <span>*</span>
              </label>

              <div className="merchant-price-input">

                <span>₹</span>

                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                />

              </div>

            </div>


            {/* ORIGINAL PRICE */}

            <div className="merchant-form-group">

              <label>
                Original Price
              </label>

              <div className="merchant-price-input">

                <span>₹</span>

                <input
                  type="number"
                  name="originalPrice"
                  min="0"
                  step="0.01"
                  value={
                    formData.originalPrice
                  }
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                />

              </div>

            </div>


            {/* DISCOUNT */}
<div className="merchant-form-group">

  <label>
    Discount
  </label>

  <div className="merchant-price-input merchant-auto-discount">

    <input
      type="text"
      value={
        formData.originalPrice &&
        Number(formData.originalPrice) > 0 &&
        Number(formData.price) >= 0
          ? `${Math.max(
              0,
              Math.round(
                (
                  (Number(formData.originalPrice) -
                    Number(formData.price)) /
                  Number(formData.originalPrice)
                ) *
                  100
              )
            )}% OFF`
          : "0% OFF"
      }
      readOnly
      disabled={loading}
    />

  </div>

</div>

            {/* STOCK */}

            <div className="merchant-form-group">

              <label>
                Stock Quantity
                <span>*</span>
              </label>

              <input
                type="number"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter stock quantity"
                disabled={loading}
              />

            </div>

          </div>

        </div>
)}

{/* =====================================
    PRODUCT IMAGES
====================================== */}

{!["Smartphone", "Laptop"].includes(formData.productType) && (
  <div className="merchant-product-section">
    <div className="merchant-section-heading">
      <h2>Product Images</h2>

    <p>
      Add product images. The first image will be
      the primary product image.
    </p>

  </div>


  <div className="merchant-image-upload-area">

    <label className="merchant-image-upload-box">

      <input
        type="file"
        accept="
          image/jpeg,
          image/jpg,
          image/png,
          image/webp
        "
        onChange={handleAddImage}
        disabled={
          loading ||
          images.length >= MAX_IMAGES
        }
        hidden
      />

      <div className="merchant-upload-icon">
        +
      </div>

      <strong>
        {images.length >= MAX_IMAGES
          ? "Maximum Images Added"
          : "Add Product Image"
        }
      </strong>

      <span>
        JPG, PNG, WEBP up to 5MB
      </span>

      <small>
        {images.length}/{MAX_IMAGES} images
      </small>

    </label>


    {/* IMAGE PREVIEWS */}

    {images.length > 0 && (

      <div className="merchant-image-preview-grid">

        {images.map((image, index) => (

          <div
            className="merchant-image-preview-card"
            key={index}
          >

            <img
              src={image.preview}
              alt={`Product ${index + 1}`}
            />


            <div className="merchant-image-preview-label">
              Product Image {index + 1}
            </div>


            {index === 0 && (

              <span className="merchant-primary-image-badge">
                Primary
              </span>

            )}


            <button
              type="button"
              className="merchant-remove-image-button"
              onClick={() =>
                handleRemoveImage(index)
              }
              disabled={loading}
              title="Remove image"
            >
              ×
            </button>

          </div>

        ))}

      </div>

    )}

  </div>

</div>
)}

{/* =====================================
    FORM ACTIONS
====================================== */}

<div className="merchant-add-product-actions">

  <button
    type="button"
    className="merchant-cancel-button"
    onClick={onBack}
    disabled={loading}
  >
    Cancel
  </button>

  <button
    type="submit"
    className="merchant-submit-product-button"
    disabled={loading}
  >
    {loading
      ? "Adding Product..."
      : "Add Product"}
  </button>

</div>

      </form>

    </div>
  );
}

export default AddProduct;