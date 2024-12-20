import { BrowserRouter as Router } from "react-router-dom";
import "../src/styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <Router>
      <Component {...pageProps} />
    </Router>
  );
}

export default MyApp;
