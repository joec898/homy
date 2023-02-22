import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import PhotosUploader from "../parts/PhotosUploader.jsx";
import Perks from "../parts/Perks.jsx";
import axios from "axios";
import AccountNav from "../parts/AccountNav";

export default function PlacesFormPage() {
    const {id} = useParams();
    const [title,setTitle] = useState('');
    const [address,setAddress] = useState('');
    const [addedPhotos,setAddedPhotos] = useState([]);
    const [description,setDescription] = useState('');
    const [perks,setPerks] = useState([]);
    const [extraInfo,setExtraInfo] = useState('');
    const [checkIn,setCheckIn] = useState('');
    const [checkOut,setCheckOut] = useState('');
    const [maxGuests,setMaxGuests] = useState(1);
    const [price,setPrice] = useState(100);
    const [redirect,setRedirect] = useState(false);

    useEffect(() => {
        if (!id) {
          return;
        }
        axios.get('/places/'+id).then(response => {
           const {data} = response;
           //console.log(data);
           setTitle(data.title);
           setAddress(data.address);
           setAddedPhotos(data.photos);
           setDescription(data.description);
           setPerks(data.perks);
           setExtraInfo(data.extraInfo);
           setCheckIn(data.checkIn);
           setCheckOut(data.checkOut);
           setMaxGuests(data.maxGuests);
           setPrice(data.price);
        });
    }, [id]);

    function addHeader(text) {
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }
    function addDescription(text) {
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        );
    }
    function inputHeaderAndDescription(header, description) {
        return (
            <>
            {addHeader(header)}
            {addDescription(description)}
            </>
        );
    }
    async function savePlace(ev) {
        ev.preventDefault();
        const placeData = {
          title, address, addedPhotos,
          description, perks, extraInfo,
          checkIn, checkOut, maxGuests, price,
        };
        console.log(addedPhotos);
        if (id) {
            await axios.put('/places', {
              id, ...placeData
            });
            setRedirect(true);
        } else {
            await axios.post('/places', placeData);
            setRedirect(true);
        }
    }
    if (redirect) {
        return <Navigate to={'/account/places'} />
    }
    return (
        <div className="px-4">
            <AccountNav />
            <form onSubmit={savePlace}>
                {inputHeaderAndDescription('Title', 'Title for your palce, be short and catchy as in advertisement') }
                <input type='text' value={title} onChange={ev => setTitle(ev.target.value)} placeholder="Title, for example my apartment" />

                {inputHeaderAndDescription('Address', 'Address for your palce...') }
                <input type='text' value={address} onChange={ev => setAddress(ev.target.value)} placeholder="Address" />

                {inputHeaderAndDescription('Photoes', 'More = better') }
                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

                {inputHeaderAndDescription('Description', 'Description of the place') }
                <textarea value={description} onChange={ev => setDescription(ev.target.value)}  />

                {inputHeaderAndDescription('Perks', 'Select all applied') }
                <div className="mt-2 grid gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                    <Perks selected={perks} onChange={setPerks}/>
                </div>
                {inputHeaderAndDescription('Extra info', 'house rules, etc') }
                <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />

                {inputHeaderAndDescription('Check in/out time, max guests', 'Check in/out time, max guests') }
                <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                    <div>
                        <h3 className="mt-2 -mb-1">Check in time</h3>
                        <input type="text" value={checkIn} onChange={ev => setCheckIn(ev.target.value)} placeholder="14:00"/>
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Check out time</h3>
                        <input type="text" value={checkOut} onChange={ev => setCheckOut(ev.target.value)} placeholder="10:00"/>
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Max guests</h3>
                        <input type="text" value={maxGuests} onChange={ev => setMaxGuests(ev.target.value)} placeholder="5"/>
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Price per night</h3>
                        <input type="number" value={price} onChange={ev => setPrice(ev.target.value)}/>
                    </div>
                </div>
                <button className="hover_botton max-w-sm ">Save</button>
            </form>
        </div>
    );
}