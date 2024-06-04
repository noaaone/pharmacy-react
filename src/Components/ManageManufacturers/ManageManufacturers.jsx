import React, { useEffect, useState } from "react";
import "./ManageManufacturers.css";
import axios from "axios";
import AddPhotoBlock from "../AddPhotoBlock/AddPhotoBlock";

function ManageManufacturers() {
  const [manufacturers, setManufacturers] = useState([]);
  const [selectedManufacturerId, setSelectedManufacturerId] = useState(null);
  const [icons, setIcons] = useState({});
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    axios
      .get("https://localhost:7166/Admin/GetManufacturerList")
      .then((response) => {
        setManufacturers(response.data);
        initializeIcons(response.data);
      })
      .catch((error) => console.log(error.response.data));
  }, []);

  function handleDeleteManufacturer(manufacturerId) {
    axios
      .delete("https://localhost:7166/Admin/DeleteManufacturer?id=" + manufacturerId)
      .then(() => {
        const updatedManufacturers = manufacturers.filter((manufacturer) => manufacturer.id !== manufacturerId);
        setManufacturers(updatedManufacturers);
        initializeIcons(updatedManufacturers);
      })
      .catch((error) => console.log(error.response.data));
  }

  function handleAddManufacturer() {
    if (name.trim() === "" || country.trim() === "" || phone.trim() === "" || email.trim() === "") {
      setText("Пожалуйста, заполните все поля.");
      return;
    }

    const newManufacturer = {
      name: name,
      country: country,
      phone: phone,
      email: email,
    };

    axios
      .post("https://localhost:7166/Admin/AddManufacturer", newManufacturer)
      .then((response) => {
        axios
          .get("https://localhost:7166/Admin/getManufacturerList")
          .then((response) => {
            setManufacturers(response.data)
            initializeIcons(response.data);
          })
          .catch((error) => console.log(error.response.data));

        setName("");
        setCountry("");
        setPhone("");
        setEmail("");
        setText("");
      })
      .catch((error) => {
        setText(error.response.data);
        console.log(error.response.data)
      });
  }

  function initializeIcons(manufacturerList) {
    const iconsData = {};
    manufacturerList.forEach((manufacturer) => {
      iconsData[manufacturer.id] = "/images/down.png";
    });
    setIcons(iconsData);
  }
  function handleIcon(manufacturerId) {
    if (selectedManufacturerId === manufacturerId) {
      setIcons((prevIcons) => ({
        ...prevIcons,
        [manufacturerId]: "/images/down.png",
      }));
      setSelectedManufacturerId(null);
    } else {
      const updatedIcons = Object.keys(icons).reduce((acc, iconId) => {
        return {
          ...acc,
          [iconId]: "/images/down.png",
        };
      }, {});

      setIcons({
        ...updatedIcons,
        [manufacturerId]: "/images/up.png",
      });
      setSelectedManufacturerId(manufacturerId);
    }
  }

  return (
    <>
      <div className="addManufacturer">
        <h2 className="manHeading">Добавить производителя</h2>
        <input
          placeholder="Введите имя производителя"
          className="addManufacturerInput"
          maxLength="30"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Введите страну производителя"
          className="addManufacturerInput"
          maxLength="30"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <input
          placeholder="Введите телефон"
          className="addManufacturerInput"
          maxLength="15"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          placeholder="Введите email"
          className="addManufacturerInput"
          maxLength="35"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="addButton" onClick={handleAddManufacturer}>
          Добавить
        </button>
        <h5>{text}</h5>
      </div>

      <div className="manufacturerBlock">
        <h2 className="manHeading">Управление производителями</h2>

        <table className="manufacturer-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Страна</th>
              <th>Телефон</th>
              <th>Удалить</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {manufacturers.map((manufacturer) => (
              <React.Fragment key={manufacturer.id}>
                <tr key={manufacturer.id}>
                  <td>{manufacturer.id}</td>
                  <td>{manufacturer.name}</td>
                  <td>{manufacturer.country}</td>
                  <td>{manufacturer.phone}</td>
                  <td>
                    <button onClick={() => handleDeleteManufacturer(manufacturer.id)}>
                      Удалить
                    </button>
                  </td>
                  <td>
                    <img
                      src={icons[manufacturer.id]}
                      alt="Иконка вниз"
                      className="downIcon"
                      onClick={() => handleIcon(manufacturer.id)}
                    />
                  </td>
                </tr>
                {selectedManufacturerId === manufacturer.id && (
                  <tr>
                    <td colSpan="6">
                      <AddPhotoBlock objectId={manufacturer.id} role={4} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ManageManufacturers;