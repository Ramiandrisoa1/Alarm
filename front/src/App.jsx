import React from "react";
import Header from "./component/header/header";
import Footer from "./component/footer/footer";
import Routes from "./routes";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <div className={`main-conten`}>
          <Routes />
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
