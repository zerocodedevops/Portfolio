import { Provider } from "react-redux";
import EcommerceRoutes from "./routes";
import { store } from "./store/store";

function App() {
  return (
    <Provider store={store}>
      <EcommerceRoutes />
    </Provider>
  );
}

export default App;
