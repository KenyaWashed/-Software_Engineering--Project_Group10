// client/hooks/useFurnitureWithTotals.ts
import { useEffect, useState } from 'react';

export function useFurnitureWithTotals(roomType) {
  const [furniture, setFurniture] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Get all furniture
      const res1 = await fetch('/api/furniture');
      const allFurniture = await res1.json();
      // Get totals for this room type
      const res2 = await fetch(`/api/furniture-items-by-room-type/room-type?type=${encodeURIComponent(roomType)}`);
      const totals = await res2.json();
      // Merge
      const merged = allFurniture.map(item => ({
        ...item,
        total: totals.find(t => t.id === item.id)?.totalAmount || 0,
      }));
      setFurniture(merged);
      setLoading(false);
    }
    if (roomType) fetchData();
  }, [roomType]);

  return { furniture, loading };
}
