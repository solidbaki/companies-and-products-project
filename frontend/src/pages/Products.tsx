import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import {
  Table,
  Input,
  Button,
  Space,
  Card,
  Modal,
  Form,
  Select,
  message,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ColumnType } from "antd/es/table";
import type { FilterDropdownProps } from "antd/es/table/interface";
import type { InputRef } from "antd";

interface Product {
  _id: string;
  name: string;
  category: string;
  productAmount: number;
  amountUnit: string;
  company: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const searchInput = useRef<InputRef | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCompanies();
  }, []);

  const fetchProducts = () => {
    apiClient
      .get("/products")
      .then((res) => setProducts(res.data.products))
      .catch((error) => {
        if (error.response?.status === 401) {
          message.error("Session expired. Please log in again.");
          navigate("/login");
        }
      })
      .finally(() => setLoading(false));
  };

  const fetchCompanies = () => {
    apiClient
      .get("/companies")
      .then((res) =>
        setCompanies(
          Array.isArray(res.data.companies) ? res.data.companies : []
        )
      )
      .catch(() => message.error("Failed to fetch companies."));
  };

  // Open Add/Edit Modal
  const showModal = (product?: Product) => {
    setIsEditMode(!!product);
    setEditingProduct(product || null);
    setIsModalVisible(true);
    if (product) {
      form.setFieldsValue(product);
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingProduct(null);
  };

  // Handle Add/Edit Submission
  const handleFormSubmit = (values: Omit<Product, "_id">) => {
    if (isEditMode && editingProduct) {
      apiClient
        .put(`/products/${editingProduct._id}`, values)
        .then(() => {
          message.success("Product updated successfully!");
          fetchProducts();
          handleCancel();
        })
        .catch(() => message.error("Failed to update product."));
    } else {
      apiClient
        .post("/products", values)
        .then(() => {
          message.success("Product added successfully!");
          fetchProducts();
          handleCancel();
        })
        .catch(() => message.error("Failed to add product."));
    }
  };

  // Handle Delete Product
  const handleDelete = (productId: string) => {
    apiClient
      .delete(`/products/${productId}`)
      .then(() => {
        message.success("Product deleted successfully!");
        fetchProducts();
      })
      .catch(() => message.error("Failed to delete product."));
  };

  // Search Functionality
  const getColumnSearchProps = (
    dataIndex: keyof Product
  ): ColumnType<Product> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: FilterDropdownProps) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
          >
            Search
          </Button>
          <Button onClick={() => clearFilters && clearFilters()} size="small">
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toString().toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  // Table Columns
  const columns: ColumnType<Product>[] = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps("name"),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filters: [
        { text: "Electronics", value: "Electronics" },
        { text: "Furniture", value: "Furniture" },
        { text: "Food", value: "Food" },
      ],
      onFilter: (value, record) => record.category.includes(value as string),
    },
    {
      title: "Amount",
      dataIndex: "productAmount",
      key: "productAmount",
      sorter: (a, b) => a.productAmount - b.productAmount,
      render: (text, record) => `${record.productAmount} ${record.amountUnit}`,
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      render: (companyId) => {
        return companyId?.name;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Products List"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Add Product
        </Button>
      }
      style={{
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      {/* Product Table */}
      <Table
        columns={columns}
        dataSource={Array.isArray(products) ? products : []}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        bordered
      />

      {/* Add/Edit Product Modal */}
      <Modal
        title={isEditMode ? "Edit Product" : "Add New Product"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null} // ✅ Keep footer null to use custom form buttons
      >
        <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please enter category" }]}
          >
            <Input placeholder="Enter category" />
          </Form.Item>
          <Form.Item
            name="productAmount"
            label="Amount"
            rules={[{ required: true, message: "Please enter amount" }]}
          >
            <Input type="number" placeholder="Enter amount" />
          </Form.Item>
          <Form.Item
            name="amountUnit"
            label="Unit"
            rules={[{ required: true, message: "Please enter unit" }]}
          >
            <Input placeholder="Enter unit (kg, pcs, etc.)" />
          </Form.Item>
          <Form.Item
            name="company"
            label="Company"
            rules={[{ required: true, message: "Please select a company" }]}
          >
            <Select placeholder="Select company">
              {companies.map((company) => (
                <Select.Option key={company._id} value={company._id}>
                  {company?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {/* ✅ Add Submit & Cancel Buttons */}
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {isEditMode ? "Update Product" : "Add Product"}
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Products;
