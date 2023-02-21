export default function PlaceImg({place,index=0,className=null}) {
  if (!place.photos?.length) {
    return '';
  }
  if (!className) {
    className = 'object-cover rounded-2xl';
  }
  return (
    //<img className={className} src={'http://localhost:4000/uploads/'+place.photos[index]} alt=""/>
    <img className={className}
    src={import.meta.env.VITE_IMAGES_URL+place.photos[index]} alt=""/>
    );
}