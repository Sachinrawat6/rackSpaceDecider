import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { useResetNotifier } from "./useResetNotifier";
import Notification from "./Notification";
import sets from "./data.js";



const Upload = () => {
  const [csvData, setCsvData] = useState([]);
  const sendNotification = useResetNotifier();
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState("");
  const [products, setProducts] = useState([]);

  const API_URI = "https://sachinrawat6.github.io/api/";
  const fetchProducts = async () => {
    try {
      const res = await fetch(API_URI);
      const data = await res.json();
      setProducts(data);
      console.log(data);
    } catch (error) {
      console.log("Failed to fetch orders", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

   

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const allRows = results.data;

        const matchedFields = allRows
          .filter((p) => p["Product Sku Code"] !== "unmapped")
          .map((row) => ({
            sku: row["Product Sku Code"],
          }));

        setCsvData(matchedFields);
      },
    });
  };
  console.log(sets)


const handleDownload = (inventoryAction) => {
    if (!csvData.length) return;
  
    const rowsToExport = [];
  
    csvData.forEach((row) => {
      const [style, ...rest] = row.sku.split("-");
      const suffix = rest.join("-");
  
      // Check if the style is in sets
      const matchSet = sets.find((s) => s.id == style);
  
      if (matchSet) {
        // Replace with two SKUs
        [matchSet.style1, matchSet.style2].forEach((newStyle) => {
          const fullSku = `${newStyle}-${suffix}`;
          const matchedProduct = products.find((p) => p.style == newStyle);
          rowsToExport.push({
            DropshipWarehouseId: "22784",
            "Item SkuCode": fullSku,
            InventoryAction: inventoryAction,
            QtyIncludesBlocked: "",
            Qty: inventoryAction === "ADD" ? "1" : "0",
            RackSpace: matchedProduct?.rackSpace || "Default",
            "Last Purchase Price": "",
            Notes: "",
          });
        });
      } else {
        // Normal product
        const matched = products.find((p) => p.style == style);
        rowsToExport.push({
          DropshipWarehouseId: "22784",
          "Item SkuCode": row.sku,
          InventoryAction: inventoryAction,
          QtyIncludesBlocked: "",
          Qty: inventoryAction === "ADD" ? "1" : "0",
          RackSpace: matched?.rackSpace || "Default",
          "Last Purchase Price": "",
          Notes: "",
        });
      }
    });
  
    const csv = Papa.unparse(rowsToExport);
  
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      "UpdateInStockQtyAnd_orLastPurchasePrice.csv"
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    if (inventoryAction === "RESET") {
      sendNotification(name);
      setSuccess(true);
    }
  };
  



  const names = ["Tanishq", "Kajal", "Alok", "Tushar"];

  return (
    <>
      <Notification state={success} />
      <div className="p-4 w-xl mx-auto mt-20 bg-gray-50 text-center">
        <h1 className="m-2 text-center font-bold">Upload order info sheet</h1>
        <input
          type="file"
          className="border border-gray-200 py-2 px-4 rounded cursor-pointer"
          accept=".csv"
          onChange={handleFileChange}
        />
      </div>

      {/* Download Buttons */}
      <div
        className={`${
          csvData.length === 0 ? "hidden" : "block"
        } flex gap-4 justify-center mt-4`}
      >
          <button
          onClick={() => handleDownload("RESET")}
          disabled={csvData.length <= 0 || name === ""}
          className={`px-4 py-2 rounded cursor-pointer duration-75 
    ${
      csvData.length <= 0 || name === ""
        ? "bg-gray-300 text-gray-500 cursor-not-allowed hidden"
        : "bg-red-500 text-white hover:bg-red-400 block"
    }`}
        >
          Download Reset Stock
        </button>
        <button
          onClick={() => handleDownload("ADD")}
          disabled={csvData.length <= 0 || name === ""}
          className={`px-4 py-2 rounded cursor-pointer duration-75 
    ${
      csvData.length <= 0 || name === ""
        ? "bg-gray-300 text-gray-500 cursor-not-allowed hidden"
        : "bg-blue-500 text-white hover:bg-blue-400 block"
    }`}
        >
          Download Stock
        </button>

      

        <select
          className="border border-gray-200 px-2 py-3 bg-yellow-400  "
          onChange={(e) => setName(e.target.value)}
        >
          <option value="">Select Your Name</option>
          {names.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div
        className={` container mx-auto mt-4 ${
          csvData.length === 0 ? "hidden" : "block mx-auto"
        }`}
      >
        <table className={`mx-auto`}>
          <thead>
            <tr className="border border-gray-200">
              <th className="border bg-gray-50 border-gray-200 py-2 px-4">
                DropshipWarehouseId
              </th>
              <th className="border bg-gray-50 border-gray-200 py-2 px-4">
                Item SkuCode
              </th>
              <th className="border bg-gray-50 border-gray-200 py-2 px-4">
                InventoryAction
              </th>
              <th className="border bg-gray-50 border-gray-200 py-2 px-4">
                QtyIncludesBlocked
              </th>
              <th className="border bg-gray-50 border-gray-200 py-2 px-4">
                Qty
              </th>
              <th className="border bg-gray-50 border-gray-200 py-2 px-4">
                RackSpace
              </th>
              <th className="border bg-gray-50 border-gray-200 py-2 px-4">
                Last Purchase Price
              </th>
              <th className="border bg-gray-50 border-gray-200 py-2 px-4">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {csvData.map((row, index) => {
              const styleNumber = row.sku.split("-")[0];
              const match = products.find((p) => p.style == styleNumber);

              return (
                <tr key={index} className="border border-gray-200 text-center">
                  <td className="py-2 border border-gray-100">22784</td>
                  <td className="py-2 border border-gray-100">{row.sku}</td>
                  <td className="py-2 border border-gray-100">ADD</td>
                  <td className="py-2 border border-gray-100"></td>
                  <td className="py-2 border border-gray-100">1</td>
                  <td className="py-2 border border-gray-100">
                    {match?.rackSpace || "Default"}
                  </td>
                  <td className="py-2 border border-gray-100"></td>
                  <td className="py-2 border border-gray-100"></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Upload;
