import { Flex, Input } from "antd";
import { useState } from "react";
import type { ICartItem } from "../sales/types";
import { CloseOutlined } from "@ant-design/icons";

export function ProductHistory() {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [oem, setOEM] = useState<string>("");
  const [code, setCode] = useState<string>("");

  const handleSearch = () => {
    if (code) {
      console.log("Searching for code:", code);
    } else if (oem) {
      console.log("Searching for OEM:", oem);
    }
  };

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
      </Flex>
    </>
  );
}
