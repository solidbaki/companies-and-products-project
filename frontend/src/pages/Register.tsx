import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/apiClient";

const Register = () => {
  const navigate = useNavigate();

  const onFinish = async (values: { name: string; email: string; password: string }) => {
    try {
      await apiClient.post("/auth/register", values);
      message.success("Registration successful! You can now login.");
      navigate("/login");
    } catch (error) {
      message.error("Registration failed.");
    }
  };

  return (
    <Card title="Register" style={{ maxWidth: 400, margin: "auto", marginTop: 50 }}>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>Register</Button>
      </Form>
    </Card>
  );
};

export default Register;
