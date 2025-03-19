import React, { useState, useEffect } from "react";
import {
  Spin,
  Table,
  Button,
  Flex,
  Divider,
  Input,
  Tabs,
  Modal,
  Breadcrumb,
  Descriptions,
} from "antd";
import { HomeOutlined } from "@ant-design/icons";
import apiService from "../api/apiService";
import useStore from "../store/store";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router";

const { Search } = Input;

const Room = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmModalLoading, setConfirmModalLoading] = useState(false);
  const [roomInfo, setRoomInfo] = useState([]);
  const [enrolledChildren, setEnrolledChildren] = useState([]);
  const [notEnrolledChildren, setNotEnrolledChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [
    selectedNotEnrolledChildrenRowKeys,
    setSelectedNotEnrolledChildrenRowKeys,
  ] = useState([]);
  const { roomId } = useParams();

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const room = await apiService.getRoom(roomId);
      setRoomInfo(room);
      const enrolled = await apiService.getEnrolledChildren(roomId);
      setEnrolledChildren(enrolled);
      const notEnrolled = await apiService.getNotEnrolledChildren(roomId);
      setNotEnrolledChildren(notEnrolled);
      setLoading(false);
    } catch (error) {
      console.error("Ocurrió un error al obtener las listas:", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const columns = [
    {
      title: "Nombre",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Apellido",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "DNI",
      dataIndex: "national_id",
      key: "national_id",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Teléfono",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "Dirección",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Fecha de nacimiento",
      dataIndex: "birthday",
      key: "birthday",
      responsive: ["md"],
    },
    {
      title: "Bautizo",
      dataIndex: "baptism",
      key: "baptism",
      responsive: ["md"],
    },
    {
      title: "Comunión",
      dataIndex: "communion",
      key: "communion",
      responsive: ["md"],
    },
  ];

  const onSearch = (value, _e, info) => {
    const dataCopy = enrolledChildren;
    setEnrolledChildren(
      dataCopy.filter(
        (item) =>
          item.first_name.includes(value) ||
          item.last_name.includes(value) ||
          String(item.national_id).includes(value) ||
          item.baptism.includes(value) ||
          item.communion.includes(value)
      )
    );
  };
  const notEnrolledOnSearch = (value, _e, info) => {
    const dataCopy = notEnrolledChildren;
    setNotEnrolledChildren(
      dataCopy.filter(
        (item) =>
          item.first_name.includes(value) ||
          item.last_name.includes(value) ||
          String(item.national_id).includes(value) ||
          item.baptism.includes(value) ||
          item.communion.includes(value)
      )
    );
  };

  const onTableChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedNotEnrolledChildrenRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedNotEnrolledChildrenRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedNotEnrolledChildrenRowKeys.length > 0;

  const handleModalOk = async () => {
    setConfirmModalLoading(true);
    await apiService.enrollChildren(roomId, {
      user_ids: selectedNotEnrolledChildrenRowKeys,
    });
    setSelectedNotEnrolledChildrenRowKeys([]);
    setConfirmModalLoading(false);
    setIsModalOpen(false);
    await fetchInitialData();
  };
  const handleModalCancel = () => {
    console.log("Clicked cancel button");
    setIsModalOpen(false);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <Breadcrumb
        items={[
          {
            title: (
              <NavLink to="/">
                <HomeOutlined />
              </NavLink>
            ),
          },
          {
            title: <NavLink to="/grupos">Grupos</NavLink>,
          },
          { title: roomInfo.name },
        ]}
      />
      <h1>
        Aula &quot;{roomInfo.name}&quot; de {roomInfo.inscription}
      </h1>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div style={{ width: "100%", overflowX: "auto" }}>
            <Divider dashed />
            <Descriptions
              title="Catequistas"
              items={[
                {
                  key: 1,
                  label: "Coordinador",
                  children: roomInfo.first_catechist || "---",
                },
                {
                  key: 2,
                  label: "Primer apoyo",
                  children: roomInfo.second_catechist || "---",
                },
                {
                  key: 3,
                  label: "Segundo apoyo",
                  children: roomInfo.third_catechist || "---",
                },
                {
                  key: 4,
                  label: "Cantidad de inscritos",
                  children: enrolledChildren?.length || "---",
                },
              ]}
            />
            <Divider dashed />
            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  key: 1,
                  label: "Lista de inscritos",
                  children: (
                    <>
                      <Search
                        placeholder="Buscar por nombre, apellido, DNI, bautizo o comunión."
                        onSearch={onSearch}
                        allowClear
                        enterButton="Buscar"
                      />
                      <Table
                        dataSource={
                          Array.isArray(enrolledChildren)
                            ? enrolledChildren
                            : []
                        } // Asegura que data siempre sea un array
                        columns={columns}
                        rowKey={(record) => record.id}
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 800, y: 400 }}
                        locale={{
                          filter: "Filtrar",
                          sort: "Ordenar",
                          emptyText: "No hay datos para mostrar",
                        }}
                        expandable={{
                          expandedRowRender: (record) => (
                            <Flex vertical={true}>
                              <Flex gap="middle" vertical={false}>
                                <span
                                  style={{
                                    margin: 0,
                                    width: "50%",
                                    whiteSpace: "pre-line",
                                  }}
                                >
                                  <b>Notas adicionales:</b>
                                  <p>{record.additional_notes}</p>
                                </span>
                                <Divider
                                  type="vertical"
                                  style={{ borderColor: "#fff" }}
                                />
                                <span
                                  style={{
                                    margin: 0,
                                    width: "50%",
                                    whiteSpace: "pre-line",
                                  }}
                                >
                                  <b>Enfermedades/alergias:</b>
                                  <p>{record.illness}</p>
                                </span>
                              </Flex>
                              <Flex gap="middle" vertical={false}>
                                <span
                                  style={{
                                    margin: 0,
                                    width: "50%",
                                  }}
                                >
                                  <b>Aula:</b>{" "}
                                  {record.room ? record.room : "---"}
                                </span>
                                <Divider
                                  type="vertical"
                                  style={{ borderColor: "#fff" }}
                                />
                                <span
                                  style={{
                                    margin: 0,
                                    width: "50%",
                                  }}
                                >
                                  <b>Nivel:</b>{" "}
                                  {record.inscription
                                    ? record.inscription
                                    : "---"}
                                </span>
                              </Flex>
                              <Flex gap="middle" vertical={false}>
                                <span
                                  style={{
                                    margin: 0,
                                    width: "50%",
                                  }}
                                >
                                  <b>Talla de polo:</b>{" "}
                                  {record.t_shirt_size
                                    ? record.t_shirt_size
                                    : "---"}
                                </span>
                                <Divider
                                  type="vertical"
                                  style={{ borderColor: "#fff" }}
                                />
                                <span
                                  style={{
                                    margin: 0,
                                    width: "50%",
                                  }}
                                >
                                  <b>Registrado por:</b>{" "}
                                  {record.registrar ? record.registrar : "---"}
                                </span>
                              </Flex>
                            </Flex>
                          ),
                          rowExpandable: (record) => true,
                        }}
                        tableLayout="fixed"
                        showSorterTooltip={{
                          target: "sorter-icon",
                        }}
                        onChange={onTableChange}
                      />
                    </>
                  ),
                },
                {
                  key: 2,
                  label: "Lista de no inscritos",
                  children: (
                    <Flex gap="middle" vertical>
                      <Flex align="center" gap="middle">
                        <Search
                          placeholder="Buscar por nombre, apellido, DNI, bautizo o comunión."
                          onSearch={notEnrolledOnSearch}
                          allowClear
                          enterButton="Buscar"
                        />
                      </Flex>
                      <Flex align="center" gap="middle">
                        <Button
                          type="primary"
                          onClick={() => setIsModalOpen(true)}
                          disabled={!hasSelected}
                          loading={loading}
                        >
                          Inscribir seleccionados
                        </Button>
                        {hasSelected
                          ? `${selectedNotEnrolledChildrenRowKeys.length} niños/jóvenes seleccionados`
                          : null}
                      </Flex>

                      <Table
                        dataSource={
                          Array.isArray(notEnrolledChildren)
                            ? notEnrolledChildren
                            : []
                        } // Asegura que data siempre sea un array
                        columns={columns}
                        rowKey={(record) => record.id}
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 800, y: 400 }}
                        locale={{
                          filter: "Filtrar",
                          sort: "Ordenar",
                          emptyText: "No hay datos para mostrar",
                        }}
                        tableLayout="fixed"
                        showSorterTooltip={{
                          target: "sorter-icon",
                        }}
                        onChange={onTableChange}
                        rowSelection={rowSelection}
                      />
                    </Flex>
                  ),
                },
              ]}
            />
          </div>
          <Divider />

          <Modal
            title="Inscribir seleccionados"
            open={isModalOpen}
            onOk={handleModalOk}
            confirmLoading={confirmModalLoading}
            onCancel={handleModalCancel}
            okText="Inscribir seleccionados"
            cancelText="Cancelar"
          >
            <p>
              Inscribiendo a {selectedNotEnrolledChildrenRowKeys.length}{" "}
              niños/jóvenes
            </p>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Room;
