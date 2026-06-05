import type { ComponentType, SVGProps, MouseEvent } from 'react';

interface AdminAsideTabProps {
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  className?: string;
  disabled?: boolean;
  focusable?: boolean;
  onClick?: (e?: MouseEvent<HTMLButtonElement>) => void;
}

export const AdminAsideTab = ({
  icon: Icon,
  label,
  disabled = false,
  focusable = true,
  className = '',
  onClick = () => {},
}: AdminAsideTabProps) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`group flex items-center gap-[1.125rem] border-none bg-transparent p-0 text-[#C1C1C1] outline-none focus:outline-none focus:ring-0 ${
        focusable ? 'focus:text-white active:text-white' : ''
      } ${className}`}
      onClick={onClick}
    >
      {Icon && (
        <Icon
          className={`${
            disabled
              ? 'text-gray-400'
              : `text-[#C1C1C1] ${focusable ? 'group-focus:text-white group-active:text-white' : ''}`
          }`}
          width={24}
          height={24}
        />
      )}
      <span>{label}</span>
    </button>
  );
};
