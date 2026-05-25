import { Button, Flex, Input, Modal } from "antd";
import { Products } from "../modules/products/products";
import { useRef, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { ProductHistory } from "../modules/history/history";
import { AddProduct } from "../modules/products/addProduct";

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
  const [isAddProductModalOpen, setIsAddProductModalOpen] =
    useState<boolean>(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const handleSearch = (key: keyof typeof activeFilters, value: string) => {
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
          height: "100%",
        }}
      >
        <section id="filter" style={{ flex: "0 0 auto" }}>
          <Flex gap={"middle"} justify="start" wrap="wrap">
            <Search
              allowClear={{ clearIcon: <CloseOutlined /> }}
              placeholder="Code"
              style={{ minWidth: 150, flex: "1 1 150px" }}
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
              style={{ minWidth: 150, flex: "1 1 150px" }}
              value={searchParams.name}
              onChange={(e) =>
                setSearchParams((prev) => ({ ...prev, name: e.target.value }))
              }
              onSearch={(value) => handleSearch("name", value)}
            />
            <Search
              placeholder="Type"
              allowClear={{ clearIcon: <CloseOutlined /> }}
              style={{ minWidth: 150, flex: "1 1 150px" }}
              value={searchParams.type}
              onChange={(e) =>
                setSearchParams((prev) => ({ ...prev, type: e.target.value }))
              }
              onSearch={(value) => handleSearch("type", value)}
            />
            <Search
              placeholder="OEM"
              allowClear={{ clearIcon: <CloseOutlined /> }}
              style={{ minWidth: 150, flex: "1 1 150px" }}
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
              style={{ minWidth: 150, flex: "1 1 150px" }}
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
          ref={tableContainerRef}
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
          }}
          id="main"
        >
          <Products filters={activeFilters} containerRef={tableContainerRef} />
        </section>
        <section id="btns" style={{ flex: "0 0 auto" }}>
          <Flex gap={"middle"} justify="start" wrap="wrap">
            <Button size="large" onClick={() => setIsProductHistoryOpen(true)}>
              History
            </Button>
            <Button size="large" onClick={() => setIsDeficitModalOpen(true)}>
              Deficites
            </Button>
            <Button size="large" onClick={() => setIsAddProductModalOpen(true)}>
              Add Product
            </Button>
          </Flex>
        </section>
      </div>
      <Modal
        open={isProductHistoryOpen}
        closeIcon={false}
        onCancel={() => setIsProductHistoryOpen(false)}
        footer={(_, { CancelBtn }) => <CancelBtn />}
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
      <Modal
        open={isAddProductModalOpen}
        onOk={() => setIsAddProductModalOpen(false)}
        onCancel={() => setIsAddProductModalOpen(false)}
        width={"fit-content"}
      >
        <AddProduct />
      </Modal>
    </>
  );
}
