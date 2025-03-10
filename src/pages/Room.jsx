import React, { useState, useEffect } from "react";
import { Spin, Table, Button, Radio, Input, Select, Space } from "antd";
import DynamicFormModal from "../components/DynamicFormModal";
import apiService from "../api/apiService";
import useStore from "../store/store";

const Room = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () =>{
        try {
            const dataList = await apiService.getChildList();
            setData(dataList);
        }
    };

    fetchData();
  }, []);
};

export default Room;
