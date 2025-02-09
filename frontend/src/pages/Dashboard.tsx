import { useEffect, useState } from "react";
import { apiClient } from "../api/apiClient";
import { Card, Typography, Row, Col, Spin, Table } from "antd";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

const { Title } = Typography;

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/home")
      .then((res) => {
        setData(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <Spin
        size="large"
        style={{ display: "block", margin: "auto", marginTop: 50 }}
      />
    );

  // 🔹 Prepare Pie Chart Data
  const companyChartData = data?.companyDistribution?.map((item: any) => ({
    name: item._id,
    value: item.count,
  }));

  const productChartData = data?.productDistribution?.map((item: any) => ({
    name: item._id,
    value: item.count,
  }));

  // 🔹 Colors for Pie Chart
  const COLORS = ["#1890ff", "#13c2c2", "#fa541c", "#fadb14", "#9254de"];

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 1200,
        margin: "auto",
        backgroundColor: "#f4f6f9",
        minHeight: "100vh",
      }}
    >
      <Title level={2} style={{ textAlign: "center", color: "#1890ff" }}>
        Dashboard
      </Title>

      {/* Summary Cards - Shorter and Wider */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }} justify="center">
        <Col xs={24} sm={12}>
          <Card
            title="Total Companies"
            bordered={false}
            style={{
              background: "linear-gradient(135deg, #1890ff 30%, #13c2c2 100%)",
              color: "white",
              textAlign: "center",
              borderRadius: "12px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              height: "150px", // Shorter height
            }}
          >
            <Title level={2} style={{ color: "white", margin: 0 }}>
              {data?.totalCompanies}
            </Title>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card
            title="Total Products"
            bordered={false}
            style={{
              background: "linear-gradient(135deg, #fa541c 30%, #fadb14 100%)",
              color: "white",
              textAlign: "center",
              borderRadius: "12px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              height: "150px", // Shorter height
            }}
          >
            <Title level={2} style={{ color: "white", margin: 0 }}>
              {data?.totalProducts}
            </Title>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 🔹 Companies Distribution Pie Chart */}
        <Col xs={24} md={12}>
          <Card
            title="Company Distribution by Country"
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={companyChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {companyChartData?.map(
                    (item: { name: string; value: number }, index: number) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    )
                  )}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* 🔹 Products Distribution Pie Chart */}
        <Col xs={24} md={12}>
          <Card
            title="Product Distribution by Category"
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#82ca9d"
                  label
                >
                  {productChartData?.map(
                    (item: { name: string; value: number }, index: number) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    )
                  )}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        {/* Latest Companies Table */}
        <Col xs={24} md={12}>
          <Card
            title="Latest Companies"
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Table
              dataSource={data?.latestCompanies}
              columns={[
                { title: "Company Name", dataIndex: "name", key: "name" },
              ]}
              pagination={false}
              rowKey="_id"
            />
          </Card>
        </Col>

        {/* Latest Products Table */}
        <Col xs={24} md={12}>
          <Card
            title="Latest Products"
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Table
              dataSource={data?.latestProducts}
              columns={[
                { title: "Product Name", dataIndex: "name", key: "name" },
              ]}
              pagination={false}
              rowKey="_id"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
