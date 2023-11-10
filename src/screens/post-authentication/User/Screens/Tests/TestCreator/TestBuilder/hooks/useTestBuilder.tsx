import create from 'zustand';

// Define interfaces for the state and actions
interface TestBuilderState {
  navigator: { loading: boolean };
  itemView: { loading: boolean };
  setNavigator: (navigator: { loading: boolean }) => void;
  setItemView: (itemView: { loading: boolean }) => void;
}

// Create the Zustand store
const useStore = create<TestBuilderState>(set => ({
  navigator: { loading: false },
  itemView: { loading: false },
  setNavigator: (navigator) => set({ navigator }),
  setItemView: (itemView) => set({ itemView }),
}));

// Define the custom hook
const useTestBuilderUI = () => {
  const { navigator, itemView, setNavigator, setItemView } = useStore();

  // Getter and setter for navigator
  const getNavigator = () => navigator;
  const updateNavigator = (newNavigator: { loading: boolean }) => setNavigator(newNavigator);

  // Getter and setter for itemView
  const getItemView = () => itemView;
  const updateItemView = (newItemView: { loading: boolean }) => setItemView(newItemView);

  return { getNavigator, updateNavigator, getItemView, updateItemView };
};

export default useTestBuilderUI;
