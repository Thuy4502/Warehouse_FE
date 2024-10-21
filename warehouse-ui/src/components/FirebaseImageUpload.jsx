import React, { useEffect, useState } from 'react'

import {listAll, ref, uploadBytes} from 'firebase/storage'
import {v4} from 'uuid'
// import { imageDb } from '../config/FirebaseConfig';

const FirebaseImageUpload = () => {
    // const [img, setImg] = useState('');
    // const handleClick = () => {
    //     const imgRef = ref(imageDb, `books/${v4()}`)
    //     uploadBytes(imgRef)
    // }

    // useEffect(() => {
    //     listAll(ref(imageDb, "file")).then(imgs=> {
    //         console.log(imgs)
    //     })
    // })

  return (
    <div>
        <input type="file" onChange={(e) => setImg(e.target.files[0])}/>
        <button onClick={handleClick}>Upload</button>
    </div>
  )
}

export default FirebaseImageUpload
