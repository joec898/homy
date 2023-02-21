import axios from "axios";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

export default function IndexPage() {
    const [places, setPlaces] = useState([]);
    useEffect(() => {
      axios.get('/places').then(response => {
        setPlaces(response.data);
        console.log(import.meta.env.VITE_IMAGES_URL);
      });
    }, []);
    return (
       <div className="mt-8 px-4 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {places.length > 0 && places.map(place => (
              <Link to={'/place/'+place._id}>
                <div className="bg-gray-500 mb-2 rounded-2xl flex">
                  {place.photos?.[0] && (
                    <img className="rounded-2xl w-full object-cover aspect-square"
                    src={import.meta.env.VITE_IMAGES_URL+place.photos?.[0]} alt="" />
                    //<img className="rounded-2xl object-cover aspect-square"
                    //   src={'http://127.0.0.1:4000/uploads/'+place.photos?.[0]} alt=""/>
                  )}
                </div>
                <h2 className="font-bold">{place.address}</h2>
                <h3 className="text-sm text-gray-500 truncate leading-4">{place.title}</h3>
                <div className="mt-1">
                  <span className="font-bold">${place.price}</span> per night
                </div>
              </Link>
            ))}
       </div>
    );

}
