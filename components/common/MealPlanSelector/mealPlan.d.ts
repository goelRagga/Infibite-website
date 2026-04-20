declare module 'meal-plan' {
  export interface MealPlan {
    id: string;
    code: string;
    title: string;
    description?: string;
    price: number;
    originalPrice?: number;
    discountPercentage?: number;
    discountAmount?: number;
    pricePerPerson?: any;
  }

  export interface MealPlanOptionProps {
    plan: MealPlan;
    totalDays?: number;
  }

  export interface MealPlanSelectorProps {
    defaultValue?: string;
    totalDays?: number;
    title?: string;
    trigger?: React.ReactNode;
    mealPlanOptions: MealPlan[];
    onSelectionChange?: (selectedPlan: MealPlan) => void;
    hasValidDates?: boolean;
    onDateRequiredClick?: () => void;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    isLoading?: boolean;
  }
}
