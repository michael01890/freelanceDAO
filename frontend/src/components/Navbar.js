import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

const Navbar = () => {
  const { account, setAccount } = useContext(UserContext);
  const navigate = useNavigate();

  const disconnectWallet = () => {
    setAccount(null);
    navigate("/");
  };

  return (
    <nav style={styles.navbar}>
      <h3>FreelanceDAO</h3>
      <div>
        <Link to="/dashboard" style={styles.link}>
          Dashboard
        </Link>
        <Link to="/profile" style={styles.link}>
          Profile
        </Link>
        <button onClick={disconnectWallet} style={styles.button}>
          Disconnect
        </button>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    padding: "10px 20px",
    backgroundColor: "#282c34",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  link: {
    marginRight: "15px",
    color: "white",
    textDecoration: "none",
  },
  button: {
    padding: "5px 10px",
    cursor: "pointer",
  },
};

export default Navbar;
