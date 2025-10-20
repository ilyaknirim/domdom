import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

interface FilterButtonProps {
  onClick: () => void;
  count?: number;
}

const FilterButton = ({ onClick, count }: FilterButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="relative w-12 h-12 bg-white bg-opacity-20 backdrop-blur-lg border border-white border-opacity-30 rounded-2xl flex items-center justify-center hover:bg-opacity-30 transition-all"
    >
      <AdjustmentsHorizontalIcon className="w-6 h-6 text-white" />
      {count && count > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
};

export default FilterButton;
