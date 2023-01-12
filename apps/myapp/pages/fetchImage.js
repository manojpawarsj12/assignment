import { useEffect, useState } from "react";
import axios from "axios"
import Image from "../components/Image";
import { useRouter } from "next/router";
import { AUTH_TOKEN_KEY } from "../utils/app.constants"

export default function FetchImages() {
    const [images, setImages] = useState([]);
    const router = useRouter()
    useEffect(() => {
        const res = axios.get(`http://localhost:3001/fetchImages/`, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization' : localStorage.getItem(AUTH_TOKEN_KEY, null)
            }
        },).then(data => {
            console.log(data)
            setImages(data.data.data || []);
        }).catch(err => {
            console.log(err)
            router.push('/login')
        });
    }, [])

    const renderImages = () => {
        return images.map((resFile, index) => {
            return (<Image key={index} image={resFile} />)
        })
    }
    return (
        <div className="container">
            <div className="image-container">
                {renderImages()}
            </div>
        </div>
    )
}