import { Form, Input, Button, Card, message, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { Text } = Typography;

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const { data } = await apiClient.post("/auth/login", values);
      localStorage.setItem("token", data.token);
      apiClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.token}`;
      login();
      message.success("Login successful!");
      navigate("/"); 
    } catch (error) {
      message.error("Invalid credentials.");
    }
  };

  return (
    <Card
      title="Login"
      style={{ maxWidth: 400, margin: "auto", marginTop: 50 }}
    >
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          Login
        </Button>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Text>
            Don't have an account?{" "}
            <Text
              underline
              style={{ color: "#1890ff", cursor: "pointer" }}
              onClick={() => navigate("/register")}
            >
              Register here
            </Text>
          </Text>
        </div>
      </Form>
    </Card>
  );
};

export default Login;
