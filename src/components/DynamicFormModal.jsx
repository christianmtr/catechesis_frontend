// src/components/DynamicFormModal.jsx
import React from "react";
import { Modal, Form, Button } from "antd";


const DynamicFormModal = ({ isVisible, onClose, onSubmit, fields, renderFields }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  return (
    <Modal
      title="Agregar/Editar Elemento"
      open={isVisible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Guardar
        </Button>,
      ]}
      afterClose={() => form.resetFields()}
    >
      <Form form={form} layout="vertical">
        {fields.map((field) => (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={field.rules || []}
            hidden={field.inputType == "hidden"}
            initialValue={field.initialValue}
          >
            {renderFields(field)}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default DynamicFormModal;
