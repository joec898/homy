import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import BookingWidget from "../parts/BookingWidget";
import PlaceGallery from "../parts/PlaceGallery";
import AddressLink from "../parts/AddressLink";
// import AddressLink from "../AddressLink";

export default function PlacePage() {
  const [showAllPhotos,setShowAllPhotos] = useState(false);
  const {id} = useParams();
  const [place,setPlace] = useState(null);
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then(response => {
      setPlace(response.data);
    });
  }, [id]);

  if (!place) return '';

  if (showAllPhotos) {
    return (
      <div className="absolute inset-0 bg-white min-h-screen">
        <div className="p-8 grid gap-4">
          <div>
            <h2 className="text-3xl mr-48">Photos of {place.title}</h2>
            <button onClick={() => setShowAllPhotos(false)}
            className="fixed right-12 top-8 flex gap-1 py-2 px-4 rounded-2xl shadow shadow-black bg-white text-black">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
              Close photos
            </button>
          </div>
          {place?.photos?.length > 0 && place.photos.map(photo => (
            <div className="">
              <img src={'http://localhost:4000/uploads/'+photo} alt=""/>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return(
    <div className="bg-gray-100  px-4">
       <div className="mt-4 -mx-8 px-8 pt-8">
          <h1 className="text-3xl">{place.title}</h1>
          <AddressLink>{place.address}</AddressLink>
          <PlaceGallery place={place} />
      </div>


      <div className="mt-8 mb-8 grid xm:grod-cols-1 md:grid-cols-2 grid-cols-[2fr-1fr]">
          <div>
            <div className="my-4">
              <h2 className="font-semibold text-2xl">Description</h2>
              {place.description}
            </div>
              Check-in: {place.checkIn} <br />
              Check-out: {place.checkOut}<br />
              Max number of guests: {place.maxGuests}
          </div>

          <div>
              <BookingWidget place={place} />
          </div>

          <div className="bg-white -mx-8 px-8 py-8 border-t">
              <div>
                <h2 className="font-semibold text-2xl">Extra info</h2>
              </div>
              <div className="mb-4 mt-2 text-sm text-gray-600 leading-5">
                {place.extraInfo}
              </div>
            </div>
      </div>
    </div>
  )

}
