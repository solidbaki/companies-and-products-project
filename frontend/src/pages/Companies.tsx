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

interface Company {
  _id: string;
  name: string;
  legalNumber: string;
  incorporationCountry: string;
  website: string;
}

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const searchInput = useRef<InputRef | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = () => {
    apiClient
      .get("/companies")
      .then((res) => setCompanies(res.data.companies))
      .catch((error) => {
        if (error.response?.status === 401) {
          message.error("Session expired. Please log in again.");
          navigate("/login");
        }
      })
      .finally(() => setLoading(false));
  };

  const showModal = (company?: Company) => {
    setIsEditMode(!!company);
    setEditingCompany(company || null);
    setIsModalVisible(true);
    if (company) {
      form.setFieldsValue(company);
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCompany(null);
  };

  const handleFormSubmit = (values: Omit<Company, "_id">) => {
    if (isEditMode && editingCompany) {
      apiClient
        .put(`/companies/${editingCompany._id}`, values)
        .then(() => {
          message.success("Company updated successfully!");
          fetchCompanies();
          handleCancel();
        })
        .catch(() => message.error("Failed to update company."));
    } else {
      apiClient
        .post("/companies", values)
        .then(() => {
          message.success("Company added successfully!");
          fetchCompanies();
          handleCancel();
        })
        .catch(() => message.error("Failed to add company."));
    }
  };

  const handleDelete = (companyId: string) => {
    apiClient
      .delete(`/companies/${companyId}`)
      .then(() => {
        message.success("Company deleted successfully!");
        fetchCompanies();
      })
      .catch(() => message.error("Failed to delete company."));
  };

  const getColumnSearchProps = (
    dataIndex: keyof Company
  ): ColumnType<Company> => ({
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

  const columns: ColumnType<Company>[] = [
    {
      title: "Company Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps("name"),
    },
    {
      title: "Legal Number",
      dataIndex: "legalNumber",
      key: "legalNumber",
    },
    {
      title: "Country",
      dataIndex: "incorporationCountry",
      key: "incorporationCountry",
      filters: [
        { text: "USA", value: "USA" },
        { text: "UK", value: "UK" },
        { text: "Germany", value: "Germany" },
      ],
      onFilter: (value, record) =>
        record.incorporationCountry.includes(value as string),
    },
    {
      title: "Website",
      dataIndex: "website",
      key: "website",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
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
            title="Are you sure to delete this company?"
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
      title="Companies List"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Add Company
        </Button>
      }
      style={{
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      {/* Company Table */}
      <Table
        columns={columns}
        dataSource={Array.isArray(companies) ? companies : []}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        bordered
      />

      {/* Add/Edit Company Modal */}
      <Modal
        title={isEditMode ? "Edit Company" : "Add New Company"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
          <Form.Item
            name="name"
            label="Company Name"
            rules={[{ required: true, message: "Please enter company name" }]}
          >
            <Input placeholder="Enter company name" />
          </Form.Item>
          <Form.Item
            name="legalNumber"
            label="Legal Number"
            rules={[{ required: true, message: "Please enter legal number" }]}
          >
            <Input placeholder="Enter legal number" />
          </Form.Item>
          <Form.Item
            name="incorporationCountry"
            label="Country"
            rules={[{ required: true, message: "Please enter country" }]}
          >
            <Input placeholder="Enter country" />
          </Form.Item>
          <Form.Item name="website" label="Website">
            <Input placeholder="Enter website (optional)" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {isEditMode ? "Update" : "Add"} Company
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Companies;
