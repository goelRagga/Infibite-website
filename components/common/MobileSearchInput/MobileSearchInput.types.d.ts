export interface MobileSearchInputProps {
  /**
   * The placeholder text to display in the search input
   * @default "Search for City, Villa, Location...."
   */
  placeholder?: string;

  /**
   * Callback function triggered when the search input is clicked
   */
  onClick: () => void;

  /**
   * Additional CSS classes to apply to the component
   */
  className?: string;
}
