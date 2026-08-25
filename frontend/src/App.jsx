import { useEffect } from "react";
import Home from "./pages/Home";
import getCurrentUser from "./features/getCurrentUser";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      dispatch(setUserData(user));
    })();
  }, []);
  return <Home />;
}

export default App;
