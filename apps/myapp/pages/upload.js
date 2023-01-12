import axios from "axios"
import { useState } from "react"
import { useRouter } from 'next/router'
import {AUTH_TOKEN_KEY} from "../utils/app.constants"
export default function upload() {
    const [file, setFile] = useState(null);
    const [resolutionFiles, setResolutionFiles] = useState([]);

    const router = useRouter()
    async function onSubmit(event) {
        event.preventDefault()
        if (file) {
            const formData = new FormData();
            formData.set('image', file)
            const res = await axios.post(`http://localhost:3001/upload`, formData, {
                headers: {
                    'Authorization': localStorage.getItem(AUTH_TOKEN_KEY, null)
                }
            }).catch(err => {
                console.log(err)
                router.push('/login')
            })
            setResolutionFiles(res.data.data)
        }
    }

    function renderResolutions() {
        return resolutionFiles.map((resFile, index) => {
            return (<img key={index} src={'http://localhost:3001/' + resFile} />)
        })
    }
    return (
        <div className="container">
            <form onSubmit={onSubmit} className="form-wrapper">
                <input type="file" accept="image/png, image/jpeg" onChange={e => setFile(e.target.files[0])} />
                <button className='primary-btn' type="submit">Submit</button>
            </form>
            <div className="image-container">
                {renderResolutions()}
            </div>
        </div>
    )
}