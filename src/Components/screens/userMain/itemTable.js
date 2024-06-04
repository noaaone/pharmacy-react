import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './itemTable.css';

const ItemTable = ({ items }) => {
   
  const navigate = useNavigate();
  const [updatedItems, setUpdatedItems] = useState([]);
  const handleViewItem = (item) => {
    navigate("/itemView", { state: { item } });
  };
  const handleViewManufacturer = (manufacturerId) => {
    navigate("/manufacturerProfile", { state: { manufacturerId } });
  };

  useEffect(() => {
    const fetchItemData = async () => {
      const updatedItems = await Promise.all(
        items.map(async (item) => {
          if (item.manufacturerId) {
            try {
              const response = await axios.get(
                `https://localhost:7166/Admin/getManufacturerNameById?id=${item.manufacturerId}`
              );
              item.manufacturerName = response.data;
            } catch (error) {
              console.log(error);
            }
          }

        
          return item;
        })
      );

      setUpdatedItems(updatedItems);
    };

    fetchItemData();
  }, [items]);

  return (<>
    <h1 className='itemHeading'>Доступные товары</h1>
    <table className="table-style">
      <thead>
        <tr>
          <th className="textCell">Название</th>
          <th className="textCell">Производитель</th>
          <th className="textCell">Цена</th>
          <th className="textCell">Подробнее</th>
        </tr>
      </thead>
      <tbody>
        {updatedItems.map((item) => (
          <tr key={item.id} className="tableRow">
            <td className="textCell">{item.itemName}</td>
            <td className="textCell">
            <button
              onClick={() => handleViewManufacturer(item.manufacturerId)}
              style={{ textDecoration: 'none', backgroundColor: '#fff', border: 'none', cursor: 'pointer', padding: '0' }}>
              <p className="manufacturerLink" title="Перейти в профиль" style={{ textDecoration: 'none', margin: '0' }}>
                {item.manufacturerName}
              </p>
            </button>
            </td>
            <td className="textCell">{item.price}</td>
            <td>
              <button onClick={() => handleViewItem(item)} className='moreButton'>Подробнее</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </>
  );
};

export default ItemTable;