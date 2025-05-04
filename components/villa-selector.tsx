'use client';

import { useEffect, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface VillaResponse {
  id: string;
  image_id: string;
  latitude: number;
  longitude: number;
  match_score: number;
  order_score: number;
  seo_url: string;
  subtitle: string;
  title: string;
  type: string;
}

interface VillaSelectorProps {
  onVillaChange: (villaId: string) => void;
}

const VillaSelector = ({ onVillaChange }: VillaSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [selectedVilla, setSelectedVilla] = useState<VillaResponse>();
  const [villas, setVillas] = useState<VillaResponse[]>([]);
  const [search, setSearch] = useState<string>('');

  const fetchVillas = async () => {
    const response = await fetch(
      `https://go.saffronstays.com/api/auto-complete?text=${search}&type=listing`,
    );
    const data = await response.json();
    if (data?.success) {
      setVillas(data?.data);
    }
  };

  useEffect(() => {
    fetchVillas();
  }, [search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full md:w-[250px] justify-between"
        >
          {selectedVilla ? selectedVilla.title : 'Select villa...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full md:w-[250px] p-0">
        <div>
          <input
            className="w-full p-2 border border-gray-300 rounded-md"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
          />
        </div>
        {villas?.map((ele, index) => {
          return (
            <div key={index}>
              <p
                className="p-2 cursor-pointer hover:bg-gray-100 transition-colors hover:text-black"
                onClick={() => {
                  setSelectedVilla(ele);
                  onVillaChange(ele.id);
                  setOpen(false);
                }}
              >
                {ele.title}
              </p>
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
};

export default VillaSelector;

// setSelectedVilla(villa);
// onVillaChange(villa.id);
// setOpen(false);
