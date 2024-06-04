import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

// eslint-disable-next-line
const data = [
  { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
];

const PriceChart = (props) => {
    const { itemId } = props;
const [recentPrices, setRecentPrices] = useState([]);

// eslint-disable-next-line
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    return date.toLocaleDateString('ru-RU', options);
}

    useEffect(() => {
        
        if (!itemId) return; // если item не определено, то ничего не делаем
    
        axios.get("https://localhost:7166/Admin/getRecentPricesList?id=" + itemId)
          .then(response => {
            if (Array.isArray(response.data) && response.data.length > 0) {
              const formattedPrices = response.data.map(price => ({
                ...price,
                date: formatDate(price.date),
              }));
              setRecentPrices(formattedPrices);
            }
          })
          .catch(error => {
            console.log(error); // можно добавить обработку ошибок
          });
      }, [itemId]); // добавляем зависимость от item, чтобы запрос выполнялся только при его изменении
      
return <>
  <LineChart width={1500} height={600} data={recentPrices}>
    <Line type="monotone" dataKey="price" stroke="red" name="Цена" />
    <CartesianGrid stroke="#ccc" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Legend />
  </LineChart></>
};

export default PriceChart;