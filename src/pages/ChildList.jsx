import React, { useState, useEffect } from "react";
import {
  Spin,
  Flex,
  Divider,
  Table,
  Button,
  Radio,
  Input,
  Select,
  DatePicker,
} from "antd";
import DynamicFormModal from "../components/DynamicFormModal";
import apiService from "../api/apiService";
import useStore from "../store/store";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
const { Search, TextArea } = Input;

const ChildList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]); // Comienza con un array vacío
  const [loading, setLoading] = useState(true);
  const [inscriptionTypeFilter, setInscriptionTypeFilter] = useState([]);
  const { inscriptions } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataList = await apiService.getChildList();
        setData(dataList); // Establecer los datos iniciales
        setInscriptionTypeFilter(dataList);
      } catch (error) {
        console.error("Error al cargar la lista de elementos:", error);
      } finally {
        if (inscriptions) {
          setLoading(false); // Oculta el loader cuando termina la carga
        }
      }
    };

    fetchData();
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

  const formFields = [
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
      name: "first_name",
      label: "Nombres",
      rules: [{ required: true, message: "El nombre es obligatorio" }],
      placeholder: "Nombre del joven",
      inputType: "text",
      initialValue: "",
    },
    {
      name: "last_name",
      label: "Apellidos",
      rules: [{ required: true, message: "El apellido es obligatorio" }],
      placeholder: "Apellidos del joven",
      inputType: "text",
      initialValue: "",
    },
    {
      name: "national_id",
      label: "DNI",
      rules: [
        {
          required: false,
          min: 8,
          max: 8,
        },
      ],
      placeholder: "Número de DNI",
      inputType: "number",
      initialValue: "",
    },
    {
      name: "email",
      label: "Email",
      rules: [
        {
          type: "email",
          message: "El E-mail no es válido.!",
        },
        { required: false },
      ],
      placeholder: "mi_nombre@example.com",
      inputType: "email",
      initialValue: "",
    },
    {
      name: "phone_number",
      label: "Teléfono",
      rules: [
        {
          required: false,
          min: 9,
          max: 9,
        },
      ],
      placeholder: "999888777",
      inputType: "tel",
      initialValue: "",
    },
    {
      name: "address",
      label: "Dirección",
      rules: [
        {
          required: false,
        },
      ],
      placeholder: "",
      inputType: "text",
      initialValue: "",
    },
    {
      name: "birthday",
      label: "Cumpleaños",
      rules: [
        {
          required: false,
        },
      ],
      placeholder: "",
      inputType: "date",
      initialValue: "",
    },
    {
      name: "illness",
      label: "Enfermedades/Alergias",
      rules: [{ required: false }],
      placeholder:
        "Agrega aquí las enfermedades o alergias separadas por comas.",
      inputType: "textArea",
      initialValue: "",
    },
    {
      name: "baptism",
      label: "Bautizo",
      rules: [
        {
          required: false,
        },
      ],
      placeholder: "Lugar de bautizo",
      inputType: "text",
      initialValue: "",
    },
    {
      name: "communion",
      label: "Comunión",
      rules: [
        {
          required: false,
        },
      ],
      placeholder: "Lugar de tu primera comunión",
      inputType: "text",
      initialValue: "",
    },
    {
      name: "t_shirt_size",
      label: "Talla",
      rules: [
        {
          required: false,
          min: 1,
          max: 3,
        },
      ],
      placeholder: "XS, S, M, L, XL, XXL",
      inputType: "text",
      initialValue: "",
    },
    {
      name: "additional_notes",
      label: "Datos adicionales",
      rules: [
        {
          required: true,
          message: "Ingrese datos adicionales, como los del apoderado.",
        },
      ],
      placeholder: "Datos adicionales.",
      inputType: "textArea",
      initialValue:
        "Nombres: \nApellidos: \nDNI: \nCelular: \nSacramentos: \nCondición (Matrimonio religioso, civil, soltero, viudez): \nNúmero de operación: ",
    },
    {
      name: "user_type",
      label: "Tipo de usuario",
      rules: [
        {
          required: true,
          message: "El tipo de usuario es obligatorio",
        },
      ],
      placeholder: "Tipo de usuario",
      inputType: "hidden",
      initialValue: "CH",
    },
  ];

  const renderField = (field) => {
    switch (field.inputType) {
      case "select":
        return (
          <Select
            options={field.options.map((item) => {
              return {
                value: item.id,
                label: `${item.verbose_type} ${item.year}`,
              };
            })}
          />
        );
      case "date":
        return (
          <DatePicker
            mode="date"
            format="YYYY/MM/DD"
            style={{ width: "100%" }}
          />
        );
      case "textArea":
        return <TextArea rows={7} placeholder={field.placeholder || ""} />;
      default:
        return (
          <Input
            placeholder={field.placeholder || ""}
            type={field.inputType || "text"} // Usa "text" como valor predeterminado
          />
        );
    }
  };

  let radioInscriptionOptions = [
    { id: 0, label: `Todos (${data.length})`, name: "todos", value: 0 },
  ].concat(
    inscriptions.map((item) => {
      const filtered = data.filter((child) => child.inscription_id == item.id);
      return {
        id: item.id,
        label: `${item.verbose_type} (${filtered.length})`,
        name: item.type,
        value: item.id,
      };
    })
  );

  const handleFormSubmit = async (values) => {
    try {
      values.birthday = values.birthday
        ? dayjs(values.birthday).format("YYYY-MM-DD")
        : null;
      await apiService.createChild(values);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al crear un elemento:", error);
    } finally {
      setLoading(true);
      const dataList = await apiService.getChildList();
      setData(dataList); // Establecer los datos iniciales
      setInscriptionTypeFilter(dataList);
      setLoading(false);
    }
  };

  const onTableChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const onInscriptionRadioGroupChange = ({ target }) => {
    if (target.value == 0) {
      setInscriptionTypeFilter(data);
    } else {
      setInscriptionTypeFilter(
        data.filter((item) => item.inscription_id == target.value)
      );
    }
  };

  const onSearch = (value, _e, info) => {
    const dataCopy = inscriptionTypeFilter;
    setInscriptionTypeFilter(
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

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>Lista de inscritos</h1>
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
            <Search
              placeholder="Buscar por nombre, apellido, DNI, bautizo o comunión."
              onSearch={onSearch}
              allowClear
              enterButton="Buscar"
            />
            <Table
              dataSource={
                Array.isArray(inscriptionTypeFilter)
                  ? inscriptionTypeFilter
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
                        <b>Aula:</b> {record.room ? record.room : "---"}
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
                        {record.inscription ? record.inscription : "---"}
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
                        {record.t_shirt_size ? record.t_shirt_size : "---"}
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
            <Button
              type="primary"
              onClick={() => setIsModalOpen(true)}
              style={{ marginTop: "16px" }}
            >
              Agregar nuevo
            </Button>
          </div>

          <DynamicFormModal
            isVisible={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleFormSubmit}
            fields={formFields}
            renderFields={renderField}
          />
        </>
      )}
    </div>
  );
};

export default ChildList;
