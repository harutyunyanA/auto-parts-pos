import { DatePicker, Flex, Input } from "antd";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
// import type { ICartItem } from "../sales/types";
import { CloseOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/client";
import type { IHistory } from "./types";
import type { ApiResponse } from "../../types/api.types";
const { RangePicker } = DatePicker;

export function ProductHistory() {
  const [items, setItems] = useState<IHistory[]>([]);
  const [oem, setOEM] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [date, setDate] = useState<[Dayjs, Dayjs]>([dayjs(), dayjs()]);

  const handleSearch = async () => {
    if (code) {
      const res = await api.get<ApiResponse<IHistory[]>>("/product/history", {
        params: {
          code,
          oem,
          from: date[0].format("YYYY-MM-DD"),
          to: date[1].format("YYYY-MM-DD"),
        },
      });

      console.log("Searching for code:", code);
      console.log(res.data.data);
    } else if (oem) {
      console.log("Searching for OEM:", oem);
    }
  };

  // const { data } = useQuery({
  //   queryKey: ["product/history", code, oem, ...date],
  //   queryFn: async () => {
  //     const { data } = await api.get<IHistory[]>("/product/history", {
  //       params: { code, oem, date },
  //     });

  //     return data;
  //   },
  //   staleTime: 5 * 60 * 1000,
  //   gcTime: 10 * 60 * 1000,
  // });

  // if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Flex gap={"large"}>
        <Input
          placeholder="Code"
          size="large"
          value={code}
          disabled={oem.length > 0}
          allowClear={{ clearIcon: <CloseOutlined /> }}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            if (value.length < 6) setCode(value);
          }}
          onPressEnter={handleSearch}
          style={{ width: "20%" }}
        />

        <Input
          placeholder="OEM"
          size="large"
          value={oem}
          allowClear={{ clearIcon: <CloseOutlined /> }}
          disabled={code.length > 0}
          onChange={(e) => {
            setOEM(e.target.value);
          }}
          onPressEnter={handleSearch}
          style={{ width: "30%" }}
        />

        <RangePicker
          format="DD-MM-YYYY"
          value={date}
          onChange={(v) => setDate(v as [Dayjs, Dayjs])}
        />
      </Flex>
    </>
  );
}
