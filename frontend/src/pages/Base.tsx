import { Button, Flex, Input, Modal, theme } from "antd";
import { Products } from "../modules/products/products";
import { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { ProductHistory } from "../modules/history/history";

const { Search } = Input;
export function Base() {
  const searcParamsObj = {
    name: "",
    type: "",
    serial_number: "",
    code: "",
    WXQP: "",
  };
  const [searchParams, setSearchParams] = useState(searcParamsObj);
  const [activeFilters, setActiveFilters] = useState(searcParamsObj);
  const [isProductHistoryOpen, setIsProductHistoryOpen] =
    useState<boolean>(false);
  const [isDeficitModalOpen, setIsDeficitModalOpen] = useState<boolean>(false);
  const { token } = theme.useToken();
  const handleSearch = (key: string, value: string) => {
    if (activeFilters[key] === value) return;
    setActiveFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          height: "calc(100vh - 160px)",
        }}
      >
        {/* <Flex vertical gap={"large"}> */}
        <section style={{ flex: 1, minHeight: 0 }} id="filter">
          <Flex gap={"medium"} justify="start">
            <Search
              allowClear={{ clearIcon: <CloseOutlined /> }}
              placeholder="Code"
              value={searchParams.code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setSearchParams((prev) => ({ ...prev, code: value }));
              }}
              onSearch={(value) => handleSearch("code", value)}
            />
            <Search
              placeholder="Name"
              allowClear={{ clearIcon: <CloseOutlined /> }}
              value={searchParams.name}
              onChange={(e) =>
                setSearchParams((prev) => ({ ...prev, name: e.target.value }))
              }
              onSearch={(value) => handleSearch("name", value)}
            />
            <Search
              placeholder="Type"
              allowClear={{ clearIcon: <CloseOutlined /> }}
              value={searchParams.type}
              onChange={(e) =>
                setSearchParams((prev) => ({ ...prev, type: e.target.value }))
              }
              onSearch={(value) => handleSearch("type", value)}
            />
            <Search
              placeholder="OEM"
              allowClear={{ clearIcon: <CloseOutlined /> }}
              value={searchParams.serial_number}
              onChange={(e) =>
                setSearchParams((prev) => ({
                  ...prev,
                  serial_number: e.target.value,
                }))
              }
              onSearch={(value) => handleSearch("serial_number", value)}
            />
            <Search
              placeholder="WXQP"
              allowClear={{ clearIcon: <CloseOutlined /> }}
              value={searchParams.WXQP}
              onChange={(e) =>
                setSearchParams((prev) => ({
                  ...prev,
                  WXQP: e.target.value,
                }))
              }
              onSearch={(value) => handleSearch("WXQP", value)}
            />
          </Flex>
        </section>
        <section
          style={{
            flex: 10,
            minHeight: 0,
            overflowY: "auto",
            // border: `1px solid ${token.colorBorder}`,
            // borderRadius: token.borderRadiusLG,
          }}
          id="main"
        >
          <Products filters={activeFilters} />
        </section>
        <section style={{ flex: 1 }} id="btns">
          <Flex gap={"medium"} justify="start">
            <Button size="large" onClick={() => setIsProductHistoryOpen(true)}>
              History
            </Button>
            <Button size="large" onClick={() => setIsDeficitModalOpen(true)}>
              Deficites
            </Button>
          </Flex>
        </section>
        {/* </Flex> */}
      </div>
      <Modal
        open={isProductHistoryOpen}
        onOk={() => setIsProductHistoryOpen(false)}
        onCancel={() => setIsProductHistoryOpen(false)}
        width={"fit-content"}
      >
        <ProductHistory />
      </Modal>
      <Modal
        open={isDeficitModalOpen}
        onOk={() => setIsDeficitModalOpen(false)}
        onCancel={() => setIsDeficitModalOpen(false)}
        width={"fit-content"}
      >
        <p>Deficites</p>
      </Modal>
    </>
  );
}
