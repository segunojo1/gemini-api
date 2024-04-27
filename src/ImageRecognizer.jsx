import React, { useCallback, useRef, useState } from 'react';
import axios from 'axios';
import gemini from './gemini';
import { GoogleGenerativeAI, HarmCategory,
  HarmBlockThreshold, } from "@google/generative-ai";
import Webcam from 'react-webcam';

const ImageRecognizer = () => {
    const API_KEY = import.meta.env.VITE_GEMINI_KEY;
  const genAI = new GoogleGenerativeAI(API_KEY);

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.NONE,
    },
  ];

  const [image, setImage] = useState(null);
  const [bitImage, setBitImage] = useState('');
  const [result, setResult] = useState('');
  const [queryText, setQueryText] = useState('');

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    getBase64(file).then(file => {
      setImage(file);
    }).catch(e => console.log(e))

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
        queryText ? queryText : 'Whats in this image?', bitImage
    ], safetySettings);
    const response = await result.response;
    const text = response.text();
    setResult(text);
  };

  const camRef = useRef(null);

  const capture = useCallback(() => {
    const imgg = camRef.current.getScreenshot();
    setImage(imgg);
  }, [camRef])

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      {/* <Webcam height={600} width={600} ref={camRef}/> */}
      <button onClick={capture}>Take pic</button>
      <input type="text" value={queryText} onChange={(e) => setQueryText(e.target.value)}/>
      <img src={image} alt="" />
      <button onClick={handleRecognize}>Recognize Image</button>
      <p>Result: {result}</p>
    </div>
  );
};

export default ImageRecognizer;
