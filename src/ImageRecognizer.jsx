import React, { useState } from 'react';
import axios from 'axios';
import gemini from './gemini';
import { GoogleGenerativeAI } from "@google/generative-ai";

const ImageRecognizer = () => {
    const API_KEY = import.meta.env.VITE_GEMINI_KEY;
  const genAI = new GoogleGenerativeAI(API_KEY);

  const [image, setImage] = useState(null);
  const [bitImage, setBitImage] = useState('');
  const [result, setResult] = useState('');

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    getBase64(file)
    .then(file => {
      setImage(file);
    })
    .catch(e => console.log(e))

    generativeFile(file).then(
        (img) => {
            setBitImage(img);
        }
    )
  };

    const generativeFile = async (file) => {
        const base64EncodedDataPromise = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(file);
        });

        return {
            inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
        };
    }
    const getBase64 = (file) => new Promise(function (resolve, reject) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject('Error: ', error);
})

  const handleRecognize = async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const result = await model.generateContent([
        "What's in this photo and what is the required prescription?", bitImage
    ]);
    const response = await result.response;
    const text = response.text();
    setResult(text);
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleRecognize}>Recognize Image</button>
      <p>Result: {result}</p>
    </div>
  );
};

export default ImageRecognizer;
