interface OfferItem {
  id: string;
  image: string;
  title: string;
  description: string;
}

interface OfferCardItemProps {
  item: OfferItem;
  // index: number; // if needed, passed by CommonCard
}

export default function OfferCardItem({ item }: OfferCardItemProps) {
  return (
    <div>
      <div className='aspect-video relative mb-4 rounded-xl overflow-hidden'>
        <img
          src={item?.image || '/placeholder.svg'}
          alt={item?.title || 'Card image'}
          className='w-full h-full object-cover'
        />
      </div>
      <h3 className='text-xl font-bold text-red-600 mb-2'>{item?.title}</h3>
      <p className='text-gray-600 text-sm leading-relaxed'>
        {item?.description}
      </p>
    </div>
  );
}
