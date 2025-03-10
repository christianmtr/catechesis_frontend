import React, { useState, useEffect } from "react";
import { Spin, Table, Button, Radio, Input, Select, Space } from "antd";
import DynamicFormModal from "../components/DynamicFormModal";
import apiService from "../api/apiService";
import useStore from "../store/store";

const RoomsList = () => {
  const [catechists, setCatechists] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isRoomsFormModalOpen, setIsRoomsFormModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inscriptionTypeRoomFilter, setInscriptionTypeRoomFilter] = useState(
    []
  );
  const { inscriptions } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catechistList = await apiService.getCatechists();
        setCatechists(catechistList);
        const roomsList = await apiService.getRooms();
        setRooms(roomsList);
        setInscriptionTypeRoomFilter(roomsList);
      } catch (error) {
        console.error("Error al cargar las listas:", error);
      } finally {
        if (catechists && rooms && inscriptions) {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, []);

  const roomsListColumns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Coordinador",
      dataIndex: "first_catechist",
      key: "first_catechist",
    },
    {
      title: "Primer apoyo",
      dataIndex: "second_catechist",
      key: "second_catechist",
    },
    {
      title: "Segundo apoyo",
      dataIndex: "third_catechist",
      key: "third_catechist",
    },
    {
      title: "Acción",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button type="link">Ver aula</Button>
        </Space>
      ),
    },
  ];

  let radioInscriptionOptions = [
    { id: 0, label: `Todos (${rooms.length})`, name: "todos", value: 0 },
  ].concat(
    inscriptions.map((item) => {
      const filtered = rooms.filter((room) => room.inscription == item.id);
      return {
        id: item.id,
        label: `${item.verbose_type} (${filtered.length})`,
        name: item.type,
        value: item.id,
      };
    })
  );

  const onInscriptionRadioGroupChange = ({ target }) => {
    if (target.value == 0) {
      setInscriptionTypeRoomFilter(rooms);
    } else {
      setInscriptionTypeRoomFilter(
        rooms.filter((item) => item.inscription == target.value)
      );
    }
  };

  const handleFormNewRoomSubmit = async (values) => {
    try {
      await apiService.createRoom(values);
      setIsRoomsFormModalOpen(false);
    } catch (error) {
      console.error("Error al crear aula:", error);
    } finally {
      setLoading(true);
      const roomsList = await apiService.getRooms();
      setRooms(roomsList);
      setInscriptionTypeRoomFilter(roomsList);
      setLoading(false);
    }
  };

  const formNewRoomField = [
    {
      name: "inscription",
      label: "Inscripción",
      rules: [{ required: true, message: "El Inscripción es obligatorio" }],
      placeholder: "Inscripción",
      inputType: "select",
      options: inscriptions,
      initialValue: "",
      selectLabel: "verbose_type",
    },
    {
      name: "name",
      label: "Nombre de aula",
      rules: [{ required: true, message: "El nombre es obligatorio" }],
      placeholder: "Nombre del aula",
      inputType: "text",
      initialValue: "",
    },
    {
      name: "first_catechist",
      label: "Coordinador",
      rules: [{ required: true, message: "El coordinador es obligatorio" }],
      placeholder: "Coordinador de aula",
      inputType: "select",
      options: catechists,
      initialValue: "",
    },

    {
      name: "second_catechist",
      label: "Primer apoyo",
      rules: [{ required: false }],
      placeholder: "Primer apoyo de aula",
      inputType: "select",
      options: catechists,
      initialValue: "",
    },
    {
      name: "third_catechist",
      label: "Segundo apoyo",
      rules: [{ required: false }],
      placeholder: "segundo apoyp de aula",
      inputType: "select",
      options: catechists,
      initialValue: "",
    },
  ];

  const renderField = (field) => {
    switch (field.inputType) {
      case "select":
        return (
          <Select
            options={field.options.map((item) => {
              console.log(item);
              if (field.name == "inscription") {
                console.log(item.verbose_type, item.year);
                return {
                  value: item.id,
                  label: `${item.verbose_type} ${item.year}`,
                };
              } else {
                return {
                  value: item.id,
                  label: `${item.first_name} ${item.last_name}`,
                };
              }
            })}
          />
        );
      default:
        return (
          <Input
            placeholder={field.placeholder || ""}
            type={field.inputType || "text"} // Usa "text" como valor predeterminado
          />
        );
    }
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
      <h1>Lista de grupos</h1>
      <p>Aquí puedes ver y agregar nuevos elementos.</p>

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
            <Radio.Group
              block
              options={radioInscriptionOptions}
              defaultValue={0}
              optionType="button"
              buttonStyle="solid"
              onChange={onInscriptionRadioGroupChange}
            />
            <Table
              dataSource={
                Array.isArray(inscriptionTypeRoomFilter)
                  ? inscriptionTypeRoomFilter
                  : []
              } // Asegura que data siempre sea un array
              columns={roomsListColumns}
              rowKey={(record) => record.id}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 800, y: 400 }}
              locale={{
                emptyText: "No hay datos para mostrar",
              }}
              tableLayout="fixed"
            />
            <Button
              type="primary"
              onClick={() => setIsRoomsFormModalOpen(true)}
              style={{ marginTop: "16px" }}
            >
              Agregar nuevo
            </Button>
          </div>

          <DynamicFormModal
            isVisible={isRoomsFormModalOpen}
            onClose={() => setIsRoomsFormModalOpen(false)}
            onSubmit={handleFormNewRoomSubmit}
            fields={formNewRoomField}
            renderFields={renderField}
          />
        </>
      )}
    </div>
  );
};

export default RoomsList;
