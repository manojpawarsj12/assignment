export default function Image({ image }) {

    const imageUrl = `url('http://localhost:3001/${image}')`
    const styles = {
        backgroundImage: imageUrl,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
    }
    return (
        <div className="image-wrapper">
            <div className="image-item" style={{ ...styles }}>
            </div>
        </div>

    )
}