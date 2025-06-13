import { useDarkTheme } from "./hooks/useDarkTheme";
import TextSubmitPage from "./components/TextSubmitPage";

function App() {
  useDarkTheme(); // This will add 'dark' class to html element

  return <TextSubmitPage />;
}

export default App;
