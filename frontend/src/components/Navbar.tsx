import { Link, useNavigate } from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import {
  AppstoreOutlined,
  BankOutlined,
  ShoppingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isLoggedIn) return null;

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#ffffff",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Menu
        mode="horizontal"
        defaultSelectedKeys={["dashboard"]}
        style={{ flex: 1, background: "#ffffff", borderBottom: "none" }}
      >
        <Menu.Item key="dashboard" icon={<AppstoreOutlined />}>
          <Link to="/">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="companies" icon={<BankOutlined />}>
          <Link to="/companies">Companies</Link>
        </Menu.Item>
        <Menu.Item key="products" icon={<ShoppingOutlined />}>
          <Link to="/products">Products</Link>
        </Menu.Item>
      </Menu>

      <Button
        type="primary"
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        style={{ marginLeft: "auto" }}
      >
        Logout
      </Button>
    </Header>
  );
};

export default Navbar;
