import { useState } from "react";
import "./AddPhotoBlock.css";
import axios from "axios";

const AddPhotoBlock = (props)=>{
    const role = props.role;
    const id = props.objectId;
    const [file, setFile] = useState(null);
    const [text, setText] = useState("");
    
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('file', file);
    
            // Замените URL на свой серверный endpoint для загрузки файлов
            const response = await axios.post(`https://localhost:7166/Photo/HandleFileUpload/${id}?role=${role}`, formData, {//3-item 4 -manuf
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setText(response.data);
            console.log('File uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading file:', error.message);
        }
    }
    
return(
    <div className="addPhotoBlock">
        <h1 className="cardHeading">Изменить фото:</h1>
    <input type="file" accept=".jpg" onChange={handleFileChange} className="inputNumberCard"/>
        <button onClick={handleUpload} className="addButt">Upload</button>
        {text}
    </div>
);
}

export default AddPhotoBlock;